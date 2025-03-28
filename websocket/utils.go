package websocket

import (
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// updates HTTP connection to websocket protocol
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins (change for production)
	},
}

var (
	clients          = make(map[*websocket.Conn]string)  // Map of WebSocket connections -> usernames
	userInteractions = make(map[string]map[string]int64) // map[username]map[otherUsername]timestamp
	broadcast        = make(chan Message)                // Channel for broadcasting messages
	clientsMutex     sync.Mutex                          // Protects access to activeUsers map
	//messagesMutex    sync.Mutex
)

type Message struct {
	Type     string   `json:"type"`     // "chat", "update_users"
	Username string   `json:"username"` // Sender
	Receiver string   `json:"receiver"` // Receiver
	Text     string   `json:"text"`     // Chat message (if any)
	Users    []string `json:"users"`    // List of users to be broadcasted
}

type UserInteraction struct {
	Username        string
	LastInteraction int64
}
