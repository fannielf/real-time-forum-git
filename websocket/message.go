package websocket

import (
	"log"
	"real-time-forum/backend"
)

// Broadcast messages to all active clients
func BroadcastMessages() {
	for {
		message := <-broadcast
		log.Println("Getting participants")
		participants, err := backend.GetParticipants(message.ChatID)
		if err != nil {
			log.Println(err)
			return
		}
		updateUserInteraction(participants[0], participants[1])

		for client, id := range clients {
			for _, user := range participants {
				if user == id {
					err := client.WriteJSON(message)
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
	log.Println("Added to database")
	log.Println(msg.CreatedAt)

}
