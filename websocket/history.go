package websocket

import (
	"log"
	"real-time-forum/backend"

	"github.com/gorilla/websocket"
)

func HandleChatHistory(conn *websocket.Conn, userID int, msg Message) {
	chatUser := msg.ChatUser
	chatID, err := backend.GetChatID(userID, chatUser.ID)
	if err != nil {
		log.Println("Error getting chatID: ", err)
		return
	}

	log.Println(chatID)
	var history []map[string]interface{}
	err = backend.GetHistory(chatID, &history)
	if err != nil {
		log.Println("Error retreiving chat history: ", err)
		return
	}

	// Convert []map[string]interface{} to []Message
	var messages []Message
	for _, entry := range history {
		sender, _ := entry["sender"].(int) // Convert sender to int
		username, _ := entry["username"].(string)
		content, _ := entry["content"].(string)     // Convert content to string
		createdAt, _ := entry["createdAt"].(string) // Convert timestamp to string

		messages = append(messages, Message{
			Sender: User{
				ID:       sender,
				Username: username,
			},
			Content:   content,
			CreatedAt: createdAt,
		})
	}

	reponse := Message{
		Type:     "chat",
		History:  messages,
		ChatID:   chatID,
		ChatUser: chatUser,
	}

	err = conn.WriteJSON(reponse)
	if err != nil {
		log.Println("Error sending history:", err)
	}
}
