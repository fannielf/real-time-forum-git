// getting the elements
const createPostBtn = document.getElementById("create-post-btn");
const createPostForm = document.getElementById("create-post");
const forumFeed = document.getElementById("feed");
const cancelPostBtn = document.getElementById("cancel-post-btn");
const submitPostBtn = document.getElementById("submit-post-btn");
const postContent = document.getElementById("post-content");

const formHTML = `
    <h2>Create a new post</h2>
    <form action="/create-post" method="POST">
        <label for="title">Title:</label>
        <input type="text" id="title" name="title" required maxlength="50">
        <label for="content">Content:</label>
        <textarea class="content-textarea" id="content" name="content" required></textarea>
        </label>
        <button type="submit">Submit Post</button>
    </form>
`;

createPostForm.innerHTML = formHTML;

// open the form when the "Create Post" button is clicked
createPostBtn.addEventListener("click", () => {
    forumFeed.style.display = "none";  // hide the feed
    createPostForm.style.display = "block";  // display the create post form
});

// send the post when the "Submit" button is clicked
submitPostBtn.addEventListener("click", () => {
    event.preventDefault();
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (title === "" || content === "") {
        alert("Please write something in your post!");
        return;
    }

    fetch('/api/create-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Post created:", data);
        createPostForm.style.display = "none";
        forumFeed.style.display = "block";
    })
    .catch(error => {
        console.error("Error creating post:", error);
    });
});
