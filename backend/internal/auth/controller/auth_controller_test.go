package controller

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"simple-ledger/internal/auth/dto"
	"simple-ledger/internal/auth/service"
	"simple-ledger/internal/common/security"
	"simple-ledger/internal/models"
	"simple-ledger/internal/user/repository"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestAuthController() (*AuthController, *gorm.DB) {
	gin.SetMode(gin.TestMode)
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	_ = db.AutoMigrate(&models.User{})
	userRepo := repository.NewUserRepository(db)
	authService := service.NewAuthService(userRepo)
	ctrl := NewAuthController(authService)
	security.InitJWT("test-secret", 1, 1)
	return ctrl, db
}

func TestLogin_Success(t *testing.T) {
	ctrl, db := setupTestAuthController()

	// テストユーザーを作成
	hashedPassword, _ := security.HashPassword("password123")
	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: hashedPassword,
		Role:     "user",
		IsActive: true,
	}
	db.Create(user)

	req := dto.LoginRequest{
		Email:    "test@example.com",
		Password: "password123",
	}

	body, _ := json.Marshal(req)
	httpReq := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
	httpReq.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httpReq

	ctrl.Login(c)

	assert.Equal(t, http.StatusOK, w.Code)

	var response dto.LoginResponse
	_ = json.Unmarshal(w.Body.Bytes(), &response)
	// トークンはHttpOnly Cookieに設定されるため、レスポンスには含まれない
	assert.Equal(t, security.GetTokenExpirationSeconds(), response.ExpiresIn)

	// Cookieが設定されているか確認
	cookies := w.Result().Cookies()
	assert.NotEmpty(t, cookies)
	var accessTokenFound, refreshTokenFound bool
	for _, cookie := range cookies {
		if cookie.Name == "accessToken" && cookie.Value != "" {
			accessTokenFound = true
		}
		if cookie.Name == "refreshToken" && cookie.Value != "" {
			refreshTokenFound = true
		}
	}
	assert.True(t, accessTokenFound, "accessToken cookie should be set")
	assert.True(t, refreshTokenFound, "refreshToken cookie should be set")
}

func TestLogin_InvalidEmail(t *testing.T) {
	ctrl, _ := setupTestAuthController()

	req := dto.LoginRequest{
		Email:    "nonexistent@example.com",
		Password: "password123",
	}

	body, _ := json.Marshal(req)
	httpReq := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
	httpReq.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httpReq

	ctrl.Login(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)

	var response map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NotNil(t, response["error"])
}

func TestLogin_InvalidPassword(t *testing.T) {
	ctrl, db := setupTestAuthController()

	// テストユーザーを作成
	hashedPassword, _ := security.HashPassword("password123")
	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: hashedPassword,
		Role:     "user",
		IsActive: true,
	}
	db.Create(user)

	req := dto.LoginRequest{
		Email:    "test@example.com",
		Password: "wrongpassword",
	}

	body, _ := json.Marshal(req)
	httpReq := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
	httpReq.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httpReq

	ctrl.Login(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestRefreshToken_Success(t *testing.T) {
	ctrl, db := setupTestAuthController()

	// テストユーザーを作成
	hashedPassword, _ := security.HashPassword("password123")
	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: hashedPassword,
		Role:     "user",
		IsActive: true,
	}
	db.Create(user)

	// ログインしてリフレッシュトークンを取得
	userRepo := repository.NewUserRepository(db)
	authService := service.NewAuthService(userRepo)
	_, refreshToken, _ := authService.Login("test@example.com", "password123")

	httpReq := httptest.NewRequest("POST", "/api/auth/refresh", nil)
	httpReq.AddCookie(&http.Cookie{
		Name:  "refreshToken",
		Value: refreshToken,
	})

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httpReq

	ctrl.RefreshToken(c)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &response)
	assert.Equal(t, float64(security.GetTokenExpirationSeconds()), response["expiresIn"])
}

func TestRefreshToken_InvalidToken(t *testing.T) {
	ctrl, _ := setupTestAuthController()

	httpReq := httptest.NewRequest("POST", "/api/auth/refresh", nil)
	httpReq.AddCookie(&http.Cookie{
		Name:  "refreshToken",
		Value: "invalid-token",
	})

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httpReq

	ctrl.RefreshToken(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
