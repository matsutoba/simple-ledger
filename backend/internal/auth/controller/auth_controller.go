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
	var req dto.RefreshTokenRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	accessToken, err := c.service.RefreshAccessToken(req.RefreshToken)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	response := gin.H{
		"accessToken": accessToken,
		"expiresIn":   security.GetTokenExpirationSeconds(),
	}

	ctx.JSON(http.StatusOK, response)
}
