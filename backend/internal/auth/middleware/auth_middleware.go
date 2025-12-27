package middleware

import (
	"net/http"
	"strings"

	"simple-ledger/internal/common/security"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware は JWT トークンを検証するミドルウェア
func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Authorization ヘッダーを取得
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "missing authorization header"})
			ctx.Abort()
			return
		}

		// Bearer スキームを確認
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization header format"})
			ctx.Abort()
			return
		}

		token := parts[1]

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
