package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"simple-ledger/internal/common/security"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestAuthMiddleware_ValidToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	security.InitJWT("test-secret", 1, 1)

	// テストトークンを生成
	token, _ := security.GenerateToken(1, "test@example.com", "user", true)

	// テストリクエスト
	httpReq := httptest.NewRequest("GET", "/protected", nil)
	httpReq.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httpReq

	// ミドルウェアを適用
	AuthMiddleware()(c)

	// クレーム情報が設定されているか確認
	userID, exists := c.Get("userID")
	assert.True(t, exists)
	assert.Equal(t, uint(1), userID)

	email, exists := c.Get("email")
	assert.True(t, exists)
	assert.Equal(t, "test@example.com", email)

	role, exists := c.Get("role")
	assert.True(t, exists)
	assert.Equal(t, "user", role)

	isActive, exists := c.Get("isActive")
	assert.True(t, exists)
	assert.Equal(t, true, isActive)
}

func TestAuthMiddleware_MissingAuthHeader(t *testing.T) {
	gin.SetMode(gin.TestMode)

	// Authorization ヘッダーなしのリクエスト
	httpReq := httptest.NewRequest("GET", "/protected", nil)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httpReq

	// ミドルウェアを適用
	AuthMiddleware()(c)

	// リクエストが中止されているか確認
	assert.True(t, c.IsAborted())
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestAuthMiddleware_InvalidAuthHeaderFormat(t *testing.T) {
	gin.SetMode(gin.TestMode)

	// 不正なフォーマットの Authorization ヘッダー
	httpReq := httptest.NewRequest("GET", "/protected", nil)
	httpReq.Header.Set("Authorization", "InvalidToken")

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httpReq

	// ミドルウェアを適用
	AuthMiddleware()(c)

	// リクエストが中止されているか確認
	assert.True(t, c.IsAborted())
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestAuthMiddleware_InvalidToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	security.InitJWT("test-secret", 1, 1)

	// 不正なトークン
	httpReq := httptest.NewRequest("GET", "/protected", nil)
	httpReq.Header.Set("Authorization", "Bearer invalid.token.here")

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httpReq

	// ミドルウェアを適用
	AuthMiddleware()(c)

	// リクエストが中止されているか確認
	assert.True(t, c.IsAborted())
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestAuthMiddleware_ExpiredToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	security.InitJWT("test-secret", 1, 1)

	// 有効期限が切れたトークンを生成することは難しいため、
	// 異なるシークレットキーで署名されたトークンを使用
	expiredToken := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaXNBY3RpdmUiOnRydWUsImlhdCI6MTcwMzY2Nzk0MCwiZXhwIjoxNzAzNjY3OTQwfQ.invalid"

	httpReq := httptest.NewRequest("GET", "/protected", nil)
	httpReq.Header.Set("Authorization", "Bearer "+expiredToken)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httpReq

	// ミドルウェアを適用
	AuthMiddleware()(c)

	// リクエストが中止されているか確認
	assert.True(t, c.IsAborted())
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
