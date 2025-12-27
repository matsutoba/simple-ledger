package dto

import "time"

// CreateUserRequest はユーザー作成のリクエストDTO
type CreateUserRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Name     string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
	Role     string `json:"role" binding:"required,oneof=admin user"`
}

// UpdateUserRequest はユーザー更新のリクエストDTO
type UpdateUserRequest struct {
	Name     string  `json:"name" binding:"required"`
	Email    string  `json:"email" binding:"required,email"`
	Role     string  `json:"role" binding:"required,oneof=admin user"`
	Password *string `json:"password" binding:"min=8"`
	IsActive *bool   `json:"isActive"`
}

// UserResponse はユーザーのレスポンスDTO
type UserResponse struct {
	ID          uint       `json:"id"`
	Email       string     `json:"email"`
	Name        string     `json:"name"`
	Role        string     `json:"role"`
	IsActive    bool       `json:"isActive"`
	LastLoginAt *time.Time `json:"lastLoginAt"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}
