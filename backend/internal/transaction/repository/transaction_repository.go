package repository

import (
	"simple-ledger/internal/models"
	"time"

	"gorm.io/gorm"
)

// TransactionRepository: 取引リポジトリ
type TransactionRepository struct {
	db *gorm.DB
}

// NewTransactionRepository: 取引リポジトリの生成
func NewTransactionRepository(db *gorm.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

// Create: 取引を作成
func (r *TransactionRepository) Create(transaction *models.Transaction) error {
	return r.db.Create(transaction).Error
}

// GetByID: IDで取引を取得
func (r *TransactionRepository) GetByID(id uint) (*models.Transaction, error) {
	var transaction models.Transaction
	if err := r.db.
		Preload("ChartOfAccounts").
		Preload("User").
		Where("id = ?", id).
		First(&transaction).Error; err != nil {
		return nil, err
	}
	return &transaction, nil
}

// GetByUserID: ユーザーIDで取引一覧を取得
func (r *TransactionRepository) GetByUserID(userID uint) ([]models.Transaction, error) {
	var transactions []models.Transaction
	if err := r.db.
		Preload("ChartOfAccounts").
		Where("user_id = ?", userID).
		Order("date DESC, created_at DESC").
		Find(&transactions).Error; err != nil {
		return nil, err
	}
	return transactions, nil
}

// GetByUserIDAndDateRange: ユーザーIDと期間で取引一覧を取得
func (r *TransactionRepository) GetByUserIDAndDateRange(
	userID uint,
	startDate time.Time,
	endDate time.Time,
) ([]models.Transaction, error) {
	var transactions []models.Transaction
	if err := r.db.
		Preload("ChartOfAccounts").
		Where("user_id = ? AND date BETWEEN ? AND ?", userID, startDate, endDate).
		Order("date DESC, created_at DESC").
		Find(&transactions).Error; err != nil {
		return nil, err
	}
	return transactions, nil
}

// GetByUserIDWithPagination: ユーザーIDで取引一覧をページネーション付きで取得
func (r *TransactionRepository) GetByUserIDWithPagination(userID uint, page, pageSize int) ([]models.Transaction, int64, error) {
	var transactions []models.Transaction
	var total int64

	// 全件数を取得
	if err := r.db.
		Where("user_id = ?", userID).
		Model(&models.Transaction{}).
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// ページネーション付きでデータを取得
	offset := (page - 1) * pageSize
	if err := r.db.
		Preload("ChartOfAccounts").
		Where("user_id = ?", userID).
		Order("date DESC, created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&transactions).Error; err != nil {
		return nil, 0, err
	}

	return transactions, total, nil
}

// GetByUserIDWithPaginationAndKeyword: ユーザーIDで取引一覧をページネーション・キーワード検索付きで取得
func (r *TransactionRepository) GetByUserIDWithPaginationAndKeyword(userID uint, page, pageSize int, keyword string) ([]models.Transaction, int64, error) {
	var transactions []models.Transaction
	var total int64

	query := r.db.Where("user_id = ?", userID)

	// キーワード検索（amountとdescriptionで部分一致）
	if keyword != "" {
		query = query.Where("description LIKE ? OR CAST(amount AS CHAR) LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}

	// 全件数を取得
	if err := query.
		Model(&models.Transaction{}).
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// ページネーション付きでデータを取得
	offset := (page - 1) * pageSize
	if err := query.
		Preload("ChartOfAccounts").
		Order("date DESC, created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&transactions).Error; err != nil {
		return nil, 0, err
	}

	return transactions, total, nil
}

// GetByUserIDAndChartOfAccountsID: ユーザーIDと勘定科目IDで取引一覧を取得
func (r *TransactionRepository) GetByUserIDAndChartOfAccountsID(
	userID uint,
	chartOfAccountsID uint,
) ([]models.Transaction, error) {
	var transactions []models.Transaction
	if err := r.db.
		Preload("ChartOfAccounts").
		Where("user_id = ? AND chart_of_accounts_id = ?", userID, chartOfAccountsID).
		Order("date DESC, created_at DESC").
		Find(&transactions).Error; err != nil {
		return nil, err
	}
	return transactions, nil
}

// Update: 取引を更新
func (r *TransactionRepository) Update(transaction *models.Transaction) error {
	return r.db.Save(transaction).Error
}

// Delete: 取引を削除
func (r *TransactionRepository) Delete(id uint) error {
	return r.db.Where("id = ?", id).Delete(&models.Transaction{}).Error
}

// DeleteByUserIDAndID: ユーザーIDと取引IDで削除（権限確認用）
func (r *TransactionRepository) DeleteByUserIDAndID(userID uint, transactionID uint) error {
	return r.db.
		Where("id = ? AND user_id = ?", transactionID, userID).
		Delete(&models.Transaction{}).Error
}
