package service

import (
	"errors"
	"simple-ledger/internal/journal_entry/dto"
	"simple-ledger/internal/journal_entry/repository"
	"simple-ledger/internal/models"
)

// JournalEntryService: 仕訳エントリーサービス
type JournalEntryService struct {
	repo *repository.JournalEntryRepository
}

// NewJournalEntryService: 仕訳エントリーサービスの生成
func NewJournalEntryService(repo *repository.JournalEntryRepository) *JournalEntryService {
	return &JournalEntryService{repo: repo}
}

// CreateJournalEntry: 仕訳エントリーを作成
func (s *JournalEntryService) CreateJournalEntry(transactionID uint, req *dto.CreateJournalEntryRequest) (*models.JournalEntry, error) {
	if transactionID == 0 {
		return nil, errors.New("transaction ID is required")
	}

	if req.Amount <= 0 {
		return nil, errors.New("amount must be greater than 0")
	}

	entry := &models.JournalEntry{
		TransactionID:     transactionID,
		ChartOfAccountsID: req.ChartOfAccountsID,
		Type:              req.Type,
		Amount:            req.Amount,
		Description:       req.Description,
	}

	if err := s.repo.Create(entry); err != nil {
		return nil, err
	}

	return entry, nil
}

// GetJournalEntryByID: IDで仕訳エントリーを取得
func (s *JournalEntryService) GetJournalEntryByID(id uint) (*models.JournalEntry, error) {
	if id == 0 {
		return nil, errors.New("journal entry ID is required")
	}

	entry, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	return entry, nil
}

// GetJournalEntriesByTransactionID: 取引IDで仕訳エントリーの一覧を取得
func (s *JournalEntryService) GetJournalEntriesByTransactionID(transactionID uint) ([]models.JournalEntry, error) {
	if transactionID == 0 {
		return nil, errors.New("transaction ID is required")
	}

	entries, err := s.repo.GetByTransactionID(transactionID)
	if err != nil {
		return nil, err
	}

	return entries, nil
}

// ValidateTransaction: 取引がバランスしているか確認（複式簿記の基本原則）
func (s *JournalEntryService) ValidateTransaction(transactionID uint) (bool, error) {
	entries, err := s.repo.GetByTransactionID(transactionID)
	if err != nil {
		return false, err
	}

	// 最低2つのエントリーが必要（借方1 + 貸方1）
	if len(entries) < 2 {
		return false, errors.New("transaction must have at least 2 entries (debit and credit)")
	}

	// 借方と貸方の両方が存在するか確認
	hasDebit := false
	hasCredit := false

	for _, entry := range entries {
		if entry.Type == models.DebitEntry {
			hasDebit = true
		} else if entry.Type == models.CreditEntry {
			hasCredit = true
		}
	}

	if !hasDebit || !hasCredit {
		return false, errors.New("transaction must have both debit and credit entries")
	}

	// 借方合計 = 貸方合計を確認
	isBalanced, err := s.repo.IsBalanced(transactionID)
	if err != nil {
		return false, err
	}

	if !isBalanced {
		debitTotal, _ := s.repo.CalculateDebitTotal(transactionID)
		creditTotal, _ := s.repo.CalculateCreditTotal(transactionID)
		return false, errors.New("debit total must equal credit total (debit: " + string(rune(debitTotal)) + ", credit: " + string(rune(creditTotal)) + ")")
	}

	return true, nil
}

// UpdateJournalEntry: 仕訳エントリーを更新
func (s *JournalEntryService) UpdateJournalEntry(id uint, req *dto.CreateJournalEntryRequest) (*models.JournalEntry, error) {
	if id == 0 {
		return nil, errors.New("journal entry ID is required")
	}

	if req.Amount <= 0 {
		return nil, errors.New("amount must be greater than 0")
	}

	entry, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	entry.ChartOfAccountsID = req.ChartOfAccountsID
	entry.Type = req.Type
	entry.Amount = req.Amount
	entry.Description = req.Description

	if err := s.repo.Update(entry); err != nil {
		return nil, err
	}

	return entry, nil
}

// DeleteJournalEntry: 仕訳エントリーを削除
func (s *JournalEntryService) DeleteJournalEntry(id uint) error {
	if id == 0 {
		return errors.New("journal entry ID is required")
	}

	return s.repo.Delete(id)
}

// GetJournalEntriesByTransactionIDWithValidation: 取引IDで仕訳エントリーを取得（バリデーション付き）
func (s *JournalEntryService) GetJournalEntriesByTransactionIDWithValidation(transactionID uint) ([]models.JournalEntry, bool, error) {
	entries, err := s.repo.GetByTransactionID(transactionID)
	if err != nil {
		return nil, false, err
	}

	isValid, err := s.ValidateTransaction(transactionID)
	if err != nil {
		return entries, false, nil
	}

	return entries, isValid, nil
}

// CalculateAccountBalance: 勘定科目の残高を計算
func (s *JournalEntryService) CalculateAccountBalance(chartOfAccountsID uint, normalBalance models.NormalBalance) (int, error) {
	entries, err := s.repo.GetEntriesByChartOfAccountsID(chartOfAccountsID)
	if err != nil {
		return 0, err
	}

	var balance int

	for _, entry := range entries {
		// 通常残高に基づいて借方/貸方の符号を決定
		if normalBalance == models.DebitBalance {
			// 借方が正常残高の場合、借方は+、貸方は-
			if entry.Type == models.DebitEntry {
				balance += entry.Amount
			} else {
				balance -= entry.Amount
			}
		} else {
			// 貸方が正常残高の場合、貸方は+、借方は-
			if entry.Type == models.CreditEntry {
				balance += entry.Amount
			} else {
				balance -= entry.Amount
			}
		}
	}

	return balance, nil
}
