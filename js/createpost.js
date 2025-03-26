function renderCreatePostPage() {
// getting the elements
const createPostForm = document.getElementById("create-post");
const submitPostBtn = document.getElementById("submit-post-btn");

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

// send the post when the "Submit" button is clicked
submitPostBtn.addEventListener("click", (event) => {
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
        renderFeedPage();
    })
    .catch(error => {
        console.error("Error creating post:", error);
    });
});
}
