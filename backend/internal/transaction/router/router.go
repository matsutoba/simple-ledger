package router

import (
	"simple-ledger/internal/auth/middleware"
	"simple-ledger/internal/transaction/controller"
	"simple-ledger/internal/transaction/repository"
	"simple-ledger/internal/transaction/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupTransactionRoutes(apiGroup *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewTransactionRepository(db)
	svc := service.NewTransactionService(repo)
	ctrl := controller.NewTransactionController(svc)

	transactionRoutes := apiGroup.Group("/transactions")
	transactionRoutes.Use(middleware.AuthMiddleware())
	{
		transactionRoutes.POST("", ctrl.Create())
		transactionRoutes.GET("", ctrl.GetByUserID())
		transactionRoutes.GET("/:id", ctrl.GetByID())
		transactionRoutes.PUT("/:id", ctrl.Update())
		transactionRoutes.DELETE("/:id", ctrl.Delete())
	}
}
