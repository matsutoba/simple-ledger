package models

import "time"

// Transaction: 取引記録
type Transaction struct {
	// ID: 取引の一意識別子（主キー）
	ID uint `gorm:"primaryKey" json:"id"`

	// UserID: ユーザーID（外部キー）
	UserID uint `gorm:"not null;index" json:"userId"`

	// User: リレーション（ユーザー）
	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`

	// Date: 取引日
	Date time.Time `gorm:"type:date;not null;index" json:"date"`

	// ChartOfAccountsID: 勘定科目ID（外部キー）
	ChartOfAccountsID uint `gorm:"not null;index" json:"chartOfAccountsId"`

	// ChartOfAccounts: リレーション（勘定科目）- ポインタ型にするとテーブルに列を作成しない、ChartOfAccountsIDで関連データを参照
	ChartOfAccounts *ChartOfAccounts `gorm:"foreignKey:ChartOfAccountsID" json:"chartOfAccounts,omitempty"`

	// Amount: 金額
	Amount int `gorm:"not null" json:"amount"`

	// Description: 取引の説明・摘要
	Description string `gorm:"type:text" json:"description"`

	// CreatedAt: 取引の作成日時
	CreatedAt time.Time `json:"createdAt"`

	// UpdatedAt: 取引の最終更新日時
	UpdatedAt time.Time `json:"updatedAt"`
}

// Transaction 構造体は transactions テーブルにマッピングされることを明示する
func (Transaction) TableName() string {
	return "transactions"
}
