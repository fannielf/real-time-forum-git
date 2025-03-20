document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded fired")
    init();
});

function init() {
    // Load the home page by default (e.g., feed page)
    console.log("initializing the page")
    loadPage('feed');

    // Handle navigation events (e.g., clicking on links or buttons)
    // document.getElementById('loginLink').addEventListener('click', () => loadPage('login'));
    // document.getElementById('registerLink').addEventListener('click', () => loadPage('register'));
    // document.getElementById('feedLink').addEventListener('click', () => loadPage('feed'));
    // document.getElementById('createPostLink').addEventListener('click', () => loadPage('createPost'));
    // document.getElementById('chatLink').addEventListener('click', () => loadPage('chat'));
}

// toggle which page is shown
function loadPage(page) {
    hideAllPages(); // Hide all pages
    switch (page) {
        case 'feed':
            loadFeedPage();
        default:
            loadFeedPage();
    }
    showPage(page)
}

function showPage(pageId) {
    // Show the page and hide others
    document.getElementById(pageId).style.display = 'block';
}

function hideAllPages() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
}
