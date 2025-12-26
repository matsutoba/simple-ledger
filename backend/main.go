package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

var db *sql.DB

type HealthResponse struct {
	Status   string `json:"status"`
	Database string `json:"database"`
}

func main() {
	var err error

	// Database connection
	dbUser := getEnv("DB_USER", "root")
	dbPass := getEnv("DB_PASSWORD", "password")
	dbHost := getEnv("DB_HOST", "db")
	dbPort := getEnv("DB_PORT", "3306")
	dbName := getEnv("DB_NAME", "ledger")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPass, dbHost, dbPort, dbName)

	// Retry connection
	for i := 0; i < 30; i++ {
		db, err = sql.Open("mysql", dsn)
		if err != nil {
			log.Printf("Failed to open database: %v", err)
			time.Sleep(2 * time.Second)
			continue
		}

		err = db.Ping()
		if err == nil {
			log.Println("Successfully connected to database")
			break
		}

		log.Printf("Failed to connect to database (attempt %d/30): %v", i+1, err)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		log.Fatal("Could not connect to database after 30 attempts")
	}

	defer db.Close()

	// Initialize database schema
	initDB()

	// Router
	r := mux.NewRouter()

	// Routes
	r.HandleFunc("/api/health", healthHandler).Methods("GET")
	r.HandleFunc("/api/transactions", getTransactionsHandler).Methods("GET")

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://frontend:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	port := getEnv("PORT", "8080")
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func initDB() {
	schema := `
	CREATE TABLE IF NOT EXISTS transactions (
		id INT AUTO_INCREMENT PRIMARY KEY,
		date DATE NOT NULL,
		description VARCHAR(255) NOT NULL,
		amount DECIMAL(10, 2) NOT NULL,
		type ENUM('income', 'expense') NOT NULL,
		category VARCHAR(100),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	);
	`

	_, err := db.Exec(schema)
	if err != nil {
		log.Printf("Failed to initialize database schema: %v", err)
	} else {
		log.Println("Database schema initialized successfully")
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	dbStatus := "connected"
	if err := db.Ping(); err != nil {
		dbStatus = "disconnected"
	}

	response := HealthResponse{
		Status:   "ok",
		Database: dbStatus,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getTransactionsHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, date, description, amount, type, category, created_at FROM transactions ORDER BY date DESC LIMIT 100")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var transactions []map[string]interface{}

	for rows.Next() {
		var id int
		var date, description, transType, category string
		var amount float64
		var createdAt time.Time

		err := rows.Scan(&id, &date, &description, &amount, &transType, &category, &createdAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		transaction := map[string]interface{}{
			"id":          id,
			"date":        date,
			"description": description,
			"amount":      amount,
			"type":        transType,
			"category":    category,
			"created_at":  createdAt,
		}
		transactions = append(transactions, transaction)
	}

	if transactions == nil {
		transactions = []map[string]interface{}{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(transactions)
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
