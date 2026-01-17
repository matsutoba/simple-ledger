package models

import "time"

type AccountType string

const (
	AssetAccount     AccountType = "asset"     // 資産
	LiabilityAccount AccountType = "liability" // 負債
	EquityAccount    AccountType = "equity"    // 純資産
	RevenueAccount   AccountType = "revenue"   // 収益
	ExpenseAccount   AccountType = "expense"   // 費用
)

type NormalBalance string

const (
	DebitBalance  NormalBalance = "debit"  // 借方
	CreditBalance NormalBalance = "credit" // 貸方
)

// 勘定科目表
type ChartOfAccounts struct {
	// ID: 勘定科目の一意識別子（主キー）
	ID uint `gorm:"primaryKey" json:"id"`

	// Code: 勘定科目コード（例：1000,1010など）- 勘定科目の一意識別子として使用
	Code string `gorm:"type:varchar(50);uniqueIndex;not null" json:"code"`

	// Name: 勘定科目名（例：現金、売上など）
	Name string `gorm:"type:varchar(255);not null" json:"name"`

	// Type: 勘定科目区分（asset/liability/equity/revenue/expense）
	Type AccountType `gorm:"type:varchar(50);not null" json:"type"`

	// NormalBalance: 通常の残高（debit/credit）- 会計的な分類に基づく正常な残高
	NormalBalance NormalBalance `gorm:"type:varchar(50);not null" json:"normalBalance"`

	// Description: 勘定科目の説明・摘要
	Description string `gorm:"type:text" json:"description"`

	// IsActive: 勘定科目の有効/無効フラグ（true=有効、false=無効）
	IsActive bool `gorm:"default:true" json:"isActive"`

	// CreatedAt: 勘定科目の作成日時
	CreatedAt time.Time `json:"createdAt"`

	// UpdatedAt: 勘定科目の最終更新日時
	UpdatedAt time.Time `json:"updatedAt"`
}

// ChartOfAccounts 構造体は chart_of_accounts テーブルにマッピングされる
func (ChartOfAccounts) TableName() string {
	return "chart_of_accounts"
}
