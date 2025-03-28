package websocket

import (
	"log"
	"real-time-forum/backend"
	"sort"
	"time"
)

// Broadcast the active users list exluding the user themselves
func broadcastActiveUsers() {

	// Send sorted list to each client
	for client, userID := range clients {
		sortedUsers := sortActiveUsers(userID)

		// Send the list of active users back to the client
		message := Message{
			Type:  "update_users",
			Users: sortedUsers, // Send the active users list
		}
		log.Println(message)
		err := client.WriteJSON(message)
		if err != nil {
			log.Println("Error sending user update:", err)
			client.Close()
			delete(clients, client)
		}
	}
}

// Sorts users: latest conversations first, then alphabetically
func sortActiveUsers(userID int) []SortedUsers {
	var sortedUsers []Users
	var noInteractionUsers []Users

	// Fetch active users from the database
	activeUsers, err := backend.GetActiveUsers()
	if err != nil {
		log.Println("Error fetching active users:", err)
		return nil
	}
	// Iterate through all active clients (users)
	for user_id, username := range activeUsers {
		log.Println(username)
		// Skip the current user
		if user_id == userID {
			continue
		}

		// // Check for interactions where the current user is involved (either as the user or as the other user)
		interactions, exists := userInteractions[user_id]
		if exists {
			// Get the interaction timestamp with the current user
			var lastInteraction int64
			// Check both directions: currentUser <-> username
			if timestamp, ok := interactions[userID]; ok {
				lastInteraction = timestamp
			}

			// If we have a timestamp, add the user to the sorted list
			if lastInteraction > 0 {
				sortedUsers = append(sortedUsers, Users{
					UserID:          user_id,
					Username:        username,
					LastInteraction: lastInteraction,
				})
			} else {
				//If no interaction with currentUser, add to the no interaction list
				noInteractionUsers = append(noInteractionUsers, Users{
					UserID:          user_id,
					Username:        username,
					LastInteraction: lastInteraction,
				})
			}
		}
	}

	// Sort users with interactions by the last interaction timestamp (descending)
	sort.Slice(sortedUsers, func(i, j int) bool {
		return sortedUsers[i].LastInteraction > sortedUsers[j].LastInteraction
	})

	// Sort users with no interactions alphabetically
	sort.Slice(noInteractionUsers, func(i, j int) bool {
		return noInteractionUsers[i].Username < noInteractionUsers[j].Username
	})

	// Combine both lists: users with interactions first, then users without interactions
	var finalSortedUsers []SortedUsers
	for _, user := range sortedUsers {
		finalSortedUsers = append(finalSortedUsers, SortedUsers{
			ID:       user.UserID,
			Username: user.Username,
		})
	}
	for _, user := range noInteractionUsers {
		finalSortedUsers = append(finalSortedUsers, SortedUsers{
			ID:       user.UserID,
			Username: user.Username,
		})
	}
	return finalSortedUsers
}

// Get the current timestamp
func GetTimestamp() int64 {
	return time.Now().Unix()
}
