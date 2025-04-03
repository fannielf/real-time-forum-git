async function renderPostPage() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean); // Remove empty segments

    let postID;

    if (segments[0] === 'post' && segments[1]) {
        postID = segments[1];
        // console.log("Post ID:", postID);
    }
try {
    const response = await fetch(`/api/post/${postID}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unknown error");
    }
        renderPost(data);
        
    } catch (error) {
        console.error("Error fetching post:", error);
        showError(error.message);
    };
}

function renderPost(post) {
    console.log(post)
    const postContainer = document.getElementById('post-details');

    // const postElement = document.getElementById('post-content');
    postContainer.innerHTML = '';

    // Render the post content
    postContainer.innerHTML = `
        <div class="post-header-like-dislike">
            <h2 class="post-title">${post.post_title}</h2>
            <div class="reaction-buttons">
                <button id="like-button-${post.post_id}" class="like-button" 
                style="color: ${post.liked_now ? '#54956d' : 'inherit'}">
                <span class="material-symbols-outlined">thumb_up</span>
            </button>
            <span id="like-count-${post.post_id}" class="reaction-count">${post.likes}</span>
            
            <button id="dislike-button-${post.post_id}" class="dislike-button"
                style="color: ${post.disliked_now ? 'rgb(197, 54, 64)' : 'inherit'}">
                <span class="material-symbols-outlined">thumb_down</span>
            </button>
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
        ${post.comments && post.comments.length > 0 ? post.comments.map(comment => `
            <div class="comment" id="comment-${comment.comment_id}">
                <p><strong>${comment.username}</strong>: ${comment.created_at}</p>
                <pre>${comment.comment_content}</pre>
            </div>
        `).join('') : '<p>No comments yet.</p>'}
        </div>
    `;

    //add event listener to the comment form
     document.getElementById('comment-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        await handleComment();
    });

      // Add event listeners for like and dislike buttons
    document.getElementById(`like-button-${post.post_id}`).addEventListener('click', async function(event) {
        event.preventDefault();
        await handleVote(post.post_id, 'like', 0); //0 means this like is not for a comment
    });

    document.getElementById(`dislike-button-${post.post_id}`).addEventListener('click', async function(event) {
        event.preventDefault();
        await handleVote(post.post_id, 'dislike', 0);
    });
}

async function handleComment() {
    const commentTextarea = document.getElementById('comment');
    const commentContent = commentTextarea.value.trim();
    const postID = document.getElementById('comment-form').dataset.postId;

    if (!commentContent) {
        // alert("Comment cannot be empty!");
        return;
    }

    try {    
        const response = await fetch(`/api/post/${postID}/comment`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment_content: commentContent })
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add comment");
        } else {
            loadPage();
        }

    } catch (error) {
        showError(error.message);
    };
}

async function handleVote(postID, voteType, commentID = 0) { 
    const voteData = {
        vote: voteType,
        post_id: postID,
        comment_id: commentID 
    };

    console.log("Vote data:", voteData);
try {
   const response = await fetch(`/api/post/${postID}/vote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData)
    })
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to add vote");
    } else {
        loadPage();
    }

    } catch(error) {
        showError(error.message);

    };
}
