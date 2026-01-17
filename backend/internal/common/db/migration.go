package migration

import (
	"simple-ledger/internal/models"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	if err := db.AutoMigrate(&models.User{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&models.ChartOfAccounts{}); err != nil {
		return err
	}
	return nil
}
