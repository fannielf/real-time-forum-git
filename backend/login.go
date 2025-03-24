package backend

import (
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

// Login handles both GET and POST requests for user authentication
func Login(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		HandleLoginPost(w, r)
	default:
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
	}
}

// HandleLoginPost handles the user login form submission
func HandleLoginPost(w http.ResponseWriter, r *http.Request) {

	// Decode the JSON body into the LoginData struct
	var loginData LoginData
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&loginData)
	if err != nil {
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	userID, hashedPassword, err := getUserCredentials(loginData.Username)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		response := Response{Message: "Invalid username"}
		json.NewEncoder(w).Encode(response)
		return
	}

	// Verify password
	if err := verifyPassword(hashedPassword, loginData.Password); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		response := Response{Message: "Invalid password"}
		json.NewEncoder(w).Encode(response)
		return
	}

	// Create session
	if err := CreateSession(w, userID); err != nil {
		http.Error(w, `{"error": "Internal Server Error"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := Response{Message: "Login successful"}
	json.NewEncoder(w).Encode(response)
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
