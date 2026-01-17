package dto

// LoginRequest はログインリクエスト
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse はログインレスポンス
// トークンはHttpOnly Cookieに設定されるため、ここには含めない
type LoginResponse struct {
	ExpiresIn int `json:"expiresIn"` // 秒単位
}

// RefreshTokenRequest はトークン更新リクエスト
type RefreshTokenRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}
