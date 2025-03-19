package main

import (
	"log"
	"net/http"
	"real-time-forum/backend"
	"real-time-forum/database"
)

func main() {

	http.Handle("/assets/", http.FileServer(http.Dir(".")))

	// Initialize database
	db := database.InitDB()
	defer db.Close()

	database.MakeTables(db)

	// One API Handler for all pages
	http.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
		backend.APIHandler(w, r, db)
	})

	log.Println("Server is running on http://localhost:8080")

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Error starting the server:", err)
	}
}
