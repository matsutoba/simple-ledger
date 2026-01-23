package service

import (
	"testing"
	"time"

	"simple-ledger/internal/models"
	"simple-ledger/internal/transaction/repository"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupServiceTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err := db.AutoMigrate(&models.User{}); err != nil {
		panic(err)
	}
	if err := db.AutoMigrate(&models.ChartOfAccounts{}); err != nil {
		panic(err)
	}
	if err := db.AutoMigrate(&models.Transaction{}); err != nil {
		panic(err)
	}

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

func TestGetByUserIDWithPagination(t *testing.T) {
	db := setupServiceTestDB()
	repo := repository.NewTransactionRepository(db)
	svc := NewTransactionService(repo)

	// テストデータの作成（30件）
	for i := 1; i <= 30; i++ {
		transaction := models.Transaction{
			UserID:            1,
			Date:              time.Date(2024, 12, i%28+1, 0, 0, 0, 0, time.UTC),
			ChartOfAccountsID: 1,
			Amount:            10000 * i,
			Description:       "テスト取引",
		}
		db.Create(&transaction)
	}

	// テスト1: ページ1, ページサイズ10を取得
	result, err := svc.GetByUserIDWithPagination(1, 1, 10)
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result.Transactions, 10)
	assert.Equal(t, 1, result.Page)
	assert.Equal(t, 10, result.PageSize)
	assert.True(t, result.HasNextPage) // 全30件なのでページ2がある

	// テスト2: ページ2を取得
	result, err = svc.GetByUserIDWithPagination(1, 2, 10)
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result.Transactions, 10)
	assert.Equal(t, 2, result.Page)
	assert.True(t, result.HasNextPage) // ページ3がある

	// テスト3: ページ3を取得（最後のページ）
	result, err = svc.GetByUserIDWithPagination(1, 3, 10)
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result.Transactions, 10)
	assert.Equal(t, 3, result.Page)
	assert.False(t, result.HasNextPage) // 次ページはない

	// テスト4: ページサイズを変更（ページサイズ20）
	result, err = svc.GetByUserIDWithPagination(1, 1, 20)
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result.Transactions, 20)
	assert.Equal(t, 20, result.PageSize)
	assert.True(t, result.HasNextPage) // ページ2がある

	// テスト5: 最後のページ（ページサイズ20の場合）
	result, err = svc.GetByUserIDWithPagination(1, 2, 20)
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result.Transactions, 10)
	assert.False(t, result.HasNextPage) // 次ページはない

	// テスト6: 別のユーザーで検索（該当なし）
	result, err = svc.GetByUserIDWithPagination(2, 1, 10)
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result.Transactions, 0)
	assert.False(t, result.HasNextPage)
}

func TestGetByUserIDWithPaginationEdgeCase(t *testing.T) {
	db := setupServiceTestDB()
	repo := repository.NewTransactionRepository(db)
	svc := NewTransactionService(repo)

	// テストデータの作成（5件）
	for i := 1; i <= 5; i++ {
		transaction := models.Transaction{
			UserID:            1,
			Date:              time.Date(2024, 12, i, 0, 0, 0, 0, time.UTC),
			ChartOfAccountsID: 1,
			Amount:            10000 * i,
			Description:       "テスト取引",
		}
		db.Create(&transaction)
	}

	// テスト1: ページサイズが件数より大きい場合
	result, err := svc.GetByUserIDWithPagination(1, 1, 10)
	assert.NoError(t, err)
	assert.Len(t, result.Transactions, 5)
	assert.False(t, result.HasNextPage)

	// テスト2: ページサイズが件数と同じ
	result, err = svc.GetByUserIDWithPagination(1, 1, 5)
	assert.NoError(t, err)
	assert.Len(t, result.Transactions, 5)
	assert.False(t, result.HasNextPage)

	// テスト3: 存在しないページを取得
	result, err = svc.GetByUserIDWithPagination(1, 10, 10)
	assert.NoError(t, err)
	assert.Len(t, result.Transactions, 0)
	assert.False(t, result.HasNextPage)
}
