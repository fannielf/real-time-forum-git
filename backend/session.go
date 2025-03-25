package backend

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
)

func Authenticate(w http.ResponseWriter, r *http.Request) {
	status := http.StatusUnauthorized
	message := "No current sessions"
	loggedIn, _ := VerifySession(w, r)
	if loggedIn {
		status = http.StatusOK
		message = "Current session found"
	}

	ResponseHandler(w, status, message)
}

// CreateSession creates a new session for the user and stores it in the database
func CreateSession(w http.ResponseWriter, userID int) error {
	//First check for and delete any existing sessions for this user
	_, err := db.Exec("UPDATE Session SET status = 'deleted', updated_at = ? WHERE user_id = ? AND status = 'active'",
		time.Now().Format("2006-01-02 15:04:05"), userID)
	if err != nil {
		return err
	}
	sessionID := uuid.NewString()
	expirationTime := time.Now().Add(30 * time.Minute)
	currentTime := time.Now().Format("2006-01-02 15:04:05")
	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    sessionID,
		Expires:  expirationTime,
		HttpOnly: true, // Prevent JavaScript from accessing the cookie
		Path:     "/",
	})

	// Store session ID in database
	_, err = db.Exec(`
    INSERT INTO Session (id, user_id, created_at, updated_at, expires_at, last_access) 
    VALUES (?, ?, ?, ?, ?, ?)`,
		sessionID, // Using the same UUID for session_token
		userID,
		currentTime,
		currentTime,
		expirationTime.Format("2006-01-02 15:04:05"), // expires_at (correct format)
		currentTime,
	)
	log.Println(err)
	return err
}

// VerifySession checks if the session ID exists in the database
func VerifySession(w http.ResponseWriter, r *http.Request) (bool, int) {
	var userID int
	cookie, err := r.Cookie("session_id")
	if err != nil {
		return false, 0
	}

	err = db.QueryRow("SELECT user_id FROM Session WHERE id = ? AND status = 'active'", cookie.Value).Scan(&userID)
	if err != nil {
		log.Println("No userID found for the cookie")
		return false, 0
	}

	return true, userID
}

// Update session expiry time
func refreshSessionExpiry(userID int) {
	// Simulate updating the expiry time in the backend (e.g., database)
	var lastAccess string
	err := db.QueryRow("SELECT last_access FROM Session WHERE user_id = ?", userID).Scan(&lastAccess)
	if err != nil {
		log.Println("No userID found")
		return
	}
	parsedTime, err := time.Parse("2006-01-02 15:04:05", lastAccess)
	if err != nil {
		log.Println("Error parsing last_access:", err)
		return
	}

	// Add 30 minutes to the parsed time
	newSessionExpiry := parsedTime.Add(30 * time.Minute)

	_, err = db.Exec("UPDATE Session SET last_access = ? WHERE user_id = ?", newSessionExpiry.Format("2006-01-02 15:04:05"), userID)
	if err != nil {
		log.Println("Error updating session expiry:", err)
		return
	}
}

func checkSessionExpiry(userID int) bool {

	var sessionExpiry string
	err := db.QueryRow("SELECT expires_at FROM Session WHERE user_id = ?", userID).Scan(&sessionExpiry)
	if err != nil {
		log.Println("No userID found")
		return false
	}
	parsedTime, err := time.Parse("2006-01-02 15:04:05", sessionExpiry)
	if err != nil {
		log.Println("Error parsing session expiry:", err)
		return false
	}

	if parsedTime.Before(time.Now()) {
		_, err = db.Exec("UPDATE Session SET status = 'expired' AND updated_at = ? WHERE user_id = ?", time.Now().Format("2006-01-02 15:04:05"), userID)
		if err != nil {
			log.Println("Error updating session expiry:", err)
		}
		return false
	}

	return true
}

// Handler to verify or expire session
func SessionHandler(w http.ResponseWriter, r *http.Request) {
	var response Response
	loggedIn, userID := VerifySession(w, r)
	if !loggedIn {
		w.WriteHeader(http.StatusUnauthorized)
		response = Response{Message: "Session expired"}
	} else {
		refreshSessionExpiry(userID)
		activeSession := checkSessionExpiry(userID)
		if activeSession {
			w.WriteHeader(http.StatusOK)
			response = Response{Message: "Session refreshed"}
		} else {
			w.WriteHeader(http.StatusUnauthorized)
			response = Response{Message: "Session expired"}
		}
	}
	// Respond with a appropriate message
	json.NewEncoder(w).Encode(response)

}
