package security

import (
	"golang.org/x/crypto/bcrypt"
)

// HashPassword はパスワードをハッシュ化する
func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

// VerifyPassword はパスワードとハッシュを検証する
func VerifyPassword(hashedPassword string, password *string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(*password))
	return err == nil
}
