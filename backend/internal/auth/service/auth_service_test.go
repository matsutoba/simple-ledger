package service

import (
	"testing"

	"simple-ledger/internal/common/security"
	"simple-ledger/internal/models"
	"simple-ledger/internal/user/repository"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestAuthService() *AuthService {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.AutoMigrate(&models.User{})
	userRepo := repository.NewUserRepository(db)
	security.InitJWT("test-secret", 1, 1)
	return NewAuthService(userRepo)
}

func TestLogin_Success(t *testing.T) {
	service := setupTestAuthService()

	// テストユーザーを作成
	hashedPassword, _ := security.HashPassword("password123")
	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: hashedPassword,
		Role:     "user",
		IsActive: true,
	}
	service.userRepo.CreateUser(user)

	// ログイン処理
	accessToken, refreshToken, err := service.Login("test@example.com", "password123")

	assert.NoError(t, err)
	assert.NotEmpty(t, accessToken)
	assert.NotEmpty(t, refreshToken)
}

func TestLogin_InvalidEmail(t *testing.T) {
	service := setupTestAuthService()

	accessToken, refreshToken, err := service.Login("nonexistent@example.com", "password123")

	assert.Error(t, err)
	assert.Empty(t, accessToken)
	assert.Empty(t, refreshToken)
}

func TestLogin_InvalidPassword(t *testing.T) {
	service := setupTestAuthService()

	// テストユーザーを作成
	hashedPassword, _ := security.HashPassword("password123")
	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: hashedPassword,
		Role:     "user",
		IsActive: true,
	}
	service.userRepo.CreateUser(user)

	// 不正なパスワードでログイン
	accessToken, refreshToken, err := service.Login("test@example.com", "wrongpassword")

	assert.Error(t, err)
	assert.Empty(t, accessToken)
	assert.Empty(t, refreshToken)
}

func TestLogin_InactiveUser(t *testing.T) {
	service := setupTestAuthService()

	// 有効なユーザーを作成
	hashedPassword, _ := security.HashPassword("password123")
	user := &models.User{
		Email:    "inactive@example.com",
		Name:     "Inactive User",
		Password: hashedPassword,
		Role:     "user",
		IsActive: true,
	}
	err := service.userRepo.CreateUser(user)
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}

	// ユーザーを無効化
	service.userRepo.UpdateUser(user.ID, map[string]interface{}{"is_active": false})

	// ログイン処理
	accessToken, refreshToken, err := service.Login("inactive@example.com", "password123")

	assert.Error(t, err, "Should return error for inactive user")
	assert.Empty(t, accessToken)
	assert.Empty(t, refreshToken)
}

func TestRefreshAccessToken_Success(t *testing.T) {
	service := setupTestAuthService()

	// テストユーザーを作成
	hashedPassword, _ := security.HashPassword("password123")
	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: hashedPassword,
		Role:     "user",
		IsActive: true,
	}
	err := service.userRepo.CreateUser(user)
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}

	// ログイン
	_, refreshToken, _ := service.Login("test@example.com", "password123")

	// トークン更新
	newAccessToken, err := service.RefreshAccessToken(refreshToken)

	assert.NoError(t, err)
	assert.NotEmpty(t, newAccessToken)
}

func TestRefreshAccessToken_InvalidToken(t *testing.T) {
	service := setupTestAuthService()

	newAccessToken, err := service.RefreshAccessToken("invalid-token")

	assert.Error(t, err)
	assert.Empty(t, newAccessToken)
}

func TestRefreshAccessToken_InactiveUser(t *testing.T) {
	service := setupTestAuthService()

	// ユーザーを作成
	hashedPassword, _ := security.HashPassword("password123")
	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: hashedPassword,
		Role:     "user",
		IsActive: true,
	}
	service.userRepo.CreateUser(user)

	// ログイン
	_, refreshToken, _ := service.Login("test@example.com", "password123")

	// ユーザーを無効化
	user.IsActive = false
	service.userRepo.UpdateUser(user.ID, map[string]interface{}{"is_active": false})

	// トークン更新を試みる
	newAccessToken, err := service.RefreshAccessToken(refreshToken)

	assert.Error(t, err)
	assert.Empty(t, newAccessToken)
}
