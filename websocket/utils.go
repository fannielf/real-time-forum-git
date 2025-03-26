package websocket

import (
	"net/http"

	"github.com/gorilla/websocket"
)

// WebSocket upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins (change for production)
	},
}

// Map to store active WebSocket connections
var clients = make(map[*websocket.Conn]bool)

// Channel to broadcast messages
var broadcast = make(chan Message)

// Message struct
type Message struct {
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
	Content  string `json:"content"`
}
