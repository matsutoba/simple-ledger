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

	// テストデータ作成
	transactions := []models.Transaction{}
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	// 各ユーザーの取引データを生成
	for _, user := range users {
		// 60日前から現在までの範囲
		endDate := time.Now()
		startDate := endDate.AddDate(0, 0, -60)

		// 各勘定科目タイプごとに複数の取引を作成
		accountTypes := []models.AccountType{
			models.AssetAccount,
			models.LiabilityAccount,
			models.EquityAccount,
			models.RevenueAccount,
			models.ExpenseAccount,
		}

		// 1日あたり1-3件のランダムな取引を生成（60日間）
		currentDate := startDate
		for currentDate.Before(endDate) {
			// 1日あたりの取引件数をランダムに決定（0-3件）
			numTransactions := rng.Intn(4)

			for i := 0; i < numTransactions; i++ {
				// ランダムに勘定科目タイプを選択
				accountType := accountTypes[rng.Intn(len(accountTypes))]

				// 選択されたタイプの勘定科目を取得
				typeAccounts := accountsByType[accountType]
				if len(typeAccounts) == 0 {
					continue
				}

				account := typeAccounts[rng.Intn(len(typeAccounts))]

				// 100円から300,000円までのランダムな金額
				amount := 100 + rng.Intn(300000-100+1)

				transaction := models.Transaction{
					UserID:            user.ID,
					Date:              currentDate,
					ChartOfAccountsID: account.ID,
					Amount:            amount,
					Description:       fmt.Sprintf("%sの%s取引（%s）", user.Name, account.Type, account.Name),
				}
				transactions = append(transactions, transaction)
			}

			currentDate = currentDate.AddDate(0, 0, 1)
		}
	}

	for _, transaction := range transactions {
		if err := db.Create(&transaction).Error; err != nil {
			log.Printf("failed to seed transaction: %v", err)
		}
	}

	log.Printf("seeded %d transactions", len(transactions))
}
