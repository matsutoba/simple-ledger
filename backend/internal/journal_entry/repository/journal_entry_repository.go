package repository

import (
	"simple-ledger/internal/models"

	"gorm.io/gorm"
)

// JournalEntryRepository: 仕訳エントリーリポジトリ
type JournalEntryRepository struct {
	db *gorm.DB
}

// NewJournalEntryRepository: 仕訳エントリーリポジトリの生成
func NewJournalEntryRepository(db *gorm.DB) *JournalEntryRepository {
	return &JournalEntryRepository{db: db}
}

// Create: 仕訳エントリーを作成
func (r *JournalEntryRepository) Create(entry *models.JournalEntry) error {
	return r.db.Create(entry).Error
}

// GetByID: IDで仕訳エントリーを取得
func (r *JournalEntryRepository) GetByID(id uint) (*models.JournalEntry, error) {
	var entry models.JournalEntry
	if err := r.db.
		Preload("ChartOfAccounts").
		Preload("Transaction").
		Where("id = ?", id).
		First(&entry).Error; err != nil {
		return nil, err
	}
	return &entry, nil
}

// GetByTransactionID: 取引IDで仕訳エントリーの一覧を取得
func (r *JournalEntryRepository) GetByTransactionID(transactionID uint) ([]models.JournalEntry, error) {
	var entries []models.JournalEntry
	if err := r.db.
		Preload("ChartOfAccounts").
		Where("transaction_id = ?", transactionID).
		Find(&entries).Error; err != nil {
		return nil, err
	}
	return entries, nil
}

// GetByTransactionIDAndType: 取引IDとタイプで仕訳エントリーの一覧を取得
func (r *JournalEntryRepository) GetByTransactionIDAndType(transactionID uint, entryType models.EntryType) ([]models.JournalEntry, error) {
	var entries []models.JournalEntry
	if err := r.db.
		Preload("ChartOfAccounts").
		Where("transaction_id = ? AND type = ?", transactionID, entryType).
		Find(&entries).Error; err != nil {
		return nil, err
	}
	return entries, nil
}

// GetByTransactionIDAndChartOfAccountsID: 取引IDと勘定科目IDで仕訳エントリーの一覧を取得
func (r *JournalEntryRepository) GetByTransactionIDAndChartOfAccountsID(transactionID uint, chartOfAccountsID uint) ([]models.JournalEntry, error) {
	var entries []models.JournalEntry
	if err := r.db.
		Preload("ChartOfAccounts").
		Where("transaction_id = ? AND chart_of_accounts_id = ?", transactionID, chartOfAccountsID).
		Find(&entries).Error; err != nil {
		return nil, err
	}
	return entries, nil
}

// CreateBatch: 仕訳エントリーをバッチ作成
func (r *JournalEntryRepository) CreateBatch(entries []models.JournalEntry) error {
	return r.db.CreateInBatches(entries, 100).Error
}

// Update: 仕訳エントリーを更新
func (r *JournalEntryRepository) Update(entry *models.JournalEntry) error {
	return r.db.Save(entry).Error
}

// Delete: 仕訳エントリーを削除
func (r *JournalEntryRepository) Delete(id uint) error {
	return r.db.Where("id = ?", id).Delete(&models.JournalEntry{}).Error
}

// DeleteByTransactionID: 取引IDで仕訳エントリーを削除
func (r *JournalEntryRepository) DeleteByTransactionID(transactionID uint) error {
	return r.db.Where("transaction_id = ?", transactionID).Delete(&models.JournalEntry{}).Error
}

// CalculateDebitTotal: 取引IDの借方合計を計算
func (r *JournalEntryRepository) CalculateDebitTotal(transactionID uint) (int, error) {
	var total int
	if err := r.db.
		Model(&models.JournalEntry{}).
		Where("transaction_id = ? AND type = ?", transactionID, models.DebitEntry).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&total).Error; err != nil {
		return 0, err
	}
	return total, nil
}

// CalculateCreditTotal: 取引IDの貸方合計を計算
func (r *JournalEntryRepository) CalculateCreditTotal(transactionID uint) (int, error) {
	var total int
	if err := r.db.
		Model(&models.JournalEntry{}).
		Where("transaction_id = ? AND type = ?", transactionID, models.CreditEntry).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&total).Error; err != nil {
		return 0, err
	}
	return total, nil
}

// IsBalanced: 取引がバランスしているか確認（借方合計 = 貸方合計）
func (r *JournalEntryRepository) IsBalanced(transactionID uint) (bool, error) {
	debitTotal, err := r.CalculateDebitTotal(transactionID)
	if err != nil {
		return false, err
	}

	creditTotal, err := r.CalculateCreditTotal(transactionID)
	if err != nil {
		return false, err
	}

	return debitTotal == creditTotal, nil
}

// GetEntriesByChartOfAccountsID: 勘定科目IDで仕訳エントリーの一覧を取得
func (r *JournalEntryRepository) GetEntriesByChartOfAccountsID(chartOfAccountsID uint) ([]models.JournalEntry, error) {
	var entries []models.JournalEntry
	if err := r.db.
		Preload("Transaction").
		Where("chart_of_accounts_id = ?", chartOfAccountsID).
		Order("created_at DESC").
		Find(&entries).Error; err != nil {
		return nil, err
	}
	return entries, nil
}
