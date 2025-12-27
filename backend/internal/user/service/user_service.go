package service

import (
	"fmt"
	"simple-ledger/internal/common/security"
	"simple-ledger/internal/models"
	"simple-ledger/internal/user/dto"
	"simple-ledger/internal/user/repository"

	"gorm.io/gorm"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

// CreateUser はユーザーを作成
func (s *UserService) CreateUser(req *dto.CreateUserRequest) (*dto.UserResponse, error) {
	// メールアドレスが既に存在するかチェック
	_, err := s.repo.GetUserByEmail(req.Email)
	if err == nil {
		return nil, fmt.Errorf("email already exists")
	}
	if err != gorm.ErrRecordNotFound {
		return nil, err
	}

	// パスワードをハッシュ化
	hashedPassword, err := security.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:    req.Email,
		Name:     req.Name,
		Password: hashedPassword,
		Role:     req.Role,
		IsActive: true,
	}

	if err := s.repo.CreateUser(user); err != nil {
		return nil, err
	}

	return s.userToResponse(user), nil
}

// GetUser はIDでユーザーを取得
func (s *UserService) GetUser(id uint) (*dto.UserResponse, error) {
	user, err := s.repo.GetUserByID(id)
	if err != nil {
		return nil, err
	}
	return s.userToResponse(user), nil
}

// GetAllUsers はすべてのユーザーを取得
func (s *UserService) GetAllUsers() ([]dto.UserResponse, error) {
	users, err := s.repo.GetAllUsers()
	if err != nil {
		return nil, err
	}

	responses := make([]dto.UserResponse, len(users))
	for i, user := range users {
		responses[i] = *s.userToResponse(&user)
	}
	return responses, nil
}

// UpdateUser はユーザーを更新
func (s *UserService) UpdateUser(id uint, req *dto.UpdateUserRequest) (*dto.UserResponse, error) {
	updates := make(map[string]interface{})

	// 必須フィールド
	updates["name"] = req.Name
	updates["email"] = req.Email
	updates["role"] = req.Role

	// 任意フィールド（指定されている場合のみ更新）
	if req.Password != nil {
		hashedPassword, err := security.HashPassword(*req.Password)
		if err != nil {
			return nil, err
		}
		updates["password"] = hashedPassword
	}
	if req.IsActive != nil {
		updates["is_active"] = *req.IsActive
	}

	user, err := s.repo.UpdateUser(id, updates)
	if err != nil {
		return nil, err
	}
	return s.userToResponse(user), nil
}

// DeleteUser はユーザーを削除
func (s *UserService) DeleteUser(id uint) error {
	return s.repo.DeleteUser(id)
}

// userToResponse は User モデルを UserResponse DTO に変換
func (s *UserService) userToResponse(user *models.User) *dto.UserResponse {
	return &dto.UserResponse{
		ID:          user.ID,
		Email:       user.Email,
		Name:        user.Name,
		Role:        user.Role,
		IsActive:    user.IsActive,
		LastLoginAt: user.LastLoginAt,
		CreatedAt:   user.CreatedAt,
		UpdatedAt:   user.UpdatedAt,
	}
}
