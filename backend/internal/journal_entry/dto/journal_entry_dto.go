package dto

import "simple-ledger/internal/models"

// CreateJournalEntryRequest: 仕訳エントリー作成リクエスト
type CreateJournalEntryRequest struct {
	// ChartOfAccountsID: 勘定科目ID
	ChartOfAccountsID uint `json:"chartOfAccountsId" binding:"required"`

	// Type: 仕訳のタイプ（debit/credit）
	Type models.EntryType `json:"type" binding:"required,oneof=debit credit"`

	// Amount: 金額
	Amount int `json:"amount" binding:"required,gt=0"`

	// Description: 仕訳の説明（摘要）
	Description string `json:"description"`
}

// JournalEntryResponse: 仕訳エントリーレスポンス
type JournalEntryResponse struct {
	// ID: 仕訳エントリーID
	ID uint `json:"id"`

	// TransactionID: 取引ID
	TransactionID uint `json:"transactionId"`

	// ChartOfAccountsID: 勘定科目ID
	ChartOfAccountsID uint `json:"chartOfAccountsId"`

	// ChartOfAccounts: 勘定科目情報
	ChartOfAccounts *ChartOfAccountsResponse `json:"chartOfAccounts,omitempty"`

	// Type: 仕訳のタイプ（debit/credit）
	Type models.EntryType `json:"type"`

	// Amount: 金額
	Amount int `json:"amount"`

	// Description: 仕訳の説明（摘要）
	Description string `json:"description"`

	// CreatedAt: 作成日時
	CreatedAt string `json:"createdAt"`

	// UpdatedAt: 更新日時
	UpdatedAt string `json:"updatedAt"`
}

// ChartOfAccountsResponse: 勘定科目レスポンス（ネストされたリスポンス）
type ChartOfAccountsResponse struct {
	// ID: 勘定科目ID
	ID uint `json:"id"`

	// Code: 勘定科目コード
	Code string `json:"code"`

	// Name: 勘定科目名
	Name string `json:"name"`

	// Type: 勘定科目区分
	Type models.AccountType `json:"type"`

	// NormalBalance: 通常の残高
	NormalBalance models.NormalBalance `json:"normalBalance"`
}

// ToJournalEntryResponse: JournalEntry から JournalEntryResponse に変換
func ToJournalEntryResponse(entry *models.JournalEntry) *JournalEntryResponse {
	response := &JournalEntryResponse{
		ID:                entry.ID,
		TransactionID:     entry.TransactionID,
		ChartOfAccountsID: entry.ChartOfAccountsID,
		Type:              entry.Type,
		Amount:            entry.Amount,
		Description:       entry.Description,
		CreatedAt:         entry.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:         entry.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}

	if entry.ChartOfAccounts != nil {
		response.ChartOfAccounts = &ChartOfAccountsResponse{
			ID:            entry.ChartOfAccounts.ID,
			Code:          entry.ChartOfAccounts.Code,
			Name:          entry.ChartOfAccounts.Name,
			Type:          entry.ChartOfAccounts.Type,
			NormalBalance: entry.ChartOfAccounts.NormalBalance,
		}
	}

	return response
}

// ToJournalEntryResponseSlice: JournalEntry スライスを JournalEntryResponse スライスに変換
func ToJournalEntryResponseSlice(entries []models.JournalEntry) []JournalEntryResponse {
	responses := make([]JournalEntryResponse, len(entries))
	for i, entry := range entries {
		responses[i] = *ToJournalEntryResponse(&entry)
	}
	return responses
}
