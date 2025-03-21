package backend

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
)

var db *sql.DB

func APIHandler(w http.ResponseWriter, r *http.Request, database *sql.DB) {
	db = database

	path := r.URL.Path

	trimmedPath := strings.TrimPrefix(path, "/api/")

	nextSlashIndex := strings.Index(trimmedPath, "/")

	var page string
	if nextSlashIndex != -1 {
		page = trimmedPath[:nextSlashIndex]
	} else {
		page = trimmedPath
	}
	fmt.Println(page)

	// Handle different routes based on the URL path
	switch page {
	case "feed":
		HandleFeed(w, r) // Returns posts to be shown in feed
	case "authentication":
		CheckAuth(w, r)
	// case "create_post":
	// 	CreatePost(w, r) // API endpoint for creating a post
	// case "login":
	// 	Login(w, r) // API for login
	// case "logout":
	// 	Logout(w, r) // API for logout
	case "post":
		// Handle post details page (GET specific post)
		PostPage(w, r)
	default:
		//ErrorHandler(w, "Page Not Found", http.StatusNotFound)
	}
}
