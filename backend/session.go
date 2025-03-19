package backend

import (
	"log"
	"net/http"
)

// VerifySession checks if the session ID exists in the database
func VerifySession(r *http.Request) (bool, int, string) {
	var userID int
	var username string
	cookie, err := r.Cookie("session_id")
	if err != nil {
		return false, 0, ""
	}

	err = db.QueryRow("SELECT user_id FROM Session WHERE id = ?", cookie.Value).Scan(&userID)
	if err != nil {
		log.Println("No userID found for the cookie")
		return false, 0, ""
	}

	err = db.QueryRow("SELECT username FROM User WHERE id = ?", userID).Scan(&username)
	if err != nil {
		log.Println("No username found")
		return false, 0, ""
	}

	return true, userID, username
}
