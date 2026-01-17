package dto

import "simple-ledger/internal/models"

// GetChartOfAccountsRequest: 勘定科目一覧取得リクエスト
type GetChartOfAccountsRequest struct {
	// Types: 勘定科目区分フィルタ（複数指定可）
	// 例: ?types=revenue,expense
	Types []models.AccountType `form:"types" binding:"required"`
}

// ChartOfAccountsResponse: 勘定科目のレスポンス
type ChartOfAccountsResponse struct {
	ID            uint   `json:"id"`
	Code          string `json:"code"`
	Name          string `json:"name"`
	Type          string `json:"type"`
	NormalBalance string `json:"normalBalance"`
	Description   string `json:"description"`
	IsActive      bool   `json:"isActive"`
}

// GetChartOfAccountsResponse: 勘定科目一覧取得レスポンス
type GetChartOfAccountsResponse struct {
	Accounts []ChartOfAccountsResponse `json:"accounts"`
	Total    int                       `json:"total"`
}
