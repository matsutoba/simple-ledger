package controller

import (
	"net/http"
	"strconv"

	"simple-ledger/internal/journal_entry/dto"
	"simple-ledger/internal/journal_entry/service"

	"github.com/gin-gonic/gin"
)

// JournalEntryController: 仕訳エントリーコントローラー
type JournalEntryController struct {
	service *service.JournalEntryService
}

// NewJournalEntryController: 仕訳エントリーコントローラーの生成
func NewJournalEntryController(service *service.JournalEntryService) *JournalEntryController {
	return &JournalEntryController{service: service}
}

// CreateJournalEntry: 仕訳エントリーを作成
func (ctrl *JournalEntryController) CreateJournalEntry(c *gin.Context) {
	transactionIDStr := c.Param("transactionId")
	transactionID, err := strconv.ParseUint(transactionIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid transaction ID"})
		return
	}

	var req dto.CreateJournalEntryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	entry, err := ctrl.service.CreateJournalEntry(uint(transactionID), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, dto.ToJournalEntryResponse(entry))
}

// GetJournalEntryByID: IDで仕訳エントリーを取得
func (ctrl *JournalEntryController) GetJournalEntryByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	entry, err := ctrl.service.GetJournalEntryByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Journal entry not found"})
		return
	}

	c.JSON(http.StatusOK, dto.ToJournalEntryResponse(entry))
}

// GetJournalEntriesByTransactionID: 取引IDで仕訳エントリーの一覧を取得
func (ctrl *JournalEntryController) GetJournalEntriesByTransactionID(c *gin.Context) {
	transactionIDStr := c.Param("transactionId")
	transactionID, err := strconv.ParseUint(transactionIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid transaction ID"})
		return
	}

	entries, err := ctrl.service.GetJournalEntriesByTransactionID(uint(transactionID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dto.ToJournalEntryResponseSlice(entries))
}

// ValidateTransaction: 取引のバランスを確認
func (ctrl *JournalEntryController) ValidateTransaction(c *gin.Context) {
	transactionIDStr := c.Param("transactionId")
	transactionID, err := strconv.ParseUint(transactionIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid transaction ID"})
		return
	}

	isValid, err := ctrl.service.ValidateTransaction(uint(transactionID))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"transactionId": transactionID,
		"isValid":       isValid,
	})
}

// UpdateJournalEntry: 仕訳エントリーを更新
func (ctrl *JournalEntryController) UpdateJournalEntry(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req dto.CreateJournalEntryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	entry, err := ctrl.service.UpdateJournalEntry(uint(id), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dto.ToJournalEntryResponse(entry))
}

// DeleteJournalEntry: 仕訳エントリーを削除
func (ctrl *JournalEntryController) DeleteJournalEntry(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := ctrl.service.DeleteJournalEntry(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Journal entry deleted successfully"})
}
