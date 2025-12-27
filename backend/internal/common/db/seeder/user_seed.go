package seeder

import (
	"fmt"
	"log"
	"simple-ledger/internal/common/security"
	"simple-ledger/internal/models"

	"gorm.io/gorm"
)

func SeedUsers(db *gorm.DB) {
	// パスワードをハッシュ化
	hashPassword, err := security.HashPassword("password")
	if err != nil {
		log.Fatalf("failed to hash password: %v", err)
	}

	admin := models.User{
		Name:     "管理者",
		Email:    "admin@example.com",
		Password: hashPassword,
		Role:     "admin",
	}

	users := []models.User{admin}

	// userをlength個生成
	const length = 5
	for i := 1; i <= length; i++ {
		u := models.User{
			Name:     fmt.Sprintf("ユーザー%d", i),
			Email:    fmt.Sprintf("user%d@example.com", i),
			Password: hashPassword,
			Role:     "user",
		}
		users = append(users, u)
	}

	for _, u := range users {
		if err := db.FirstOrCreate(&u, models.User{Email: u.Email}).Error; err != nil {
			log.Printf("failed to seed user %s: %v", u.Email, err)
		}
	}
}
