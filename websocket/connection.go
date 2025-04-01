package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"real-time-forum/backend"
	"strconv"
)

// Handles Websocket connections
func HandleConnections(w http.ResponseWriter, r *http.Request) {

	loggedIn, userID := backend.VerifySession(r)
	if !loggedIn {
		return
	}

	// username, err := backend.GetUsername(userID)
	// if err != nil {
	// 	log.Println(err)
	// 	return
	// }

	// upgrade to Websocket protocol
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer func() {
		// Remove the connection from the clients
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

	// Indefinite loop to listen messages while connection open
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

		messagesMutex.Lock()

		err = json.Unmarshal(p, &msg) // Unmarshal the bytes into the struct
		if err != nil {
			log.Println("Error unmarshalling JSON:", err)
			continue // Handle the error appropriately
		}

		if msg.Type == "chatBE" {
			HandleChatHistory(conn, userID, msg)

		} else if msg.Type == "messageBE" {

			messageID := AddChatToDB(userID, msg)
			if messageID != 0 {
				latestMessage, err := backend.GetMessage(messageID)
				if err != nil {
					log.Println("Error getting latest message:", err)
					return
				}
				chatID, _ := strconv.Atoi(latestMessage[0])
				senderID, _ := strconv.Atoi(latestMessage[1])

				message := Message{
					Type:   "message",
					ChatID: chatID,
					Sender: User{
						ID:       senderID,
						Username: latestMessage[2],
					},
					Content:   latestMessage[3],
					CreatedAt: latestMessage[4],
				}
				broadcast <- message
			}
		}
		msg = Message{}
		messagesMutex.Unlock()

	}
}
