document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded fired")
    init();
});

let currentPage = 'feed';

function init() {
    // Load the home page by default (e.g., feed page)
    console.log("initializing the page")
    loadPage(currentPage);

    // Handle navigation events (e.g., clicking on links or buttons)
    document.addEventListener("click", async (event) => {
        const postLink = event.target.closest(".post-title a");

        // Only proceed if the anchor inside a post-title is clicked
        if (!postLink) return;

        // Get the post ID from the dataset and load the page
        const postID = postLink.dataset.postId;

        loadPage('post-details', postID);
        event.preventDefault();

    });
    // document.getElementById('loginLink').addEventListener('click', () => loadPage('login'));
    // document.getElementById('registerLink').addEventListener('click', () => loadPage('register'));
    // document.getElementById('feedLink').addEventListener('click', () => loadPage('feed'));
    // document.getElementById('createPostLink').addEventListener('click', () => loadPage('createPost'));
    // document.getElementById('chatLink').addEventListener('click', () => loadPage('chat'));
}

// toggle which page is shown
function loadPage(page, postID = null) {
    hideAllPages(); // Hide all pages
    switch (page) {
        case 'feed':
            loadFeedPage();
            break;
        case 'post-details':
            if (postID !== null) {
                loadPostPage(postID);
            }
            break;
        default:
            loadFeedPage();
    }
    showPage(page)
    currentPage = page;
}

function showPage(pageId) {
    // Show the page and hide others
    document.getElementById(pageId).style.display = 'block';
}

function hideAllPages() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
}
