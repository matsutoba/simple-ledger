package seeder

import (
	"log"
	"simple-ledger/internal/models"

	"gorm.io/gorm"
)

func SeedChartOfAccounts(db *gorm.DB) {
	accounts := []models.ChartOfAccounts{
		// 資産 (Asset)
		{Code: "1000", Name: "現金", Type: models.AssetAccount, NormalBalance: models.DebitBalance, Description: "現金及び小切手"},
		{Code: "1010", Name: "普通預金", Type: models.AssetAccount, NormalBalance: models.DebitBalance, Description: "銀行の普通預金口座"},
		{Code: "1020", Name: "定期預金", Type: models.AssetAccount, NormalBalance: models.DebitBalance, Description: "銀行の定期預金"},
		{Code: "1100", Name: "売上債権", Type: models.AssetAccount, NormalBalance: models.DebitBalance, Description: "売掛金及び受取手形"},
		{Code: "1110", Name: "売掛金", Type: models.AssetAccount, NormalBalance: models.DebitBalance, Description: "商品売上に対する掛け売りの請求権"},
		{Code: "1200", Name: "商品", Type: models.AssetAccount, NormalBalance: models.DebitBalance, Description: "販売目的の商品在庫"},
		{Code: "1300", Name: "建物", Type: models.AssetAccount, NormalBalance: models.DebitBalance, Description: "事業用の建物"},
		{Code: "1310", Name: "建物減価償却累計額", Type: models.AssetAccount, NormalBalance: models.CreditBalance, Description: "建物の減価償却累計額"},
		{Code: "1400", Name: "機械装置", Type: models.AssetAccount, NormalBalance: models.DebitBalance, Description: "製造設備や事務機器"},
		{Code: "1410", Name: "機械装置減価償却累計額", Type: models.AssetAccount, NormalBalance: models.CreditBalance, Description: "機械装置の減価償却累計額"},
		{Code: "1500", Name: "車両", Type: models.AssetAccount, NormalBalance: models.DebitBalance, Description: "事業用の車両"},
		{Code: "1510", Name: "車両減価償却累計額", Type: models.AssetAccount, NormalBalance: models.CreditBalance, Description: "車両の減価償却累計額"},

		// 負債 (Liability)
		{Code: "2000", Name: "買掛金", Type: models.LiabilityAccount, NormalBalance: models.CreditBalance, Description: "商品購入時の掛け買いの支払い義務"},
		{Code: "2100", Name: "支払手形", Type: models.LiabilityAccount, NormalBalance: models.CreditBalance, Description: "掛け買いで振り出した手形"},
		{Code: "2200", Name: "短期借入金", Type: models.LiabilityAccount, NormalBalance: models.CreditBalance, Description: "1年以内に返済予定の借金"},
		{Code: "2300", Name: "長期借入金", Type: models.LiabilityAccount, NormalBalance: models.CreditBalance, Description: "1年を超える返済予定の借金"},
		{Code: "2400", Name: "給料引当金", Type: models.LiabilityAccount, NormalBalance: models.CreditBalance, Description: "未払い給料の見積もり"},

		// 純資産 (Equity)
		{Code: "3000", Name: "資本金", Type: models.EquityAccount, NormalBalance: models.CreditBalance, Description: "事業開始時の投資資本"},
		{Code: "3100", Name: "利益剰余金", Type: models.EquityAccount, NormalBalance: models.CreditBalance, Description: "過去年度の利益の蓄積"},
		{Code: "3200", Name: "当期利益", Type: models.EquityAccount, NormalBalance: models.CreditBalance, Description: "当年度の利益"},

		// 収益 (Revenue)
		{Code: "4000", Name: "売上", Type: models.RevenueAccount, NormalBalance: models.CreditBalance, Description: "商品やサービスの売上"},
		{Code: "4100", Name: "売上返品", Type: models.RevenueAccount, NormalBalance: models.DebitBalance, Description: "売上の返品・キャンセル"},
		{Code: "4200", Name: "売上割引", Type: models.RevenueAccount, NormalBalance: models.DebitBalance, Description: "売上時の割引"},
		{Code: "4300", Name: "受取利息", Type: models.RevenueAccount, NormalBalance: models.CreditBalance, Description: "銀行利息や貸付金の利息"},
		{Code: "4400", Name: "雑収入", Type: models.RevenueAccount, NormalBalance: models.CreditBalance, Description: "その他の収入"},

		// 費用 (Expense)
		{Code: "5000", Name: "仕入", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, Description: "販売目的の商品仕入"},
		{Code: "5100", Name: "仕入返品", Type: models.ExpenseAccount, NormalBalance: models.CreditBalance, Description: "仕入の返品・キャンセル"},
		{Code: "5200", Name: "仕入割引", Type: models.ExpenseAccount, NormalBalance: models.CreditBalance, Description: "仕入時の割引"},
		{Code: "6000", Name: "給料", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, Description: "従業員の給料"},
		{Code: "6100", Name: "福利厚生費", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, Description: "健康保険や厚生年金などの福利厚生"},
		{Code: "6200", Name: "社会保険料", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, Description: "企業負担分の社会保険料"},
		{Code: "6300", Name: "賃借料", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, Description: "オフィスやテナントの賃料"},
		{Code: "6400", Name: "水道光熱費", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, Description: "電気、ガス、水道などの費用"},
		{Code: "6500", Name: "通信費", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, Description: "電話やインターネットの費用"},
		{Code: "6600", Name: "減価償却費", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, Description: "固定資産の減価償却費"},
		{Code: "6700", Name: "旅費交通費", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, Description: "移動や出張の費用"},
		{Code: "6800", Name: "消耗品費", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, Description: "オフィス消耗品などの費用"},
		{Code: "6900", Name: "修繕費", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, Description: "建物や設備の修繕費"},
		{Code: "7000", Name: "支払利息", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, Description: "借入金の利息"},
		{Code: "7100", Name: "雑費", Type: models.ExpenseAccount, NormalBalance: models.DebitBalance, Description: "その他の費用"},
	}

	for _, account := range accounts {
		if err := db.FirstOrCreate(&account, models.ChartOfAccounts{Code: account.Code}).Error; err != nil {
			log.Printf("failed to seed chart of accounts %s: %v", account.Code, err)
		}
	}
}
