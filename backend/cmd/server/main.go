package main

import (
	"log"
	"simple-ledger/internal/common/config"

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

	// サーバー起動
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
