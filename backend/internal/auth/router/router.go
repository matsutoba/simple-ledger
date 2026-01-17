package router

import (
	"simple-ledger/internal/auth/controller"
	"simple-ledger/internal/auth/service"
	"simple-ledger/internal/user/repository"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupAuthRoutes(r *gin.RouterGroup, db *gorm.DB) {
	// リポジトリ、サービス、コントローラーの初期化
	userRepo := repository.NewUserRepository(db)
	authService := service.NewAuthService(userRepo)
	authCtrl := controller.NewAuthController(authService)

	// 認証関連のルート定義
	authGroup := r.Group("/auth")
	{
		authGroup.POST("/login", authCtrl.Login)          // POST /api/auth/login
		authGroup.POST("/refresh", authCtrl.RefreshToken) // POST /api/auth/refresh
		authGroup.POST("/logout", authCtrl.Logout)        // POST /api/auth/logout
	}
}
