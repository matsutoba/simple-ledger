package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// ヘルスチェックエンドポイント
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// サンプルエンドポイント
	router.GET("/api/v1/hello", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello, World!",
		})
	})

	// POST example
	router.POST("/api/v1/data", func(c *gin.Context) {
		var data map[string]interface{}
		if err := c.BindJSON(&data); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, gin.H{
			"message": "Data received",
			"data":    data,
		})
	})

	// サーバー起動
	router.Run(":8080")
}
