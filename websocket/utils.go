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
	clients          = make(map[*websocket.Conn]int) // Map of WebSocket connections -> userID
	userInteractions = make(map[int]map[int]int64)   // map[username]map[otherUsername]timestamp
	broadcast        = make(chan Message)            // Channel for broadcasting messages
	clientsMutex     sync.Mutex                      // Protects access to activeUsers map
	//messagesMutex    sync.Mutex
)

type Message struct {
	Type      string        `json:"type"`       // "chat", "message", "update_users"
	Sender    int           `json:"sender"`     // Sender
	ChatUser  int           `json:"chat_user"`  // The person opened for a chat
	ChatID    int           `json:"chat_id"`    // Chat ID
	CreatedAt string        `json:"created_at"` // Timestamp for the message
	Content   string        `json:"content"`    // Chat message
	Users     []SortedUsers `json:"users"`      // sorted users with userID and username
	History   []Message     `json:"history"`    // Message history
}

type Users struct {
	UserID          int
	Username        string
	LastInteraction int64
}

type SortedUsers struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
}
