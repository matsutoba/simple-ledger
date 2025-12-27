package models

import "time"

type User struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	Email       string     `gorm:"type:varchar(255);uniqueIndex" json:"email"`
	Name        string     `gorm:"type:varchar(255);not null" json:"name"`
	Password    string     `gorm:"type:text" json:"-"`
	Role        string     `gorm:"type:varchar(50);not null" json:"role"` // "admin", "user"
	IsActive    bool       `gorm:"default:true" json:"isActive"`          // 無効ユーザー管理用
	LastLoginAt *time.Time `json:"lastLoginAt"`                           // 最終ログイン日時(NULLを許容)
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}
