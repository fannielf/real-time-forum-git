package backend

import (
	"encoding/json"
	"log"
	"net/http"
	"net/mail"
	"regexp"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// signUp handles both GET and POST requests for user registration
func SignUp(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		handleSignUpPost(w, r)
	default:
		ErrorHandler(w, http.StatusMethodNotAllowed, "Method Not Allowed")
	}
}

func handleSignUpPost(w http.ResponseWriter, r *http.Request) {
	// Decode the JSON body into the LoginData struct
	var signUpData SignUpData
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&signUpData)
	if err != nil {
		ErrorHandler(w, http.StatusBadRequest, "Bad Request")
		return
	}

	w.WriteHeader(http.StatusOK)
	response := Response{Message: "Login successful"}

	// Validate username
	if !IsValidUsername(signUpData.Username) {
		w.WriteHeader(http.StatusBadRequest)
		response = Response{Message: "Invalid username: must be 3-20 characters, letters, numbers, or _"}
	} else if !isValidEmail(signUpData.Email) {
		w.WriteHeader(http.StatusBadRequest)
		response = Response{Message: "Invalid email address"}
	} else if signUpData.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		response = Response{Message: "Password cannot be empty"}
	}

	uniqueUsername, uniqueEmail, err := isUsernameOrEmailUnique(signUpData.Username, signUpData.Email)
	if err != nil {
		log.Println("Error checking if username is unique:", err)
		ErrorHandler(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}
	if !uniqueUsername {
		w.WriteHeader(http.StatusConflict)
		response = Response{Message: "Username is already taken"}
	}
	if !uniqueEmail {
		w.WriteHeader(http.StatusConflict)
		response = Response{Message: "Email is already registered to existing user"}
	}

	// Hash the password
	hashedPassword, err := hashPassword(signUpData.Password)
	if err != nil {
		log.Println("Error hashing password:", err)
		ErrorHandler(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	// Insert user into database
	err = insertUserIntoDB(signUpData.Username, signUpData.Email, hashedPassword)
	if err != nil {
		log.Println("Error inserting user into database:", err)
		ErrorHandler(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	json.NewEncoder(w).Encode(response)
}

// hashPassword hashes the user's password using bcrypt
func hashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashed), err
}

// insertUserIntoDB inserts the user's details into the database
func insertUserIntoDB(username, email, hashedPassword string) error {
	_, err := db.Exec("INSERT INTO User (username, email, password, created_at) VALUES (?, ?, ?, ?)",
		username, email, hashedPassword, time.Now().Format("2006-01-02 15:04:05"))
	return err
}

// isValidEmail checks if the email address is valid
func isValidEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

// IsValidUsername checks if the username is valid
func IsValidUsername(username string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9_]{3,20}$`) // Only letters, numbers, and _
	return re.MatchString(username)
}

// isUsernameOrEmailUnique checks if the username or email is unique in the database
func isUsernameOrEmailUnique(username, email string) (bool, bool, error) {
	username = strings.ToLower(username)
	email = strings.ToLower(email)

	var count int
	err := db.QueryRow(`
        SELECT COUNT(*) 
        FROM User 
        WHERE username = ?`, username).Scan(&count)
	if err != nil || count != 0 {
		return false, false, err
	}
	err = db.QueryRow(`
        SELECT COUNT(*) 
        FROM User 
        WHERE email = ?`, email).Scan(&count)
	if err != nil || count != 0 {
		return true, false, err
	}
	return true, true, nil // Returns true if neither username nor email exists
}
