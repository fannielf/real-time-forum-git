package websocket

import (
	"log"
	"real-time-forum/backend"
)

// Broadcast messages to all active clients
func BroadcastMessages() {
	for {
		msg := <-broadcast
		participants, err := backend.GetParticipants(msg.ChatID)
		updateUserInteraction(participants[0], participants[1])
		if err != nil {
			log.Println("Error getting chat participants")
			return
		}
		for client, id := range clients {
			for _, user := range participants {
				if user == id {
					err := client.WriteJSON(msg)
					if err != nil {
						log.Println("Write error:", err)
						client.Close()
						delete(clients, client)
					}
				}
			}
		}
	}
}

func AddChatToDB(userID int, msg *Message) {

	message_id, err := backend.AddMessageToDB(userID, msg.Content, msg.ChatID)
	if err != nil {
		log.Println("Error adding message:", err)
		return
	}
	timestamp, err := backend.GetTimestamp(message_id, "Message")
	if err != nil {
		log.Println("Error retrieving timestamp:", err)
		return
	}
	msg.CreatedAt = timestamp

}
