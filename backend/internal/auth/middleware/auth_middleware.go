package middleware

import (
	"net/http"

	"simple-ledger/internal/common/security"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware は JWT トークンを検証するミドルウェア
// HttpOnly Cookie からトークンを取得して検証
func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// クッキーからアクセストークンを取得
		token, err := ctx.Cookie("accessToken")
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "missing access token cookie"})
			ctx.Abort()
			return
		}

		// トークンを検証
		claims, err := security.VerifyToken(token)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			ctx.Abort()
			return
		}

		// コンテキストにクレーム情報を保存
		ctx.Set("userID", claims.UserID)
		ctx.Set("email", claims.Email)
		ctx.Set("role", claims.Role)
		ctx.Set("isActive", claims.IsActive)

		ctx.Next()
	}
}
