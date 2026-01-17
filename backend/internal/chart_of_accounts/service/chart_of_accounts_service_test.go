package service

import (
	"errors"
	"testing"

	"simple-ledger/internal/models"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockChartOfAccountsRepository struct {
	mock.Mock
}

func (m *MockChartOfAccountsRepository) GetByTypes(types []models.AccountType) ([]models.ChartOfAccounts, error) {
	args := m.Called(types)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]models.ChartOfAccounts), args.Error(1)
}

func TestGetByTypes_Success(t *testing.T) {
	mockRepo := new(MockChartOfAccountsRepository)

	accounts := []models.ChartOfAccounts{
		{ID: 1, Code: "4000", Name: "売上", Type: models.RevenueAccount, NormalBalance: models.CreditBalance, IsActive: true},
	}

	mockRepo.On("GetByTypes", mock.Anything).Return(accounts, nil)

	service := NewChartOfAccountsService(mockRepo)
	result, err := service.GetByTypes([]models.AccountType{models.RevenueAccount})

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result.Accounts, 1)
	assert.Equal(t, 1, result.Total)
	mockRepo.AssertExpectations(t)
}

func TestGetByTypes_RepositoryError(t *testing.T) {
	mockRepo := new(MockChartOfAccountsRepository)

	mockRepo.On("GetByTypes", mock.Anything).Return(nil, errors.New("database error"))

	service := NewChartOfAccountsService(mockRepo)
	result, err := service.GetByTypes([]models.AccountType{models.RevenueAccount})

	assert.Error(t, err)
	assert.Nil(t, result)
	mockRepo.AssertExpectations(t)
}

func TestGetByTypes_EmptyResult(t *testing.T) {
	mockRepo := new(MockChartOfAccountsRepository)

	mockRepo.On("GetByTypes", mock.Anything).Return([]models.ChartOfAccounts{}, nil)

	service := NewChartOfAccountsService(mockRepo)
	result, err := service.GetByTypes([]models.AccountType{models.LiabilityAccount})

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result.Accounts, 0)
	assert.Equal(t, 0, result.Total)
	mockRepo.AssertExpectations(t)
}
