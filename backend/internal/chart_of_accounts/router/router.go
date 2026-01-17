package router

import (
	"simple-ledger/internal/chart_of_accounts/controller"
	"simple-ledger/internal/chart_of_accounts/repository"
	"simple-ledger/internal/chart_of_accounts/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupChartOfAccountsRoutes(apiGroup *gin.RouterGroup, db *gorm.DB) {
	// 依存性の注入
	repo := repository.NewChartOfAccountsRepository(db)
	svc := service.NewChartOfAccountsService(repo)
	ctrl := controller.NewChartOfAccountsController(svc)

	// ルート登録
	accountRoutes := apiGroup.Group("/chart-of-accounts")
	{
		// GET /api/chart-of-accounts?types=revenue,expense
		accountRoutes.GET("", ctrl.GetByTypes())
	}
}
