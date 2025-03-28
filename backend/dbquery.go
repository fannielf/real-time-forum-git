package backend

import (
	"database/sql"
	"log"
	"real-time-forum/database"
	"strings"
)

// GetCategories retrieves all categories from the database
func GetCategories() ([]CategoryDetails, error) {
	rows, err := db.Query("SELECT id, name FROM Category")
	if err != nil {
		log.Println("Error retrieving categories:", err)
		return nil, err
	}
	defer rows.Close()

	var categories []CategoryDetails
	for rows.Next() {
		var category CategoryDetails
		if err := rows.Scan(&category.CategoryID, &category.CategoryName); err != nil {
			log.Println("Error scanning category:", err)
			return nil, err
		}
		categories = append(categories, category)
	}
	return categories, nil
}

// GetPostDetails fetches the details of a specific post from the database
func GetPostDetails(postID, userID int) (*PostDetails, error) {

	row := db.QueryRow(database.PostContent(), postID)
	var err error
	// Scan the data into a PostDetails struct
	post := PostDetails{}
	var categories string
	err = row.Scan(
		&post.PostID,
		&post.UserID,
		&post.Username,
		&post.PostTitle,
		&post.PostContent,
		&post.CreatedAt,
		&post.Likes,
		&post.Dislikes,
		&categories,
	)

	if err != nil {
		log.Println("Error scanning rows")
		return nil, err
	}

	if categories != "" {
		post.Categories = strings.Split(categories, ",")
	}

	post.Comments, err = GetComments(postID, userID)
	if err != nil {
		log.Println("Error getting comments")
		return nil, err
	}

	post.LikedNow, post.DislikedNow, err = GetLikes(userID, postID, 0)
	if err != nil {
		log.Println("Error getting votes")
		return nil, err
	}

	return &post, nil
}

// GetComments fetches all comments for a specific post from the database
func GetComments(postID, userID int) ([]CommentDetails, error) {

	rows, err := db.Query(database.CommentContent(), postID)
	if err != nil {
		log.Println("Error fetching comments from database")
		return nil, err
	}
	defer rows.Close()

	var comments []CommentDetails
	for rows.Next() {
		var comment CommentDetails
		err := rows.Scan(
			&comment.CommentID,
			&comment.PostID,
			&comment.Content,
			&comment.UserID,
			&comment.CreatedAt,
			&comment.Username,
			&comment.Likes,
			&comment.Dislikes,
		)
		if err != nil {
			log.Println("Error scanning rows")
			return nil, err
		}

		comment.LikedNow, comment.DislikedNow, err = GetLikes(userID, 0, comment.CommentID)
		if err != nil {
			log.Println("Error getting votes")
			return nil, err
		}
		comments = append(comments, comment)
	}

	return comments, nil
}

// GetLikes fetches the votes for a specific post or comment from the database
func GetLikes(userID, postID, commentID int) (bool, bool, error) {
	if userID != 0 {
		var rows *sql.Rows
		var err error
		if postID == 0 {
			rows, err = db.Query(database.Likes(), userID, nil, commentID)
		} else {
			rows, err = db.Query(database.Likes(), userID, postID, nil)
		}
		if err != nil {
			log.Println("Error fetching votes from database")
			return false, false, err
		}
		defer rows.Close()

		var voteType int
		for rows.Next() {
			err := rows.Scan(&voteType)
			if err != nil {
				log.Println("Error scanning rows")
				return false, false, err
			}
		}
		if voteType == 1 {
			return true, false, nil
		} else if voteType == 2 {
			return false, true, nil
		}
	}

	return false, false, nil
}

func GetActiveUsers() (map[int]string, error) {
	var activeSessions []int
	var activeUsers = make(map[int]string)

	log.Println("Getting active users")
	rows, err := db.Query("SELECT user_id FROM Session WHERE status = 'active'")
	if err != nil {
		if err == sql.ErrNoRows {
			// No active users, return an empty slice
			return activeUsers, nil
		}
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var userID int
		if err := rows.Scan(&userID); err != nil {
			return nil, err
		}
		activeSessions = append(activeSessions, userID)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	for _, user := range activeSessions {
		username, err := GetUsername(user)
		if err != nil {
			return nil, err
		}
		if username != "" {
			activeUsers[user] = username
		}
	}
	return activeUsers, nil
}

func GetUsername(userID int) (string, error) {

	var username string
	err := db.QueryRow("SELECT username FROM User WHERE id = ?", userID).Scan(&username)
	if err != nil {
		return "", err
	}
	return username, nil
}
