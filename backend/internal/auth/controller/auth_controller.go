package controller

import (
	"net/http"

	"simple-ledger/internal/auth/dto"
	"simple-ledger/internal/auth/service"
	"simple-ledger/internal/common/security"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	service *service.AuthService
}

func NewAuthController(service *service.AuthService) *AuthController {
	return &AuthController{service: service}
}

// Login はログインエンドポイント
// POST /api/auth/login
func (c *AuthController) Login(ctx *gin.Context) {
	var req dto.LoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	accessToken, refreshToken, err := c.service.Login(req.Email, req.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// HttpOnly Cookie にトークンを設定（XSS攻撃対策）
	ctx.SetCookie(
		"accessToken",
		accessToken,
		int(security.GetTokenExpirationSeconds()),
		"/",
		ctx.Request.Host,
		false, // Secure: 開発環境では false（本番環境では true にすること）
		true,  // HttpOnly: JavaScript からアクセス不可
	)

	ctx.SetCookie(
		"refreshToken",
		refreshToken,
		int(security.GetRefreshTokenExpirationSeconds()),
		"/",
		ctx.Request.Host,
		false, // Secure: 開発環境では false（本番環境では true にすること）
		true,  // HttpOnly: JavaScript からアクセス不可
	)

	// クライアントに成功を通知（トークン値は含めない）
	response := dto.LoginResponse{
		ExpiresIn: security.GetTokenExpirationSeconds(),
	}

	ctx.JSON(http.StatusOK, response)
}

// RefreshToken はトークン更新エンドポイント
// POST /api/auth/refresh
func (c *AuthController) RefreshToken(ctx *gin.Context) {
	// クッキーから refreshToken を取得
	refreshToken, err := ctx.Cookie("refreshToken")
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "リフレッシュトークンが見つかりません"})
		return
	}

	accessToken, err := c.service.RefreshAccessToken(refreshToken)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// HttpOnly Cookie にトークンを設定
	ctx.SetCookie(
		"accessToken",
		accessToken,
		int(security.GetTokenExpirationSeconds()),
		"/",
		ctx.Request.Host,
		false, // Secure: 開発環境では false（本番環境では true にすること）
		true,  // HttpOnly: JavaScript からアクセス不可
	)

	response := gin.H{
		"expiresIn": security.GetTokenExpirationSeconds(),
	}

	ctx.JSON(http.StatusOK, response)
}

// Logout はログアウトエンドポイント
// POST /api/auth/logout
func (c *AuthController) Logout(ctx *gin.Context) {
	// クッキーを削除（MaxAge を負の値に設定）
	ctx.SetCookie(
		"accessToken",
		"",
		-1,
		"/",
		ctx.Request.Host,
		false,
		true,
	)

	ctx.SetCookie(
		"refreshToken",
		"",
		-1,
		"/",
		ctx.Request.Host,
		false,
		true,
	)

	ctx.JSON(http.StatusOK, gin.H{"message": "ログアウトしました"})
}
