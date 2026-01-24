package models

import "time"

type EntryType string

const (
	DebitEntry  EntryType = "debit"  // 借方
	CreditEntry EntryType = "credit" // 貸方
)

// JournalEntry: 仕訳エントリー
type JournalEntry struct {
	// ID: 仕訳エントリーの一意識別子（主キー）
	ID uint `gorm:"primaryKey" json:"id"`

	// TransactionID: 取引ID（外部キー）
	TransactionID uint `gorm:"not null;index:idx_transaction_id" json:"transactionId"`

	// Transaction: リレーション（取引）
	Transaction *Transaction `gorm:"foreignKey:TransactionID" json:"transaction,omitempty"`

	// ChartOfAccountsID: 勘定科目ID（外部キー）
	ChartOfAccountsID uint `gorm:"not null;index" json:"chartOfAccountsId"`

	// ChartOfAccounts: リレーション（勘定科目）
	ChartOfAccounts *ChartOfAccounts `gorm:"foreignKey:ChartOfAccountsID" json:"chartOfAccounts,omitempty"`

	// Type: 仕訳のタイプ（debit/credit）
	Type EntryType `gorm:"type:varchar(50);not null" json:"type"`

	// Amount: 金額
	Amount int `gorm:"not null" json:"amount"`

	// Description: 仕訳の説明（摘要）
	Description string `gorm:"type:text" json:"description"`

	// CreatedAt: 仕訳の作成日時
	CreatedAt time.Time `json:"createdAt"`

	// UpdatedAt: 仕訳の最終更新日時
	UpdatedAt time.Time `json:"updatedAt"`
}

// JournalEntry 構造体は journal_entries テーブルにマッピングされることを明示する
func (JournalEntry) TableName() string {
	return "journal_entries"
}
