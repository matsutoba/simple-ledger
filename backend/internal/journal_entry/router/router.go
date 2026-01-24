package router

import (
	"simple-ledger/internal/auth/middleware"
	"simple-ledger/internal/journal_entry/controller"
	"simple-ledger/internal/journal_entry/repository"
	"simple-ledger/internal/journal_entry/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SetupJournalEntryRoutes: 仕訳エントリーのルートを設定
func SetupJournalEntryRoutes(api *gin.RouterGroup, db *gorm.DB) {
	// リポジトリ、サービス、コントローラーのインスタンス化
	repo := repository.NewJournalEntryRepository(db)
	svc := service.NewJournalEntryService(repo)
	ctrl := controller.NewJournalEntryController(svc)

	// 仕訳エントリーグループ
	journalEntryGroup := api.Group("/journal-entries")
	journalEntryGroup.Use(middleware.AuthMiddleware())
	{
		// POST: 取引に仕訳エントリーを作成
		journalEntryGroup.POST("/transactions/:transactionId", ctrl.CreateJournalEntry)

		// GET: 取引の全ての仕訳エントリーを取得
		journalEntryGroup.GET("/transactions/:transactionId", ctrl.GetJournalEntriesByTransactionID)

		// GET: 仕訳エントリーをIDで取得
		journalEntryGroup.GET("/:id", ctrl.GetJournalEntryByID)

		// PUT: 仕訳エントリーを更新
		journalEntryGroup.PUT("/:id", ctrl.UpdateJournalEntry)

		// DELETE: 仕訳エントリーを削除
		journalEntryGroup.DELETE("/:id", ctrl.DeleteJournalEntry)

		// GET: 取引のバランスを確認
		journalEntryGroup.GET("/transactions/:transactionId/validate", ctrl.ValidateTransaction)
	}
}
