package dto

import "time"

type CreateTransactionRequest struct {
	Date              string `json:"date" binding:"required"`
	ChartOfAccountsID uint   `json:"chartOfAccountsId" binding:"required"`
	Amount            int    `json:"amount" binding:"required,gt=0"`
	Description       string `json:"description" binding:"max=255"`
}

type TransactionResponse struct {
	ID                  uint      `json:"id"`
	UserID              uint      `json:"userId"`
	Date                string    `json:"date"`
	ChartOfAccountsID   uint      `json:"chartOfAccountsId"`
	ChartOfAccountsCode string    `json:"chartOfAccountsCode"`
	ChartOfAccountsName string    `json:"chartOfAccountsName"`
	ChartOfAccountsType string    `json:"chartOfAccountsType"`
	Amount              int       `json:"amount"`
	Description         string    `json:"description"`
	CreatedAt           time.Time `json:"createdAt"`
	UpdatedAt           time.Time `json:"updatedAt"`
}

type GetTransactionsResponse struct {
	Transactions []TransactionResponse `json:"transactions"`
	Total        int                   `json:"total"`
}
