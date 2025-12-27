package router

import (
	"simple-ledger/internal/user/controller"
	"simple-ledger/internal/user/repository"
	"simple-ledger/internal/user/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupUserRoutes(r *gin.RouterGroup, db *gorm.DB) {
	// リポジトリ、サービス、コントローラーの初期化
	repo := repository.NewUserRepository(db)
	svc := service.NewUserService(repo)
	ctrl := controller.NewUserController(svc)

	// ユーザー関連のルート定義
	userGroup := r.Group("/users")
	{
		userGroup.POST("", ctrl.CreateUser)       // POST /api/users
		userGroup.GET("", ctrl.GetAllUsers)       // GET /api/users
		userGroup.GET("/:id", ctrl.GetUser)       // GET /api/users/:id
		userGroup.PATCH("/:id", ctrl.UpdateUser)  // PATCH /api/users/:id
		userGroup.DELETE("/:id", ctrl.DeleteUser) // DELETE /api/users/:id
	}
}
