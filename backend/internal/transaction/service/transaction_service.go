package service

import (
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
	repo *repository.TransactionRepository
}

func NewTransactionService(repo *repository.TransactionRepository) TransactionService {
	return &transactionService{repo: repo}
}

func (s *transactionService) Create(userID uint, req *dto.CreateTransactionRequest) (*dto.TransactionResponse, error) {
	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, err
	}

	transaction := models.Transaction{
		UserID:            userID,
		Date:              date,
		ChartOfAccountsID: req.ChartOfAccountsID,
		Amount:            req.Amount,
		Description:       req.Description,
	}

	if err := s.repo.Create(&transaction); err != nil {
		return nil, err
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
		return nil, nil
	}

	return s.transactionToResponse(transaction), nil
}

func (s *transactionService) GetByUserID(userID uint) (*dto.GetTransactionsResponse, error) {
	transactions, err := s.repo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	var responses []dto.TransactionResponse
	total := 0
	for _, tx := range transactions {
		responses = append(responses, *s.transactionToResponse(&tx))
		total += tx.Amount
	}

	return &dto.GetTransactionsResponse{
		Transactions: responses,
		Total:        total,
	}, nil
}

func (s *transactionService) GetByUserIDAndDateRange(userID uint, startDate string, endDate string) (*dto.GetTransactionsResponse, error) {
	start, err := time.Parse("2006-01-02", startDate)
	if err != nil {
		return nil, err
	}

	end, err := time.Parse("2006-01-02", endDate)
	if err != nil {
		return nil, err
	}

	transactions, err := s.repo.GetByUserIDAndDateRange(userID, start, end)
	if err != nil {
		return nil, err
	}

	var responses []dto.TransactionResponse
	total := 0
	for _, tx := range transactions {
		responses = append(responses, *s.transactionToResponse(&tx))
		total += tx.Amount
	}

	return &dto.GetTransactionsResponse{
		Transactions: responses,
		Total:        total,
	}, nil
}

func (s *transactionService) GetByUserIDWithPagination(userID uint, page, pageSize int) (*dto.GetTransactionsWithPaginationResponse, error) {
	transactions, totalCount, err := s.repo.GetByUserIDWithPagination(userID, page, pageSize)
	if err != nil {
		return nil, err
	}

	var responses []dto.TransactionResponse
	total := 0
	for _, tx := range transactions {
		responses = append(responses, *s.transactionToResponse(&tx))
		total += tx.Amount
	}

	hasNextPage := int64(page*pageSize) < totalCount

	return &dto.GetTransactionsWithPaginationResponse{
		Transactions: responses,
		Total:        total,
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
	total := 0
	for _, tx := range transactions {
		responses = append(responses, *s.transactionToResponse(&tx))
		total += tx.Amount
	}

	hasNextPage := int64(page*pageSize) < totalCount

	return &dto.GetTransactionsWithPaginationResponse{
		Transactions: responses,
		Total:        total,
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
		return nil, nil
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, err
	}

	transaction.Date = date
	transaction.ChartOfAccountsID = req.ChartOfAccountsID
	transaction.Amount = req.Amount
	transaction.Description = req.Description

	if err := s.repo.Update(transaction); err != nil {
		return nil, err
	}

	result, err := s.repo.GetByID(transaction.ID)
	if err != nil {
		return nil, err
	}

	return s.transactionToResponse(result), nil
}

func (s *transactionService) Delete(transactionID uint, userID uint) error {
	return s.repo.DeleteByUserIDAndID(userID, transactionID)
}

func (s *transactionService) transactionToResponse(transaction *models.Transaction) *dto.TransactionResponse {
	response := &dto.TransactionResponse{
		ID:                transaction.ID,
		UserID:            transaction.UserID,
		Date:              transaction.Date.Format("2006-01-02"),
		ChartOfAccountsID: transaction.ChartOfAccountsID,
		Amount:            transaction.Amount,
		Description:       transaction.Description,
		CreatedAt:         transaction.CreatedAt,
		UpdatedAt:         transaction.UpdatedAt,
	}

	if transaction.ChartOfAccounts != nil {
		response.ChartOfAccountsCode = transaction.ChartOfAccounts.Code
		response.ChartOfAccountsName = transaction.ChartOfAccounts.Name
		response.ChartOfAccountsType = string(transaction.ChartOfAccounts.Type)
	}

	return response
}
