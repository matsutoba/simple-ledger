package controller

import (
	"net/http"

	"simple-ledger/internal/chart_of_accounts/dto"
	"simple-ledger/internal/chart_of_accounts/service"

	"github.com/gin-gonic/gin"
)

type ChartOfAccountsController interface {
	// GetByTypes: 指定された勘定科目区分のデータを取得
	// GET /api/chart-of-accounts?types=revenue,expense
	GetByTypes() gin.HandlerFunc
}

type chartOfAccountsController struct {
	service service.ChartOfAccountsService
}

func NewChartOfAccountsController(service service.ChartOfAccountsService) ChartOfAccountsController {
	return &chartOfAccountsController{service: service}
}

// GetByTypes: 指定された勘定科目区分のデータを取得
func (ctrl *chartOfAccountsController) GetByTypes() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req dto.GetChartOfAccountsRequest

		// クエリパラメータをバインド
		// ?types=revenue,expense の形式で複数指定可能
		if err := c.ShouldBindQuery(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid types parameter",
			})
			return
		}

		// types が空の場合はエラー
		if len(req.Types) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "types parameter is required",
			})
			return
		}

		// サービスを呼び出し
		result, err := ctrl.service.GetByTypes(req.Types)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to fetch chart of accounts",
			})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}
