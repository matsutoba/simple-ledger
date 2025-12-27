package service

import (
	"fmt"
	"simple-ledger/internal/common/security"
	"simple-ledger/internal/user/repository"

	"gorm.io/gorm"
)

type AuthService struct {
	userRepo *repository.UserRepository
}

func NewAuthService(userRepo *repository.UserRepository) *AuthService {
	return &AuthService{userRepo: userRepo}
}

// Login はログイン処理を実行
// メールアドレスとパスワードでユーザーを認証し、JWT トークンを返す
func (s *AuthService) Login(email string, password string) (accessToken string, refreshToken string, err error) {
	// メールアドレスでユーザーを検索
	user, err := s.userRepo.GetUserByEmail(email)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return "", "", fmt.Errorf("invalid email or password")
		}
		return "", "", err
	}

	// ユーザーが有効か確認
	if !user.IsActive {
		return "", "", fmt.Errorf("user account is inactive")
	}

	// パスワード検証
	if !security.VerifyPassword(user.Password, &password) {
		return "", "", fmt.Errorf("invalid email or password")
	}

	// アクセストークンを生成
	accessToken, err = security.GenerateToken(user.ID, user.Email, user.Role, user.IsActive)
	if err != nil {
		return "", "", err
	}

	// リフレッシュトークンを生成
	refreshToken, err = security.GenerateRefreshToken(user.ID, user.Email, user.Role, user.IsActive)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

// RefreshAccessToken はアクセストークンを更新
func (s *AuthService) RefreshAccessToken(refreshToken string) (string, error) {
	// リフレッシュトークンを検証
	claims, err := security.VerifyToken(refreshToken)
	if err != nil {
		return "", fmt.Errorf("invalid refresh token")
	}

	// ユーザーを取得（最新情報を確認）
	user, err := s.userRepo.GetUserByID(claims.UserID)
	if err != nil {
		return "", err
	}

	// ユーザーが有効か確認
	if !user.IsActive {
		return "", fmt.Errorf("user account is inactive")
	}

	// 新しいアクセストークンを生成
	accessToken, err := security.GenerateToken(user.ID, user.Email, user.Role, user.IsActive)
	if err != nil {
		return "", err
	}

	return accessToken, nil
}
