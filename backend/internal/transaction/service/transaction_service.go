package service

import (
	"errors"
	journalEntryDto "simple-ledger/internal/journal_entry/dto"
	journalEntryRepository "simple-ledger/internal/journal_entry/repository"
	journalEntryService "simple-ledger/internal/journal_entry/service"
	"simple-ledger/internal/models"
	"simple-ledger/internal/transaction/dto"
	"simple-ledger/internal/transaction/repository"
	"time"
)

type TransactionService interface {
	Create(userID uint, req *dto.CreateTransactionRequest) (*dto.TransactionResponse, error)
	GetByID(transactionID uint, userID uint) (*dto.TransactionResponse, error)
	GetByUserID(userID uint) (*dto.GetTransactionsResponse, error)
	GetByUserIDAndDateRange(userID uint, startDate string, endDate string) (*dto.GetTransactionsResponse, error)
	GetByUserIDWithPagination(userID uint, page, pageSize int) (*dto.GetTransactionsWithPaginationResponse, error)
	GetByUserIDWithPaginationAndKeyword(userID uint, page, pageSize int, keyword string) (*dto.GetTransactionsWithPaginationResponse, error)
	Update(transactionID uint, userID uint, req *dto.CreateTransactionRequest) (*dto.TransactionResponse, error)
	Delete(transactionID uint, userID uint) error
}

type transactionService struct {
	repo                *repository.TransactionRepository
	journalEntryRepo    *journalEntryRepository.JournalEntryRepository
	journalEntryService *journalEntryService.JournalEntryService
}

func NewTransactionService(
	repo *repository.TransactionRepository,
	journalEntryRepo *journalEntryRepository.JournalEntryRepository,
	journalEntrySvc *journalEntryService.JournalEntryService,
) TransactionService {
	return &transactionService{
		repo:                repo,
		journalEntryRepo:    journalEntryRepo,
		journalEntryService: journalEntrySvc,
	}
}

func (s *transactionService) Create(userID uint, req *dto.CreateTransactionRequest) (*dto.TransactionResponse, error) {
	// バリデーション
	if len(req.JournalEntries) < 2 {
		return nil, errors.New("transaction must have at least 2 journal entries (debit and credit)")
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, errors.New("invalid date format, use YYYY-MM-DD")
	}

	// トランザクション作成
	transaction := models.Transaction{
		UserID:      userID,
		Date:        date,
		Description: req.Description,
	}

	if err := s.repo.Create(&transaction); err != nil {
		return nil, err
	}

	// 仕訳エントリー作成
	var journalEntries []models.JournalEntry
	for _, entryReq := range req.JournalEntries {
		journalEntry := models.JournalEntry{
			TransactionID:     transaction.ID,
			ChartOfAccountsID: entryReq.ChartOfAccountsID,
			Type:              entryReq.Type,
			Amount:            entryReq.Amount,
			Description:       entryReq.Description,
		}
		journalEntries = append(journalEntries, journalEntry)
	}

	if err := s.journalEntryRepo.CreateBatch(journalEntries); err != nil {
		// トランザクション作成がロールバックされるように、エラーを返す
		s.repo.Delete(transaction.ID)
		return nil, err
	}

	// 複式簿記の検証
	isValid, err := s.journalEntryService.ValidateTransaction(transaction.ID)
	if !isValid || err != nil {
		s.repo.Delete(transaction.ID)
		s.journalEntryRepo.DeleteByTransactionID(transaction.ID)
		if err != nil {
			return nil, err
		}
		return nil, errors.New("transaction failed validation: debit and credit totals must be equal")
	}

	result, err := s.repo.GetByID(transaction.ID)
	if err != nil {
		return nil, err
	}

	return s.transactionToResponse(result), nil
}

func (s *transactionService) GetByID(transactionID uint, userID uint) (*dto.TransactionResponse, error) {
	transaction, err := s.repo.GetByID(transactionID)
	if err != nil {
		return nil, err
	}

	if transaction.UserID != userID {
		return nil, errors.New("unauthorized")
	}

	return s.transactionToResponse(transaction), nil
}

func (s *transactionService) GetByUserID(userID uint) (*dto.GetTransactionsResponse, error) {
	transactions, err := s.repo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	var responses []dto.TransactionResponse
	for _, tx := range transactions {
		responses = append(responses, *s.transactionToResponse(&tx))
	}

	return &dto.GetTransactionsResponse{
		Transactions: responses,
		Total:        len(responses),
	}, nil
}

func (s *transactionService) GetByUserIDAndDateRange(userID uint, startDate string, endDate string) (*dto.GetTransactionsResponse, error) {
	start, err := time.Parse("2006-01-02", startDate)
	if err != nil {
		return nil, errors.New("invalid startDate format, use YYYY-MM-DD")
	}

	end, err := time.Parse("2006-01-02", endDate)
	if err != nil {
		return nil, errors.New("invalid endDate format, use YYYY-MM-DD")
	}

	transactions, err := s.repo.GetByUserIDAndDateRange(userID, start, end)
	if err != nil {
		return nil, err
	}

	var responses []dto.TransactionResponse
	for _, tx := range transactions {
		responses = append(responses, *s.transactionToResponse(&tx))
	}

	return &dto.GetTransactionsResponse{
		Transactions: responses,
		Total:        len(responses),
	}, nil
}

