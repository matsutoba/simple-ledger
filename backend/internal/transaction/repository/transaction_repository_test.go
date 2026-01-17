package repository

import (
	"testing"
	"time"

	"simple-ledger/internal/models"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTransactionTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.AutoMigrate(&models.User{})
	db.AutoMigrate(&models.ChartOfAccounts{})
	db.AutoMigrate(&models.Transaction{})

	// テストデータの作成
	user := models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "hashed_password",
		Role:     "user",
		IsActive: true,
	}
	db.Create(&user)

	chartOfAccounts := models.ChartOfAccounts{
		Code:          "1000",
		Name:          "現金",
		Type:          models.AssetAccount,
		NormalBalance: models.DebitBalance,
		Description:   "現金資産",
		IsActive:      true,
	}
	db.Create(&chartOfAccounts)

	return db
}

func TestCreate(t *testing.T) {
	db := setupTransactionTestDB()
	repo := NewTransactionRepository(db)

	transaction := models.Transaction{
		UserID:            1,
		Date:              time.Date(2024, 12, 1, 0, 0, 0, 0, time.UTC),
		ChartOfAccountsID: 1,
		Amount:            50000,
		Description:       "テスト取引",
	}

	err := repo.Create(&transaction)
	assert.NoError(t, err)
	assert.NotZero(t, transaction.ID)
}

func TestGetByID(t *testing.T) {
	db := setupTransactionTestDB()
	repo := NewTransactionRepository(db)

	transaction := models.Transaction{
		UserID:            1,
		Date:              time.Date(2024, 12, 1, 0, 0, 0, 0, time.UTC),
		ChartOfAccountsID: 1,
		Amount:            50000,
		Description:       "テスト取引",
	}
	db.Create(&transaction)

	result, err := repo.GetByID(transaction.ID)
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, uint(1), result.UserID)
	assert.Equal(t, 50000, result.Amount)
}

func TestGetByUserID(t *testing.T) {
	db := setupTransactionTestDB()
	repo := NewTransactionRepository(db)

	transactions := []models.Transaction{
		{
			UserID:            1,
			Date:              time.Date(2024, 12, 1, 0, 0, 0, 0, time.UTC),
			ChartOfAccountsID: 1,
			Amount:            50000,
			Description:       "取引1",
		},
		{
			UserID:            1,
			Date:              time.Date(2024, 12, 2, 0, 0, 0, 0, time.UTC),
			ChartOfAccountsID: 1,
			Amount:            30000,
			Description:       "取引2",
		},
	}

	for _, tx := range transactions {
		db.Create(&tx)
	}

	results, err := repo.GetByUserID(1)
	assert.NoError(t, err)
	assert.Len(t, results, 2)
}

func TestGetByUserIDAndDateRange(t *testing.T) {
	db := setupTransactionTestDB()
	repo := NewTransactionRepository(db)

	transactions := []models.Transaction{
		{
			UserID:            1,
			Date:              time.Date(2024, 12, 1, 0, 0, 0, 0, time.UTC),
			ChartOfAccountsID: 1,
			Amount:            50000,
			Description:       "取引1",
		},
		{
			UserID:            1,
			Date:              time.Date(2024, 12, 15, 0, 0, 0, 0, time.UTC),
			ChartOfAccountsID: 1,
			Amount:            30000,
			Description:       "取引2",
		},
	}

	for _, tx := range transactions {
		db.Create(&tx)
	}

	startDate := time.Date(2024, 12, 10, 0, 0, 0, 0, time.UTC)
	endDate := time.Date(2024, 12, 20, 0, 0, 0, 0, time.UTC)

	results, err := repo.GetByUserIDAndDateRange(1, startDate, endDate)
	assert.NoError(t, err)
	assert.Len(t, results, 1)
	assert.Equal(t, 30000, results[0].Amount)
}

func TestDeleteByUserIDAndID(t *testing.T) {
	db := setupTransactionTestDB()
	repo := NewTransactionRepository(db)

	transaction := models.Transaction{
		UserID:            1,
		Date:              time.Date(2024, 12, 1, 0, 0, 0, 0, time.UTC),
		ChartOfAccountsID: 1,
		Amount:            50000,
		Description:       "テスト取引",
	}
	db.Create(&transaction)

	err := repo.DeleteByUserIDAndID(1, transaction.ID)
	assert.NoError(t, err)

	result, err := repo.GetByID(transaction.ID)
	assert.Error(t, err)
	assert.Nil(t, result)
}
