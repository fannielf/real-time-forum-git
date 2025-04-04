package backend

import (
	"database/sql"
	"log"
	"net/http"
	"strings"
)

var db *sql.DB

func APIHandler(w http.ResponseWriter, r *http.Request, database *sql.DB) {
	db = database

	if r.Method != http.MethodGet && r.Method != http.MethodPost {
		ResponseHandler(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	path := r.URL.Path

	trimmedPath := strings.TrimPrefix(path, "/api/")

	nextSlashIndex := strings.Index(trimmedPath, "/")

	var page string
	if nextSlashIndex != -1 {
		page = trimmedPath[:nextSlashIndex]
	} else {
		page = trimmedPath
	}

	// Handle different routes based on the URL path
	switch page {
	case "feed":
		HandleFeed(w, r) // Returns posts to be shown in feed
	case "auth":
		Authenticate(w, r)
	case "create-post":
		CreatePost(w, r)
	case "login":
		Login(w, r)
	case "signup":
		SignUp(w, r)
	case "logout":
		Logout(w, r)
	case "post":
		PostPage(w, r)
	case "refresh-session":
		SessionHandler(w, r)
	default:
		ResponseHandler(w, http.StatusNotFound, "Page Not Found")
		return
	}
}
