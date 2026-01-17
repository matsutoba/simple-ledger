package repository

import (
	"testing"

	"simple-ledger/internal/models"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupChartOfAccountsTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	_ = db.AutoMigrate(&models.ChartOfAccounts{})
	return db
}

func TestGetByTypes_SingleType(t *testing.T) {
	db := setupChartOfAccountsTestDB()
	repo := NewChartOfAccountsRepository(db)

	accounts := []models.ChartOfAccounts{
		{Code: "4000", Name: "売上", Type: models.RevenueAccount, NormalBalance: models.CreditBalance, IsActive: true},
		{Code: "5000", Name: "仕入", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, IsActive: true},
	}
	for _, acc := range accounts {
		db.Create(&acc)
	}

	result, err := repo.GetByTypes([]models.AccountType{models.RevenueAccount})
	assert.NoError(t, err)
	assert.Len(t, result, 1)
	assert.Equal(t, "4000", result[0].Code)
}

func TestGetByTypes_MultipleTypes(t *testing.T) {
	db := setupChartOfAccountsTestDB()
	repo := NewChartOfAccountsRepository(db)

	accounts := []models.ChartOfAccounts{
		{Code: "4000", Name: "売上", Type: models.RevenueAccount, NormalBalance: models.CreditBalance, IsActive: true},
		{Code: "5000", Name: "仕入", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, IsActive: true},
	}
	for _, acc := range accounts {
		db.Create(&acc)
	}

	result, err := repo.GetByTypes([]models.AccountType{models.RevenueAccount, models.ExpenseAccount})
	assert.NoError(t, err)
	assert.Len(t, result, 2)
}

func TestGetByTypes_EmptyResult(t *testing.T) {
	db := setupChartOfAccountsTestDB()
	repo := NewChartOfAccountsRepository(db)

	result, err := repo.GetByTypes([]models.AccountType{models.LiabilityAccount})
	assert.NoError(t, err)
	assert.Len(t, result, 0)
}
