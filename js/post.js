function loadPostPage(postID) {
    history.pushState({}, "", `/post/${postID}`);

    fetch(`/api/post/${postID}`, {
        method: "GET",
        //credentials: "same-origin"  // Uncomment if authentication is needed
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || "Unknown error"); });
        }
        return response.json();  // Parse the JSON response
    })
    .then(post => {
        console.log(post);  // Check the structure of the post object, including Categories
        renderPost(post);  // Pass post data to render function
    })
    .catch(error => {
        console.error("Error fetching post:", error);
        errorMsg = error.message;
        loadPage("error");
    });
}

function renderPost(post) {
    const postContentContainer = document.querySelector("#post-content");
    console.log("Categories:", post.categories);  // Log categories to check if it's an array


    // Render the post content
    postContentContainer.innerHTML = `
        <div class="post-header-like-dislike">
            <h2 class="post-title">${post.post_title}</h2>
            <div class="reaction-buttons">
                <button class="like-button" style="color: ${post.liked_now ? '#54956d' : 'inherit'};">
                    👍 <span>${post.likes}</span>
                </button>
                <button class="dislike-button" style="color: ${post.disliked_now ? 'rgb(197, 54, 64)' : 'inherit'};">
                    👎 <span>${post.dislikes}</span>
                </button>
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
            <pre>${post.post_content}</pre>
        </div>
        <h3 class="comment-header">Comments:</h3>
        ${post.comments && post.comments.length ? post.comments.map(comment => `
            <div class="comment">
                <p><strong>${comment.username}</strong>: ${comment.created_at}</p>
                <pre>${comment.comment_content}</pre>
            </div>
        `).join('') : '<p>No comments yet.</p>'}
    `;
}