func (s *transactionService) GetByUserIDWithPagination(userID uint, page, pageSize int) (*dto.GetTransactionsWithPaginationResponse, error) {
	transactions, totalCount, err := s.repo.GetByUserIDWithPagination(userID, page, pageSize)
	if err != nil {
		return nil, err
	}

	var responses []dto.TransactionResponse
	for _, tx := range transactions {
		responses = append(responses, *s.transactionToResponse(&tx))
	}

	hasNextPage := int64(page*pageSize) < totalCount

	return &dto.GetTransactionsWithPaginationResponse{
		Transactions: responses,
		Total:        int(totalCount),
		Page:         page,
		PageSize:     pageSize,
		HasNextPage:  hasNextPage,
	}, nil
}

func (s *transactionService) GetByUserIDWithPaginationAndKeyword(userID uint, page, pageSize int, keyword string) (*dto.GetTransactionsWithPaginationResponse, error) {
	transactions, totalCount, err := s.repo.GetByUserIDWithPaginationAndKeyword(userID, page, pageSize, keyword)
	if err != nil {
		return nil, err
	}

	var responses []dto.TransactionResponse
	for _, tx := range transactions {
		responses = append(responses, *s.transactionToResponse(&tx))
	}

	hasNextPage := int64(page*pageSize) < totalCount

	return &dto.GetTransactionsWithPaginationResponse{
		Transactions: responses,
		Total:        int(totalCount),
		Page:         page,
		PageSize:     pageSize,
		HasNextPage:  hasNextPage,
	}, nil
}

func (s *transactionService) Update(transactionID uint, userID uint, req *dto.CreateTransactionRequest) (*dto.TransactionResponse, error) {
	transaction, err := s.repo.GetByID(transactionID)
	if err != nil {
		return nil, err
	}

	if transaction.UserID != userID {
		return nil, errors.New("unauthorized")
	}

	if len(req.JournalEntries) < 2 {
		return nil, errors.New("transaction must have at least 2 journal entries (debit and credit)")
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, errors.New("invalid date format, use YYYY-MM-DD")
	}

	transaction.Date = date
	transaction.Description = req.Description

	if err := s.repo.Update(transaction); err != nil {
		return nil, err
	}

	// 既存の仕訳エントリーを削除
	if err := s.journalEntryRepo.DeleteByTransactionID(transactionID); err != nil {
		return nil, err
	}

	// 新しい仕訳エントリーを作成
	var journalEntries []models.JournalEntry
	for _, entryReq := range req.JournalEntries {
		journalEntry := models.JournalEntry{
			TransactionID:     transaction.ID,
			ChartOfAccountsID: entryReq.ChartOfAccountsID,
			Type:              entryReq.Type,
			Amount:            entryReq.Amount,
			Description:       entryReq.Description,
		}
		journalEntries = append(journalEntries, journalEntry)
	}

	if err := s.journalEntryRepo.CreateBatch(journalEntries); err != nil {
		return nil, err
	}

	// 複式簿記の検証
	isValid, err := s.journalEntryService.ValidateTransaction(transaction.ID)
	if !isValid || err != nil {
		s.journalEntryRepo.DeleteByTransactionID(transactionID)
		if err != nil {
			return nil, err
		}
		return nil, errors.New("transaction failed validation: debit and credit totals must be equal")
	}

	result, err := s.repo.GetByID(transaction.ID)
	if err != nil {
		return nil, err
	}

	return s.transactionToResponse(result), nil
}

func (s *transactionService) Delete(transactionID uint, userID uint) error {
	transaction, err := s.repo.GetByID(transactionID)
	if err != nil {
		return err
	}

	if transaction.UserID != userID {
		return errors.New("unauthorized")
	}

	// 関連する仕訳エントリーも削除
	if err := s.journalEntryRepo.DeleteByTransactionID(transactionID); err != nil {
		return err
	}

	return s.repo.Delete(transactionID)
}

func (s *transactionService) transactionToResponse(transaction *models.Transaction) *dto.TransactionResponse {
	response := &dto.TransactionResponse{
		ID:          transaction.ID,
		UserID:      transaction.UserID,
		Date:        transaction.Date.Format("2006-01-02"),
		Description: transaction.Description,
		CreatedAt:   transaction.CreatedAt,
		UpdatedAt:   transaction.UpdatedAt,
	}

	if len(transaction.JournalEntries) > 0 {
		response.JournalEntries = journalEntryDto.ToJournalEntryResponseSlice(transaction.JournalEntries)
	}

	return response
}
