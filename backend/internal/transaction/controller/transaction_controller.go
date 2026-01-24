package controller

import (
	"net/http"
	"strconv"

	"simple-ledger/internal/transaction/dto"
	"simple-ledger/internal/transaction/service"

	"github.com/gin-gonic/gin"
)

type TransactionController interface {
	Create() gin.HandlerFunc
	GetByID() gin.HandlerFunc
	GetByUserID() gin.HandlerFunc
	GetByUserIDWithPagination() gin.HandlerFunc
	Update() gin.HandlerFunc
	Delete() gin.HandlerFunc
}

type transactionController struct {
	service service.TransactionService
}

func NewTransactionController(service service.TransactionService) TransactionController {
	return &transactionController{service: service}
}

func (ctrl *transactionController) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req dto.CreateTransactionRequest

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request body",
			})
			return
		}

		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "User ID not found",
			})
			return
		}

		result, err := ctrl.service.Create(userID.(uint), &req)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusCreated, result)
	}
}

func (ctrl *transactionController) GetByID() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.ParseUint(idStr, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid transaction ID",
			})
			return
		}

		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "User ID not found",
			})
			return
		}

		result, err := ctrl.service.GetByID(uint(id), userID.(uint))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		if result == nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Transaction not found",
			})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}

func (ctrl *transactionController) GetByUserID() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "User ID not found",
			})
			return
		}

		result, err := ctrl.service.GetByUserID(userID.(uint))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to fetch transactions",
			})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}

func (ctrl *transactionController) GetByUserIDWithPagination() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "User ID not found",
			})
			return
		}

		var req dto.GetTransactionsWithPaginationRequest
		if err := c.ShouldBindQuery(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid query parameters: " + err.Error(),
			})
			return
		}

		var result interface{}
		var err error

		// キーワードが指定されている場合は検索を実行
		if req.Keyword != "" {
			result, err = ctrl.service.GetByUserIDWithPaginationAndKeyword(userID.(uint), req.Page, req.PageSize, req.Keyword)
		} else {
			result, err = ctrl.service.GetByUserIDWithPagination(userID.(uint), req.Page, req.PageSize)
		}

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to fetch transactions",
			})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}

func (ctrl *transactionController) Update() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.ParseUint(idStr, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid transaction ID",
			})
			return
		}

		var req dto.CreateTransactionRequest

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request body",
			})
			return
		}

		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "User ID not found",
			})
			return
		}

		result, err := ctrl.service.Update(uint(id), userID.(uint), &req)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		if result == nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Transaction not found",
			})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}

func (ctrl *transactionController) Delete() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.ParseUint(idStr, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid transaction ID",
			})
			return
		}

		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "User ID not found",
			})
			return
		}

		if err := ctrl.service.Delete(uint(id), userID.(uint)); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Transaction deleted successfully",
		})
	}
}
