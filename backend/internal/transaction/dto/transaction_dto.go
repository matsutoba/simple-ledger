package dto

import (
	journalEntryDto "simple-ledger/internal/journal_entry/dto"
	"time"
)

// CreateTransactionRequest: 取引作成リクエスト
type CreateTransactionRequest struct {
	// Date: 取引日（仕訳日）
	Date string `json:"date" binding:"required"`

	// Description: 取引の説明・摘要
	Description string `json:"description" binding:"max=255"`

	// JournalEntries: 仕訳エントリー（最低2つ必要：借方1 + 貸方1）
	JournalEntries []journalEntryDto.CreateJournalEntryRequest `json:"journalEntries" binding:"required,min=2"`
}

// TransactionResponse: 取引レスポンス
type TransactionResponse struct {
	// ID: 取引ID
	ID uint `json:"id"`

	// UserID: ユーザーID
	UserID uint `json:"userId"`

	// Date: 取引日
	Date string `json:"date"`

	// Description: 取引の説明・摘要
	Description string `json:"description"`

	// JournalEntries: 仕訳エントリー一覧
	JournalEntries []journalEntryDto.JournalEntryResponse `json:"journalEntries,omitempty"`

	// CreatedAt: 作成日時
	CreatedAt time.Time `json:"createdAt"`

	// UpdatedAt: 更新日時
	UpdatedAt time.Time `json:"updatedAt"`
}

// GetTransactionsResponse: 取引一覧レスポンス
type GetTransactionsResponse struct {
	// Transactions: 取引一覧
	Transactions []TransactionResponse `json:"transactions"`

	// Total: 取引総数
	Total int `json:"total"`
}

// GetTransactionsWithPaginationRequest: ページネーション付き取引一覧取得リクエスト
type GetTransactionsWithPaginationRequest struct {
	// Page: ページ番号
	Page int `form:"page" binding:"required,min=1"`

	// PageSize: 1ページあたりの件数
	PageSize int `form:"pageSize" binding:"required,min=1,max=100"`

	// Keyword: キーワード（摘要で検索）
	Keyword string `form:"keyword"`
}

// GetTransactionsWithPaginationResponse: ページネーション付き取引一覧レスポンス
type GetTransactionsWithPaginationResponse struct {
	// Transactions: 取引一覧
	Transactions []TransactionResponse `json:"transactions"`

	// Total: 取引総数
	Total int `json:"total"`

	// Page: ページ番号
	Page int `json:"page"`

	// PageSize: 1ページあたりの件数
	PageSize int `json:"pageSize"`

	// HasNextPage: 次ページが存在するか
	HasNextPage bool `json:"hasNextPage"`
}
