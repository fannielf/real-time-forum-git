package websocket

import (
	"log"
	"real-time-forum/backend"

	"github.com/gorilla/websocket"
)

func HandleChatHistory(conn *websocket.Conn, userID int, msg Message) {
	chatID, err := backend.GetChatID(userID, msg.ChatUser)
	if err != nil {
		log.Println("Error getting chatID: ", err)
		return
	}
	var history []map[string]interface{}
	err = backend.GetHistory(chatID, &history)
	if err != nil {
		log.Println("Error retreiving chat history: ", err)
		return
	}

	// Convert []map[string]interface{} to []Message
	var messages []Message
	for _, entry := range history {
		sender, _ := entry["sender"].(int)          // Convert sender to int
		content, _ := entry["content"].(string)     // Convert content to string
		createdAt, _ := entry["createdAt"].(string) // Convert timestamp to string

		messages = append(messages, Message{
			Sender:    sender,
			Content:   content,
			CreatedAt: createdAt,
		})
	}

	msg = Message{}
	msg.History = messages
	msg.ChatID = chatID

	err = conn.WriteJSON(msg)
	if err != nil {
		log.Println("Error sending history:", err)
	}
}
