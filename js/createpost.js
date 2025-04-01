async function fetchCategories() {
    try {
        const response = await fetch('/api/create-post', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (!response.ok) {
            errorMsg = data.message;
            showError();
            showPage('error')
        }
        return data || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

async function renderCreatePostPage() {
    console.log("Rendering create post page...");

    const categories = await fetchCategories();
    console.log("Categories:", categories);
    
    document.getElementById("create-post-form").innerHTML = `
        <label for="title">Title:</label>
        <input type="text" id="title" name="title" required maxlength="50">
        <label for="content">Content:</label>
        <textarea class="content-textarea" id="content" name="content" required></textarea>
        </label>

          <label>Categories:</label>
        <div id="category-container">
            ${categories
                .filter(cat => cat.CategoryID !== 1)
                .map(cat => `
                <label class="category-tags">
                    <input type="checkbox" class="category-checkbox" value="${cat.CategoryID}">
                    ${cat.CategoryName}
                </label>
            `).join('')}
        </div>

        <div id="error-message"></div> 
        <button type="submit" class="submit-btn">Submit</button>
`;
}

document.getElementById("create-post-form").addEventListener("submit", async (event) => {
    console.log("Post form submitted!");
    event.preventDefault();


    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const errorMessage = document.getElementById("error-message");

    if (title === "" || content === "") {
        errorMessage.textContent = "Please add some content to your post!";
        errorMessage.style.display = "block";
        return;
    }
    errorMessage.style.display = "none";

    const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
    .map(checkbox => checkbox.value);

    try {
        const response = await fetch('/api/create-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                post_title: title, 
                post_content: content,
                categories: selectedCategories
            })
        })
        const data = await response.json();
        if (response.ok) {
            console.log("Post created:", data);
            history.pushState({}, '', '/');
            loadPage();
        } else {
            errorMsg = data.message;
            showError();
            showPage('error')
        }
        } catch(error)  {
            errorMsg = "Unknown Error";
            showError();
            showPage('error')
        };
}   );

