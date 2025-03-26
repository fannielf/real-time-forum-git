package backend

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"
)

func FetchCategories(w http.ResponseWriter, r *http.Request) {
	var data []CategoryDetails
	var err error
	data, err = GetCategories()
	if err != nil {
		log.Println("Error fething categories: ", err)
		ResponseHandler(w, http.StatusInternalServerError, "Internal Server Error")
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

// // CreatePost receives details for created post and inserts them into the database
func CreatePost(w http.ResponseWriter, r *http.Request) {

	if r.Method == http.MethodGet {
		FetchCategories(w, r)
		return
	} else if r.Method == http.MethodPost {
		NewPost(w, r)
		return
	} else {
		ResponseHandler(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

}

func NewPost(w http.ResponseWriter, r *http.Request) {

	_, userID := VerifySession(w, r)

	var newPost PostDetails
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newPost)
	if err != nil {
		log.Println("error decoding the data")
		ResponseHandler(w, http.StatusBadRequest, "Bad Request")
		return
	}

	if newPost.PostTitle == "" || newPost.PostContent == "" {
		ResponseHandler(w, http.StatusBadRequest, "Title or content cannot be empty")
		return
	}

	categories := newPost.Categories

	if len(categories) == 0 {
		categories = append(categories, "1") // If no category chosen, give category id 1 (=general)
	}

	var categoryIDs []int
	// Converting categoryIDs to integers and validating that they exists in the database
	for _, cat := range categories {
		categoryID, err := HandleCategory(cat)
		if err != nil {
			log.Println("Error handling categoryID in createpost", err)
			ResponseHandler(w, http.StatusBadRequest, "Bad Request")
		}

		categoryIDs = append(categoryIDs, categoryID)
	}

	err = AddPostToDatabase(newPost.PostTitle, newPost.PostContent, categoryIDs, userID)
	if err != nil {
		ResponseHandler(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	ResponseHandler(w, http.StatusOK, "Message added to database")

}

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
