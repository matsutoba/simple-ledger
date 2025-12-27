package main

import (
	"log"
	"simple-ledger/internal/common/config"
	migration "simple-ledger/internal/common/db"
	"simple-ledger/internal/common/db/seeder"
	userRouter "simple-ledger/internal/user/router"

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
	 * ルート定義
	 */
	log.Print("Setting up routes...")
	apiGroup := router.Group("/api")
	userRouter.SetupUserRoutes(apiGroup, db)

	// サーバー起動
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
