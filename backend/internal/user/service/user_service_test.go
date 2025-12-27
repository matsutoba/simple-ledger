package service

import (
	"testing"

	"simple-ledger/internal/models"
	"simple-ledger/internal/user/dto"
	"simple-ledger/internal/user/repository"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestService() *UserService {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.AutoMigrate(&models.User{})
	repo := repository.NewUserRepository(db)
	return NewUserService(repo)
}

func TestCreateUser(t *testing.T) {
	service := setupTestService()

	req := &dto.CreateUserRequest{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "password123",
		Role:     "user",
	}

	user, err := service.CreateUser(req)
	assert.NoError(t, err)
	assert.Equal(t, "test@example.com", user.Email)
	assert.Equal(t, "Test User", user.Name)
	assert.Equal(t, "user", user.Role)
	assert.True(t, user.IsActive)
}

func TestCreateUserDuplicateEmail(t *testing.T) {
	service := setupTestService()

	req := &dto.CreateUserRequest{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "password123",
		Role:     "user",
	}

	// First user creation
	_, err := service.CreateUser(req)
	assert.NoError(t, err)

	// Try to create user with same email
	_, err = service.CreateUser(req)
	assert.Error(t, err)
	assert.Equal(t, "email already exists", err.Error())
}

func TestGetUser(t *testing.T) {
	service := setupTestService()

	req := &dto.CreateUserRequest{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "password123",
		Role:     "user",
	}

	created, _ := service.CreateUser(req)

	retrieved, err := service.GetUser(created.ID)
	assert.NoError(t, err)
	assert.Equal(t, created.Email, retrieved.Email)
	assert.Equal(t, created.Name, retrieved.Name)
}

func TestGetAllUsers(t *testing.T) {
	service := setupTestService()

	requests := []dto.CreateUserRequest{
		{Email: "user1@example.com", Name: "User 1", Password: "password123", Role: "user"},
		{Email: "user2@example.com", Name: "User 2", Password: "password123", Role: "admin"},
	}

	for _, req := range requests {
		service.CreateUser(&req)
	}

	users, err := service.GetAllUsers()
	assert.NoError(t, err)
	assert.Equal(t, 2, len(users))
}

func TestUpdateUser(t *testing.T) {
	service := setupTestService()

	req := &dto.CreateUserRequest{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "password123",
		Role:     "user",
	}

	created, _ := service.CreateUser(req)

	updateReq := &dto.UpdateUserRequest{
		Name:  "Updated Name",
		Email: "updated@example.com",
		Role:  "admin",
	}

	updated, err := service.UpdateUser(created.ID, updateReq)
	assert.NoError(t, err)
	assert.Equal(t, "Updated Name", updated.Name)
	assert.Equal(t, "updated@example.com", updated.Email)
	assert.Equal(t, "admin", updated.Role)
}

func TestUpdateUserPassword(t *testing.T) {
	service := setupTestService()

	req := &dto.CreateUserRequest{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "password123",
		Role:     "user",
	}

	created, _ := service.CreateUser(req)

	newPassword := "newpassword456"
	updateReq := &dto.UpdateUserRequest{
		Name:     created.Name,
		Email:    created.Email,
		Role:     created.Role,
		Password: &newPassword,
	}

	updated, err := service.UpdateUser(created.ID, updateReq)
	assert.NoError(t, err)

	// Verify password was updated (just check that no error occurred)
	assert.NotNil(t, updated)
	assert.NotEmpty(t, updated.UpdatedAt)
}

func TestDeleteUser(t *testing.T) {
	service := setupTestService()

	req := &dto.CreateUserRequest{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "password123",
		Role:     "user",
	}

	created, _ := service.CreateUser(req)

	err := service.DeleteUser(created.ID)
	assert.NoError(t, err)

	_, err = service.GetUser(created.ID)
	assert.Error(t, err)
}
