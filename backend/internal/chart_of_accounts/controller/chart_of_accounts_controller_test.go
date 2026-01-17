package controller

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"simple-ledger/internal/chart_of_accounts/dto"
	"simple-ledger/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockChartOfAccountsService struct {
	mock.Mock
}

func (m *MockChartOfAccountsService) GetByTypes(types []models.AccountType) (*dto.GetChartOfAccountsResponse, error) {
	args := m.Called(types)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*dto.GetChartOfAccountsResponse), args.Error(1)
}

func TestGetByTypes_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockService := new(MockChartOfAccountsService)
	response := &dto.GetChartOfAccountsResponse{
		Accounts: []dto.ChartOfAccountsResponse{
			{ID: 1, Code: "4000", Name: "売上", Type: "revenue", NormalBalance: "credit"},
		},
		Total: 1,
	}

	mockService.On("GetByTypes", mock.Anything).Return(response, nil)

	controller := NewChartOfAccountsController(mockService)

	req := httptest.NewRequest("GET", "/api/chart-of-accounts?types=revenue", nil)
	w := httptest.NewRecorder()

	c, _ := gin.CreateTestContext(w)
	c.Request = req

	controller.GetByTypes()(c)

	assert.Equal(t, http.StatusOK, w.Code)
	mockService.AssertExpectations(t)
}

func TestGetByTypes_MissingParameter(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockService := new(MockChartOfAccountsService)
	controller := NewChartOfAccountsController(mockService)

	req := httptest.NewRequest("GET", "/api/chart-of-accounts", nil)
	w := httptest.NewRecorder()

	c, _ := gin.CreateTestContext(w)
	c.Request = req

	controller.GetByTypes()(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestGetByTypes_ServiceError(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockService := new(MockChartOfAccountsService)
	mockService.On("GetByTypes", mock.Anything).Return(nil, assert.AnError)

	controller := NewChartOfAccountsController(mockService)

	req := httptest.NewRequest("GET", "/api/chart-of-accounts?types=revenue", nil)
	w := httptest.NewRecorder()

	c, _ := gin.CreateTestContext(w)
	c.Request = req

	controller.GetByTypes()(c)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	mockService.AssertExpectations(t)
}
