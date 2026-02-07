package controller

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	jeDto "simple-ledger/internal/journal_entry/dto"
	jerepository "simple-ledger/internal/journal_entry/repository"
	jeservice "simple-ledger/internal/journal_entry/service"
	"simple-ledger/internal/models"
	"simple-ledger/internal/transaction/dto"
	txrepository "simple-ledger/internal/transaction/repository"
	txservice "simple-ledger/internal/transaction/service"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupControllerTestDB() *gorm.DB {
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
	if err := db.AutoMigrate(&models.JournalEntry{}); err != nil {
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

func TestGetByUserIDWithPaginationController(t *testing.T) {
	db := setupControllerTestDB()
	txRepo := txrepository.NewTransactionRepository(db)
	jeRepo := jerepository.NewJournalEntryRepository(db)
	jeSvc := jeservice.NewJournalEntryService(jeRepo)
	svc := txservice.NewTransactionService(txRepo, jeRepo, jeSvc)
	ctrl := NewTransactionController(svc)

	// テストデータの作成（30件）
	for i := 1; i <= 30; i++ {
		transaction := models.Transaction{
			UserID:      1,
			Date:        time.Date(2024, 12, i%28+1, 0, 0, 0, 0, time.UTC),
			Description: "テスト取引",
		}
		db.Create(&transaction)
	}

	// テスト1: ページ1を取得
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/transactions/paginated?page=1&pageSize=10", nil)
	c, _ := gin.CreateTestContext(w)
	c.Request = req
	c.Set("userID", uint(1))

	ctrl.GetByUserIDWithPagination()(c)

	assert.Equal(t, http.StatusOK, w.Code)

	var response dto.GetTransactionsWithPaginationResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)

	assert.Equal(t, 1, response.Page)
	assert.Equal(t, 10, response.PageSize)
	assert.Len(t, response.Transactions, 10)
	assert.True(t, response.HasNextPage)

	// テスト2: ページ3を取得（最後のページ）
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("GET", "/api/transactions/paginated?page=3&pageSize=10", nil)
	c, _ = gin.CreateTestContext(w)
	c.Request = req
	c.Set("userID", uint(1))

	ctrl.GetByUserIDWithPagination()(c)

	assert.Equal(t, http.StatusOK, w.Code)

	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)

	assert.Equal(t, 3, response.Page)
	assert.Len(t, response.Transactions, 10)
	assert.False(t, response.HasNextPage)
}

