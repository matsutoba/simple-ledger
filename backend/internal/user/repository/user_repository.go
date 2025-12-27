package repository

import (
	"simple-ledger/internal/models"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

// CreateUser はユーザーを作成
func (r *UserRepository) CreateUser(user *models.User) error {
	return r.db.Create(user).Error
}

// GetUserByID はIDでユーザーを取得
func (r *UserRepository) GetUserByID(id uint) (*models.User, error) {
	var user models.User
	if err := r.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUserByEmail はメールアドレスでユーザーを取得
func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// GetAllUsers はすべてのユーザーを取得
func (r *UserRepository) GetAllUsers() ([]models.User, error) {
	var users []models.User
	if err := r.db.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// UpdateUser はユーザーを更新
func (r *UserRepository) UpdateUser(id uint, updates map[string]interface{}) (*models.User, error) {
	user := &models.User{}
	if err := r.db.Model(user).Where("id = ?", id).Updates(updates).Error; err != nil {
		return nil, err
	}
	return r.GetUserByID(id)
}

// DeleteUser はユーザーを削除
func (r *UserRepository) DeleteUser(id uint) error {
	return r.db.Delete(&models.User{}, id).Error
}
