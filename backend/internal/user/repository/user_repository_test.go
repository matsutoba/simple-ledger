package repository

import (
	"testing"

	"simple-ledger/internal/models"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	_ = db.AutoMigrate(&models.User{})
	return db
}

func TestCreateUser(t *testing.T) {
	db := setupTestDB()
	repo := NewUserRepository(db)

	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "hashedpassword",
		Role:     "user",
		IsActive: true,
	}

	err := repo.CreateUser(user)
	assert.NoError(t, err)
	assert.NotZero(t, user.ID)
}

func TestGetUserByID(t *testing.T) {
	db := setupTestDB()
	repo := NewUserRepository(db)

	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "hashedpassword",
		Role:     "user",
		IsActive: true,
	}
	db.Create(user)

	retrieved, err := repo.GetUserByID(user.ID)
	assert.NoError(t, err)
	assert.Equal(t, user.Email, retrieved.Email)
	assert.Equal(t, user.Name, retrieved.Name)
}

func TestGetUserByEmail(t *testing.T) {
	db := setupTestDB()
	repo := NewUserRepository(db)

	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "hashedpassword",
		Role:     "user",
		IsActive: true,
	}
	db.Create(user)

	retrieved, err := repo.GetUserByEmail("test@example.com")
	assert.NoError(t, err)
	assert.Equal(t, user.ID, retrieved.ID)
}

func TestGetAllUsers(t *testing.T) {
	db := setupTestDB()
	repo := NewUserRepository(db)

	users := []models.User{
		{Email: "user1@example.com", Name: "User 1", Password: "hashed", Role: "user", IsActive: true},
		{Email: "user2@example.com", Name: "User 2", Password: "hashed", Role: "admin", IsActive: true},
	}

	for _, u := range users {
		db.Create(&u)
	}

	retrieved, err := repo.GetAllUsers()
	assert.NoError(t, err)
	assert.Equal(t, 2, len(retrieved))
}

func TestUpdateUser(t *testing.T) {
	db := setupTestDB()
	repo := NewUserRepository(db)

	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "hashedpassword",
		Role:     "user",
		IsActive: true,
	}
	db.Create(user)

	updates := map[string]interface{}{
		"name": "Updated Name",
		"role": "admin",
	}

	updated, err := repo.UpdateUser(user.ID, updates)
	assert.NoError(t, err)
	assert.Equal(t, "Updated Name", updated.Name)
	assert.Equal(t, "admin", updated.Role)
}

func TestDeleteUser(t *testing.T) {
	db := setupTestDB()
	repo := NewUserRepository(db)

	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "hashedpassword",
		Role:     "user",
		IsActive: true,
	}
	db.Create(user)

	err := repo.DeleteUser(user.ID)
	assert.NoError(t, err)

	_, err = repo.GetUserByID(user.ID)
	assert.Error(t, err)
}
