package security

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestGenerateToken(t *testing.T) {
	InitJWT("test-secret", 1, 1)

	token, err := GenerateToken(1, "test@example.com", "user", true)

	assert.NoError(t, err)
	assert.NotEmpty(t, token)
}

func TestVerifyToken_Success(t *testing.T) {
	InitJWT("test-secret", 1, 1)

	// トークンを生成
	token, _ := GenerateToken(1, "test@example.com", "user", true)

	// トークンを検証
	claims, err := VerifyToken(token)

	assert.NoError(t, err)
	assert.Equal(t, uint(1), claims.UserID)
	assert.Equal(t, "test@example.com", claims.Email)
	assert.Equal(t, "user", claims.Role)
	assert.True(t, claims.IsActive)
}

func TestVerifyToken_InvalidToken(t *testing.T) {
	InitJWT("test-secret", 1, 1)

	claims, err := VerifyToken("invalid-token")

	assert.Error(t, err)
	assert.Nil(t, claims)
}

func TestVerifyToken_TamperedToken(t *testing.T) {
	InitJWT("test-secret", 1, 1)

	// トークンを生成
	token, _ := GenerateToken(1, "test@example.com", "user", true)

	// トークンを改ざん
	tamperedToken := token + "tampered"

	claims, err := VerifyToken(tamperedToken)

	assert.Error(t, err)
	assert.Nil(t, claims)
}

func TestGenerateRefreshToken(t *testing.T) {
	InitJWT("test-secret", 1, 1)

	token, err := GenerateRefreshToken(1, "test@example.com", "user", true)

	assert.NoError(t, err)
	assert.NotEmpty(t, token)
}

func TestRefreshTokenExpiration(t *testing.T) {
	InitJWT("test-secret", 1, 1)

	// リフレッシュトークンを生成
	token, _ := GenerateRefreshToken(1, "test@example.com", "user", true)

	// トークンを検証
	claims, err := VerifyToken(token)

	assert.NoError(t, err)
	assert.NotNil(t, claims.ExpiresAt)

	// 有効期限が約1時間後であることを確認
	expectedExpiration := time.Now().Add(1 * time.Hour)
	diff := expectedExpiration.Sub(claims.ExpiresAt.Time).Abs()
	assert.Less(t, diff, 1*time.Minute) // 1分以内の誤差
}

func TestTokenWithDifferentSecrets(t *testing.T) {
	// Secret1 でトークン生成
	InitJWT("secret1", 1, 1)
	token, _ := GenerateToken(1, "test@example.com", "user", true)

	// Secret2 で検証（失敗するはず）
	InitJWT("secret2", 1, 1)
	claims, err := VerifyToken(token)

	assert.Error(t, err)
	assert.Nil(t, claims)
}
