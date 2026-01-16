package repository

import (
	"simple-ledger/internal/models"

	"gorm.io/gorm"
)

type ChartOfAccountsRepository interface {
	// GetByTypes: 指定された勘定科目区分のデータを取得
	GetByTypes(types []models.AccountType) ([]models.ChartOfAccounts, error)
}

type chartOfAccountsRepository struct {
	db *gorm.DB
}

func NewChartOfAccountsRepository(db *gorm.DB) ChartOfAccountsRepository {
	return &chartOfAccountsRepository{db: db}
}

func (r *chartOfAccountsRepository) GetByTypes(types []models.AccountType) ([]models.ChartOfAccounts, error) {
	var accounts []models.ChartOfAccounts

	// IsActive = trueかつ、指定されたTypesに該当するデータを取得
	// ソートは勘定科目コード順
	if err := r.db.
		Where("is_active = ?", true).
		Where("type IN ?", types).
		Order("code ASC").
		Find(&accounts).Error; err != nil {
		return nil, err
	}

	return accounts, nil
}
