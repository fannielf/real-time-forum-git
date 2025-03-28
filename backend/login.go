package backend

import (
	"encoding/json"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

// Login handles both GET and POST requests for user authentication
func Login(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		HandleLoginPost(w, r)
	default:
		ResponseHandler(w, http.StatusMethodNotAllowed, "Method Not Allowed")
	}
}

// HandleLoginPost handles the user login form submission
func HandleLoginPost(w http.ResponseWriter, r *http.Request) {

	// Decode the JSON body into the LoginData struct
	var loginData LoginData
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&loginData)
	if err != nil {
		log.Println("Error decoding the login data")
		ResponseHandler(w, http.StatusBadRequest, "Bad Request")
		return
	}

	message := "Login successful"
	status := http.StatusOK
	userID, hashedPassword, err := getUserCredentials(loginData.Username)
	if err != nil {
		log.Println("Invalid username")
		status = http.StatusUnauthorized
		message = "Invalid username"
	} else if err := verifyPassword(hashedPassword, loginData.Password); err != nil {
		log.Println("Invalid password")
		status = http.StatusUnauthorized
		message = "Invalid password"
	}
	// Create session
	if err := CreateSession(w, userID); err != nil {
		log.Println("Error creating session")
		ResponseHandler(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}
	ResponseHandler(w, status, message)
}

// getUserCredentials retrieves the user's ID and hashed password from the database
func getUserCredentials(username string) (int, string, error) {
	var userID int
	var hashedPassword string

	err := db.QueryRow("SELECT id, password FROM User WHERE username = ?", username).Scan(&userID, &hashedPassword)
	if err != nil {
		return 0, "", err
	}
	return userID, hashedPassword, nil
}

// verifyPassword compares the hashed password with the password provided by the user
func verifyPassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
