package seeder

import (
	"fmt"
	"log"
	"math/rand"
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

	// アカウントタイプごとに分類
	accountsByType := make(map[models.AccountType][]models.ChartOfAccounts)
	for _, account := range accounts {
		accountsByType[account.Type] = append(accountsByType[account.Type], account)
	}

	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	// 各ユーザーの取引データを生成
	for _, user := range users {
		// 60日前から現在までの範囲
		endDate := time.Now()
		startDate := endDate.AddDate(0, 0, -60)

		// 1日あたり1件のランダムな取引を生成（60日間）
		currentDate := startDate
		for currentDate.Before(endDate) {
			// ランダムに2つの勘定科目を選択（借方と貸方）
			debitAccount := accounts[rng.Intn(len(accounts))]
			creditAccount := accounts[rng.Intn(len(accounts))]

			// 異なる勘定科目を保証
			maxAttempts := 5
			for debitAccount.ID == creditAccount.ID && maxAttempts > 0 {
				creditAccount = accounts[rng.Intn(len(accounts))]
				maxAttempts--
			}

			// 100円から300,000円までのランダムな金額
			amount := 100 + rng.Intn(300000-100+1)

			description := fmt.Sprintf("%sから%sへ%d円の振替", debitAccount.Name, creditAccount.Name, amount)

			// トランザクション作成
			transaction := models.Transaction{
				UserID:      user.ID,
				Date:        currentDate,
				Description: description,
			}

			if err := db.Create(&transaction).Error; err != nil {
				log.Printf("failed to seed transaction: %v", err)
				continue
			}

			// 仕訳エントリーを作成
			journalEntries := []models.JournalEntry{
				{
					TransactionID:     transaction.ID,
					ChartOfAccountsID: debitAccount.ID,
					Type:              models.DebitEntry,
					Amount:            amount,
					Description:       "借方: " + debitAccount.Name,
				},
				{
					TransactionID:     transaction.ID,
					ChartOfAccountsID: creditAccount.ID,
					Type:              models.CreditEntry,
					Amount:            amount,
					Description:       "貸方: " + creditAccount.Name,
				},
			}

			for _, entry := range journalEntries {
				if err := db.Create(&entry).Error; err != nil {
					log.Printf("failed to seed journal entry: %v", err)
				}
			}

			currentDate = currentDate.AddDate(0, 0, 1)
		}
	}

	log.Print("Transactions seeded successfully")
}
