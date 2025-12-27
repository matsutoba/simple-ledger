package main

import (
	"log"
	authRouter "simple-ledger/internal/auth/router"
	"simple-ledger/internal/common/config"
	migration "simple-ledger/internal/common/db"
	"simple-ledger/internal/common/db/seeder"
	"simple-ledger/internal/common/security"
	userRouter "simple-ledger/internal/user/router"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	/*
	 * 環境変数読み込み
	 */
	log.Print("Loading environment variables...")
	config.LoadEnv()

	/*
	 * CORS 設定
	 */
	allowedOrigins := config.GetEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:80")
	allowOriginsList := strings.Split(allowedOrigins, ",")
	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowOriginsList,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 3600,
	}))
	log.Printf("CORS configured for origins: %v", allowOriginsList)

	/*
	 * DB接続
	 */
	log.Print("Setting up database...")
	db, err := config.SetupDatabase()
	if err != nil {
		log.Fatalf("Failed to setup database: %v", err)
	}
	log.Printf("Database connected successfully: %v", db != nil)

	/*
	 * マイグレーション実行
	 */
	log.Print("Running database migrations...")
	if err := migration.Migrate(db); err != nil {
		log.Fatalf("failed to migrate: %v", err)
	}
	log.Print("Database migrations completed.")

	/*
	 * シードデータ投入
	 */
	env := config.GetEnv("APP_ENV", "development")
	if env != "production" {
		log.Print("Seeding initial data...")
		seeder.SeedAll(db)
		log.Print("Data seeding completed.")
	}

	/*
	 * JWT 初期化
	 */
	log.Print("Initializing JWT...")
	jwtSecret := config.GetEnv("JWT_SECRET", "")
	tokenExpirationHours := config.GetEnvAsInt("TOKEN_EXPIRATION_HOURS", 1)
	refreshTokenExpirationHours := config.GetEnvAsInt("REFRESH_TOKEN_EXPIRATION_HOURS", 1)
	security.InitJWT(jwtSecret, tokenExpirationHours, refreshTokenExpirationHours)
	log.Printf("JWT initialized (token: %d hours, refresh: %d hours)", tokenExpirationHours, refreshTokenExpirationHours)

	/*
	 * ルート定義
	 */
	log.Print("Setting up routes...")
	apiGroup := router.Group("/api")
	userRouter.SetupUserRoutes(apiGroup, db)
	authRouter.SetupAuthRoutes(apiGroup, db)
	log.Print("Routes setup completed.")

	// サーバー起動
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
