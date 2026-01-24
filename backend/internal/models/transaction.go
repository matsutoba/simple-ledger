package models

import "time"

// Transaction: 取引記録
type Transaction struct {
	// ID: 取引の一意識別子（主キー）
	ID uint `gorm:"primaryKey" json:"id"`

	// UserID: ユーザーID（外部キー）
	UserID uint `gorm:"not null;index:idx_user_date_created,sort:asc" json:"userId"`

	// User: リレーション（ユーザー）
	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`

	// Date: 取引日（会計上の仕訳日）
	Date time.Time `gorm:"type:date;not null;index:idx_user_date_created,sort:desc" json:"date"`

	// Description: 取引の説明・摘要
	Description string `gorm:"type:text" json:"description"`

	// JournalEntries: リレーション（仕訳エントリー）- 1つの取引は複数の仕訳エントリーを持つ
	JournalEntries []JournalEntry `gorm:"foreignKey:TransactionID" json:"journalEntries,omitempty"`

	// CreatedAt: 取引の作成日時
	CreatedAt time.Time `gorm:"index:idx_user_date_created,sort:desc" json:"createdAt"`

	// UpdatedAt: 取引の最終更新日時
	UpdatedAt time.Time `json:"updatedAt"`
}

// Transaction 構造体は transactions テーブルにマッピングされることを明示する
func (Transaction) TableName() string {
	return "transactions"
}
