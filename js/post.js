function renderPostPage() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean); // Remove empty segments
    console.log("Segments:", segments);
    console.log("Path:", path);
    let postID;

    if (segments[0] === 'post' && segments[1]) {
        postID = segments[1];
        console.log("Post ID:", postID);
    }

    fetch(`/api/post/${postID}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || "Unknown error"); });
        }
        return response.json();  // Parse the JSON response
    })
    .then(post => {
        console.log("Post data:", post);
        renderPost(post);

        //add event listener to the comment form
        const commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const commentTextarea = document.getElementById('comment');
                const commentContent = commentTextarea.value.trim();
                const postID = this.dataset.postId;

                if (!commentContent) {
                    alert("Comment cannot be empty!");
                    return;
                }

                
                fetch(`/api/post/${postID}/comment`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ comment_content: commentContent })
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => { throw new Error(err.error || "Failed to add comment"); });
                    }
                    return response.json();
                })
                .then(newComment => {
                    const commentsContainer = document.querySelector('.comment-header').nextElementSibling;
                    commentsContainer.innerHTML += `
                        <div class="comment" id="comment-${newComment.comment_id}">
                            <p><strong>${newComment.username}</strong>: ${newComment.created_at}</p>
                            <pre>${newComment.comment_content}</pre>
                        </div>
                    `;
                    commentTextarea.value = '';
                })
                .catch(error => {
                    console.error("Error adding comment:", error);
                    alert("Failed to add comment. Please try again.");
                });
            });
        }
    })
    .catch(error => {
        console.error("Error fetching post:", error);
        errorMsg = error.message;
        loadPage("error");
    });
}

function renderPost(post) {
    const postContainer = document.getElementById('post-details');

    // const postElement = document.getElementById('post-content');
    postContainer.innerHTML = '';

    // Render the post content
    postContainer.innerHTML = `
        <div class="post-header-like-dislike">
            <h2 class="post-title">${post.post_title}</h2>
            <div class="reaction-buttons">
                <span id="like-button-${post.post_id}" class="material-symbols-outlined">thumb_up</span>
                <span id="like-count-${post.post_id}" class="reaction-count">${post.likes}</span>
                <span id="dislike-button-${post.post_id}" class="material-symbols-outlined">thumb_down</span>
                <span id="dislike-count-${post.post_id}" class="reaction-count">${post.dislikes}</span>
            </div>
        </div>
        <div class="category-container">
            ${post.categories.map(cat => `<p class="category-tags">${cat}</p>`).join('')}
        </div>
        <div class="post-info">
            <span class="username">${post.username}</span>
            <p>${post.created_at}</p>
        </div>
        <div class="post-card">
            <p class="post-content">${post.post_content}</p>
        </div>

        
        <h3 class="comment-header">Comments:</h3>
         <form id="comment-form" data-post-id="${post.post_id}">
                <textarea class="comment-textarea" id="comment" name="comment" placeholder="Enter comment here" required></textarea>
                <button type="submit">Submit Comment</button>
        </form>
        ${post.comments && post.comments.length ? post.comments.map(comment => `
            <div class="comment" id="comment-${comment.comment_id}">
                <p><strong>${comment.username}</strong>: ${comment.created_at}</p>
                <pre>${comment.comment_content}</pre>
            </div>
        `).join('') : '<p>No comments yet.</p>'}
        </div>
    `;

      // Add event listeners for like and dislike buttons
    document.getElementById(`like-button-${post.post_id}`).addEventListener('click', function() {
        handleVote(post.post_id, 'like', 0); //0 means this like is not for a comment
    });

    document.getElementById(`dislike-button-${post.post_id}`).addEventListener('click', function() {
        handleVote(post.post_id, 'dislike', 0);
    });
}

function handleVote(postID, voteType, commentID = 0) { 
    const voteData = {
        vote: voteType,
        post_id: postID,
        comment_id: commentID 
    };

    console.log("Vote data:", voteData);
    fetch(`/api/post/${postID}/vote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || "Vote failed"); });
        }
        return response.json();
    })
    .then(updatedPost => {
        
        document.getElementById(`like-count-${updatedPost.post_id}`).innerText = updatedPost.likes;
        document.getElementById(`dislike-count-${updatedPost.post_id}`).innerText = updatedPost.dislikes;
    })
    .catch(error => {
        console.error("Error processing vote:", error);
    });
}
