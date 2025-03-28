package backend

import (
	"database/sql"
	"log"
	"time"
)

// AddPostToDatabase inserts a new post into the database
func AddPostToDatabase(title, content string, categories []int, userID int) error {

	var result sql.Result
	var err error
	result, err = db.Exec("INSERT INTO Post (title, content, user_id, created_at) VALUES (?, ?, ?, ?)",
		title, content, userID, time.Now().Format("2006-01-02 15:04:05"))
	if err != nil {
		log.Println("Error inserting post:", err)
		return err
	}

	// Get the post id for the post inserted
	postID, err := result.LastInsertId()
	if err != nil {
		log.Println("Error getting post ID:", err)
		return err
	}

	// Add all categories into Post_category table
	for _, categoryID := range categories {
		_, err = db.Exec("INSERT INTO Post_category (category_id, post_id) VALUES (?, ?)",
			categoryID, postID)
		if err != nil {
			log.Println("Error inserting post category:", err)
			return err
		}
	}

	return nil
}

func AddMessageToDB(userID int, content string, chatID int) (int, error) {

	var result sql.Result
	var err error
	result, err = db.Exec("INSERT INTO Message (chat_id, sender_id, content, created_at) VALUES (?, ?, ?, ?)",
		chatID, userID, content, time.Now().Format("2006-01-02 15:04:05"))
	if err != nil {
		log.Println("Error inserting post:", err)
		return 0, err
	}

	// Get the post id for the post inserted
	msgID, err := result.LastInsertId()
	if err != nil {
		log.Println("Error getting post ID:", err)
		return 0, err
	}

	return int(msgID), nil
}