func TestGetByUserIDWithPaginationMissingParams(t *testing.T) {
	db := setupControllerTestDB()
	txRepo := txrepository.NewTransactionRepository(db)
	jeRepo := jerepository.NewJournalEntryRepository(db)
	jeSvc := jeservice.NewJournalEntryService(jeRepo)
	svc := txservice.NewTransactionService(txRepo, jeRepo, jeSvc)
	ctrl := NewTransactionController(svc)

	// ページパラメータなし
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/transactions/paginated", nil)
	c, _ := gin.CreateTestContext(w)
	c.Request = req
	c.Set("userID", uint(1))

	ctrl.GetByUserIDWithPagination()(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestGetByUserIDWithPaginationMissingUserID(t *testing.T) {
	db := setupControllerTestDB()
	txRepo := txrepository.NewTransactionRepository(db)
	jeRepo := jerepository.NewJournalEntryRepository(db)
	jeSvc := jeservice.NewJournalEntryService(jeRepo)
	svc := txservice.NewTransactionService(txRepo, jeRepo, jeSvc)
	ctrl := NewTransactionController(svc)

	// userID context なし
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/transactions/paginated?page=1&pageSize=10", nil)
	c, _ := gin.CreateTestContext(w)
	c.Request = req

	ctrl.GetByUserIDWithPagination()(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// TestCreateTransactionWithDoubleEntry: コントローラー - Create複式簿記対応
func TestCreateTransactionWithDoubleEntry(t *testing.T) {
	db := setupControllerTestDB()
	txRepo := txrepository.NewTransactionRepository(db)
	jeRepo := jerepository.NewJournalEntryRepository(db)
	jeSvc := jeservice.NewJournalEntryService(jeRepo)
	svc := txservice.NewTransactionService(txRepo, jeRepo, jeSvc)
	ctrl := NewTransactionController(svc)

	// 必要な勘定科目を作成
	accountDebit := models.ChartOfAccounts{
		Code: "1000", Name: "現金", Type: models.AssetAccount,
		NormalBalance: models.DebitBalance, IsActive: true,
	}
	db.Create(&accountDebit)

	accountCredit := models.ChartOfAccounts{
		Code: "4000", Name: "売上", Type: models.RevenueAccount,
		NormalBalance: models.CreditBalance, IsActive: true,
	}
	db.Create(&accountCredit)

	req := dto.CreateTransactionRequest{
		Date:        "2024-12-01",
		Description: "商品販売",
		JournalEntries: []jeDto.CreateJournalEntryRequest{
			{ChartOfAccountsID: accountDebit.ID, Type: models.DebitEntry, Amount: 100000, Description: "販売"},
			{ChartOfAccountsID: accountCredit.ID, Type: models.CreditEntry, Amount: 100000, Description: "販売"},
		},
	}

	w := httptest.NewRecorder()
	jsonReq, _ := json.Marshal(req)
	httpReq, _ := http.NewRequest("POST", "/api/transactions", bytes.NewBuffer(jsonReq))
	httpReq.Header.Set("Content-Type", "application/json")
	c, _ := gin.CreateTestContext(w)
	c.Request = httpReq
	c.Set("userID", uint(1))

	ctrl.Create()(c)

	assert.Equal(t, http.StatusCreated, w.Code)

	var response dto.TransactionResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, uint(1), response.UserID)
	assert.Equal(t, "2024-12-01", response.Date)
	assert.Len(t, response.JournalEntries, 2)
}

// TestCreateTransactionWithUnbalancedEntries: コントローラー - バランスなしエラー
func TestCreateTransactionWithUnbalancedEntries(t *testing.T) {
	db := setupControllerTestDB()
	txRepo := txrepository.NewTransactionRepository(db)
	jeRepo := jerepository.NewJournalEntryRepository(db)
	jeSvc := jeservice.NewJournalEntryService(jeRepo)
	svc := txservice.NewTransactionService(txRepo, jeRepo, jeSvc)
	ctrl := NewTransactionController(svc)

	accountDebit := models.ChartOfAccounts{
		Code: "1000", Name: "現金", Type: models.AssetAccount,
		NormalBalance: models.DebitBalance, IsActive: true,
	}
	db.Create(&accountDebit)

	accountCredit := models.ChartOfAccounts{
		Code: "4000", Name: "売上", Type: models.RevenueAccount,
		NormalBalance: models.CreditBalance, IsActive: true,
	}
	db.Create(&accountCredit)

	req := dto.CreateTransactionRequest{
		Date:        "2024-12-01",
		Description: "バランスなし",
		JournalEntries: []jeDto.CreateJournalEntryRequest{
			{ChartOfAccountsID: accountDebit.ID, Type: models.DebitEntry, Amount: 100000, Description: "販売"},
			{ChartOfAccountsID: accountCredit.ID, Type: models.CreditEntry, Amount: 50000, Description: "販売"},
		},
	}

	w := httptest.NewRecorder()
	jsonReq, _ := json.Marshal(req)
	httpReq, _ := http.NewRequest("POST", "/api/transactions", bytes.NewBuffer(jsonReq))
	httpReq.Header.Set("Content-Type", "application/json")
	c, _ := gin.CreateTestContext(w)
	c.Request = httpReq
	c.Set("userID", uint(1))

	ctrl.Create()(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "debit total must equal credit total")
}

// TestCreateTransactionInvalidJSON: コントローラー - 不正なJSON
func TestCreateTransactionInvalidJSON(t *testing.T) {
	db := setupControllerTestDB()
	txRepo := txrepository.NewTransactionRepository(db)
	jeRepo := jerepository.NewJournalEntryRepository(db)
	jeSvc := jeservice.NewJournalEntryService(jeRepo)
	svc := txservice.NewTransactionService(txRepo, jeRepo, jeSvc)
	ctrl := NewTransactionController(svc)

	w := httptest.NewRecorder()
	httpReq, _ := http.NewRequest("POST", "/api/transactions", bytes.NewBuffer([]byte("invalid json")))
	httpReq.Header.Set("Content-Type", "application/json")
	c, _ := gin.CreateTestContext(w)
	c.Request = httpReq
	c.Set("userID", uint(1))

	ctrl.Create()(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid request body")
}
