package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"real-time-forum/backend"
)

// Handles Websocket connections
func HandleConnections(w http.ResponseWriter, r *http.Request) {

	loggedIn, userID := backend.VerifySession(r)
	if !loggedIn {
		return
	}

	// upgrade to Websocket protocol
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer func() {
		// Remove the connection from the clients map
		delete(clients, conn)
		conn.Close()
	}()

	log.Println("New Websocket connection established")

	clientsMutex.Lock()
	// add user to clients
	clients[conn] = userID
	// Initialize interactions map for this user if not exists
	if _, exists := userInteractions[userID]; !exists {
		userInteractions[userID] = make(map[int]int64)
	}
	broadcastActiveUsers()
	clientsMutex.Unlock()

	var msg Message

	// // Listen for messages
	for {
		_, p, err := conn.ReadMessage()
		if err != nil {

			// Remove user connection & remove from active users
			clientsMutex.Lock()
			delete(clients, conn)
			broadcastActiveUsers()
			clientsMutex.Unlock()
			break
		}
		log.Printf("Received: %s\n", p)
		err = json.Unmarshal(p, &msg) // Unmarshal the bytes into the struct
		if err != nil {
			log.Println("Error unmarshalling JSON:", err)
			continue // Handle the error appropriately
		}

		if msg.Type == "chat" {
			HandleChatHistory(conn, userID, msg)

		} else if msg.Type == "message" {
			AddChatToDB(userID, &msg)
			log.Println(msg)
			broadcast <- msg
		}
	}
}
