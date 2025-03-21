package backend

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

// HomePage handles the rendering of the home page
func HandleFeed(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json") // Set the response content type to JSON

	switch r.Method {
	case http.MethodGet:
		GetFeed(w, r)
	//case http.MethodPost:
	//Post method on feedPage only for filters
	//HandleHomePost(w, r)
	default:
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}
}

// GetFeed fetches posts from the database for the home page (returns JSON)
func GetFeed(w http.ResponseWriter, r *http.Request) {
	// loggedIn, userID, _ := VerifySession(r)
	// if !loggedIn {
	// 	http.Error(w, "Unauthorized", http.StatusUnauthorized)
	// 	return
	// }

	// Fetch posts from the database
	posts, err := GetPosts(0)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error fetching posts: %v", err), http.StatusInternalServerError)
		return
	}

	// Return posts as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
	}
}

// GetPosts fetches all posts from the database and returns them as a slice of PostDetails
func GetPosts(userID int) ([]PostDetails, error) {
	var posts []PostDetails

	// Query to get all posts ordered by creation date
	query := `
		SELECT Post.id
		FROM Post
		ORDER BY Post.created_at DESC;
	`
	rows, err := db.Query(query)
	if err != nil {
		log.Println("Error fetching posts:", err)
		return nil, err
	}
	defer rows.Close()

	// Loop through the rows and fetch details for each post
	for rows.Next() {
		var postID int
		if err := rows.Scan(&postID); err != nil {
			log.Println("Error scanning post ID:", err)
			return nil, err
		}

		// Get the details for each post
		post, err := GetPostDetails(postID, userID)
		if err != nil {
			log.Println("Error getting post details:", err)
			return nil, err
		}

		posts = append(posts, *post)
	}

	// Return the list of posts
	return posts, nil
}

// HandleHomePost handles the filtering of posts based on the user's selection
// func HandleHomePost(w http.ResponseWriter, r *http.Request, data *PageDetails) {
// 	var args []interface{}
// 	var userID int
// 	var rows *sql.Rows
// 	var err error
// 	var query string
// 	var categoryID int

// 	data.LoggedIn, userID, data.Username = VerifySession(r)
// 	data.SelectedFilter = r.FormValue("filter")
// 	selectedCat := r.FormValue("topic")
// 	data.SelectedCategory = selectedCat

// 	if !data.LoggedIn && data.SelectedFilter != "" {
// 		log.Println("User not logged in")
// 		return
// 	}

// 	if data.LoggedIn {
// 		if data.SelectedCategory == "" && data.SelectedFilter == "" {
// 			HandleHomeGet(w, r, data)
// 			return
// 		} else if data.SelectedCategory != "" && data.SelectedFilter == "" {
// 			categoryID, err = HandleCategory(selectedCat)
// 			if err != nil {
// 				log.Println("Error handling category", err)
// 				ErrorHandler(w, "Bad request", http.StatusBadRequest)
// 			}
// 			query = database.FilterCategories()
// 			args = append(args, categoryID)
// 		} else {
// 			args = append(args, userID)
// 			switch data.SelectedFilter {
// 			case "createdByMe":
// 				query = "SELECT Post.id FROM Post WHERE Post.user_id = ?"
// 			case "likedByMe":
// 				query = database.MyLikes()
// 			case "dislikedByMe":
// 				query = database.MyDislikes()
// 			}

// 		}
// 	} else {
// 		if data.SelectedCategory == "" {
// 			HandleHomeGet(w, r, data)
// 			return
// 		} else {
// 			categoryID, err = HandleCategory(selectedCat)
// 			if err != nil {
// 				log.Println("Error handling category", err)
// 				ErrorHandler(w, "Bad request", http.StatusBadRequest)
// 			}
// 			query = database.FilterCategories()
// 			args = append(args, categoryID)
// 		}
// 	}
// 	query += " ORDER BY Post.created_at DESC;"
// 	// Fetch posts from the database for a specific user
// 	rows, err = db.Query(query, args...)
// 	if err != nil {
// 		log.Println("Error fetching posts by filter:", err)
// 		ErrorHandler(w, "Internal Server Error", http.StatusInternalServerError)
// 		return
// 	}

// 	for rows.Next() {
// 		var id int
// 		rows.Scan(&id)
// 		post, err := GetPostDetails(id, userID)

// 		if err != nil {
// 			ErrorHandler(w, "Internal Server Error", http.StatusInternalServerError)
// 		}
// 		data.Posts = append(data.Posts, *post)

// 	}

// 	RenderTemplate(w, "index", data)
// }

// // HandleCategory converts the category ID into a string and returns validated ID
// func HandleCategory(category string) (int, error) {

// 	categoryID, err := strconv.Atoi(category)
// 	if err != nil {
// 		log.Println("Error converting categoryID", err)
// 		return 0, err
// 	}

// 	valid := ValidateCategoryID(categoryID)
// 	if !valid {
// 		log.Println("Invalid categoryID", category)
// 		return 0, fmt.Errorf("invalid category id: %s", category)
// 	}

// 	return categoryID, nil

// }

// // ValidateCategoryID checks if the category ID given exists in the databse
// func ValidateCategoryID(categoryID int) bool {
// 	var category int
// 	err := db.QueryRow("SELECT id FROM Category WHERE id = ?", categoryID).Scan(&category)
// 	if err != nil {
// 		log.Println("Error scanning category ID:", err)
// 		return false
// 	}
// 	return true
// }
