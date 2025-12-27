package seeder

import "gorm.io/gorm"

func SeedAll(db *gorm.DB) {
	SeedUsers(db)
}
