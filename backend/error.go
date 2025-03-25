package backend

import (
	"fmt"
	"net/http"
)

func ErrorHandler(w http.ResponseWriter, statusCode int, message string) {
	w.WriteHeader(statusCode)
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"error": "%s"}`, message)
}
