package service

import (
	"simple-ledger/internal/chart_of_accounts/dto"
	"simple-ledger/internal/chart_of_accounts/repository"
	"simple-ledger/internal/models"
)

type ChartOfAccountsService interface {
	// GetByTypes: 指定された勘定科目区分のデータを取得し、DTOに変換
	GetByTypes(types []models.AccountType) (*dto.GetChartOfAccountsResponse, error)
}

type chartOfAccountsService struct {
	repo repository.ChartOfAccountsRepository
}

func NewChartOfAccountsService(repo repository.ChartOfAccountsRepository) ChartOfAccountsService {
	return &chartOfAccountsService{repo: repo}
}

func (s *chartOfAccountsService) GetByTypes(types []models.AccountType) (*dto.GetChartOfAccountsResponse, error) {
	// リポジトリからデータ取得
	accounts, err := s.repo.GetByTypes(types)
	if err != nil {
		return nil, err
	}

	// モデルをDTOに変換
	var accountResponses []dto.ChartOfAccountsResponse
	for _, account := range accounts {
		accountResponses = append(accountResponses, dto.ChartOfAccountsResponse{
			ID:            account.ID,
			Code:          account.Code,
			Name:          account.Name,
			Type:          string(account.Type),
			NormalBalance: string(account.NormalBalance),
			Description:   account.Description,
			IsActive:      account.IsActive,
		})
	}

	return &dto.GetChartOfAccountsResponse{
		Accounts: accountResponses,
		Total:    len(accountResponses),
	}, nil
}
