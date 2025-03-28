package websocket

import (
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
	defer func() {
		// Remove the connection from the clients map
		delete(clients, conn)
		conn.Close()
	}()

	var msg Message

	// // Listen for messages
	for {
		err := conn.ReadJSON(&msg)
		if err != nil {

			// Remove user connection & remove from active users
			clientsMutex.Lock()
			delete(clients, conn)
			broadcastActiveUsers()
			clientsMutex.Unlock()
			break
		}

		// 	receiverUsername := msg.Receiver // Assuming you have this field in your message
		// 	updateUserInteraction(username, receiverUsername)

		// 	broadcast <- msg
	}
}

// Update the interaction timestamp between two users
// func updateUserInteraction(sender, receiver string) {
// 	clientsMutex.Lock()
// 	defer clientsMutex.Unlock()

// 	// Update the last active timestamp for the interaction between sender and receiver
// 	userInteractions[sender][receiver] = time.Now().Unix() // Store timestamp in seconds
// }
