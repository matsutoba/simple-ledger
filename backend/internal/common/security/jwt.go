package security

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	jwtSecret              []byte
	tokenExpiration        = 1 * time.Hour
	refreshTokenExpiration = 1 * time.Hour
)

// InitJWT は JWT シークレットキーと有効期限を初期化
func InitJWT(secret string, tokenExpirationHours float64, refreshTokenExpirationHours float64) {
	if secret == "" {
		secret = "development-secret-key-change-in-production"
	}
	jwtSecret = []byte(secret)

	if tokenExpirationHours > 0 {
		tokenExpiration = time.Duration(tokenExpirationHours * float64(time.Hour))
	}
	if refreshTokenExpirationHours > 0 {
		refreshTokenExpiration = time.Duration(refreshTokenExpirationHours * float64(time.Hour))
	}
}

// GetTokenExpirationSeconds はアクセストークンの有効期限を秒で返す
func GetTokenExpirationSeconds() int {
	return int(tokenExpiration.Seconds())
}

// GetRefreshTokenExpirationSeconds はリフレッシュトークンの有効期限を秒で返す
func GetRefreshTokenExpirationSeconds() int {
	return int(refreshTokenExpiration.Seconds())
}

// CustomClaims は JWT カスタムクレーム
type CustomClaims struct {
	UserID   uint   `json:"userId"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	IsActive bool   `json:"isActive"`
	jwt.RegisteredClaims
}

// GenerateToken はアクセストークンを生成
func GenerateToken(userID uint, email string, role string, isActive bool) (string, error) {
	claims := CustomClaims{
		UserID:   userID,
		Email:    email,
		Role:     role,
		IsActive: isActive,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(tokenExpiration)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// GenerateRefreshToken はリフレッシュトークンを生成
func GenerateRefreshToken(userID uint, email string, role string, isActive bool) (string, error) {
	claims := CustomClaims{
		UserID:   userID,
		Email:    email,
		Role:     role,
		IsActive: isActive,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(refreshTokenExpiration)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// VerifyToken はトークンを検証してクレームを返す
func VerifyToken(tokenString string) (*CustomClaims, error) {
	claims := &CustomClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}
