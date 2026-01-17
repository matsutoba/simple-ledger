package seeder

import (
	"fmt"
	"log"
	"simple-ledger/internal/models"
	"time"

	"gorm.io/gorm"
)

func SeedTransactions(db *gorm.DB) {
	// ユーザーと勘定科目を取得
	var users []models.User
	if err := db.Find(&users).Error; err != nil {
		log.Printf("failed to get users: %v", err)
		return
	}

	if len(users) == 0 {
		log.Printf("no users found to seed transactions")
		return
	}

	var accounts []models.ChartOfAccounts
	if err := db.Find(&accounts).Error; err != nil {
		log.Printf("failed to get chart of accounts: %v", err)
		return
	}

	if len(accounts) == 0 {
		log.Printf("no accounts found to seed transactions")
		return
	}

	// テストデータ作成
	transactions := []models.Transaction{}

	// 各ユーザーの取引データを生成
	for _, user := range users {
		baseDate := time.Now().AddDate(0, 0, -30) // 30日前から開始

		// ユーザーごとに複数の取引を作成
		for i := 0; i < 10; i++ {
			account := accounts[i%len(accounts)]

			transaction := models.Transaction{
				UserID:            user.ID,
				Date:              baseDate.AddDate(0, 0, i*3), // 3日ごとに取引
				ChartOfAccountsID: account.ID,
				Amount:            (i + 1) * 10000,
				Description:       fmt.Sprintf("%sによる%sの取引", user.Name, account.Name),
			}
			transactions = append(transactions, transaction)
		}
	}

	for _, transaction := range transactions {
		if err := db.Create(&transaction).Error; err != nil {
			log.Printf("failed to seed transaction: %v", err)
		}
	}

	log.Printf("seeded %d transactions", len(transactions))
}
