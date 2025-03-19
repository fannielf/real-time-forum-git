
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    // Load the home page by default (e.g., feed page)
    showPage('feed');

    // Handle navigation events (e.g., clicking on links or buttons)
    document.getElementById('loginLink').addEventListener('click', () => loadPage('login'));
    document.getElementById('registerLink').addEventListener('click', () => loadPage('register'));
    document.getElementById('feedLink').addEventListener('click', () => loadPage('feed'));
    document.getElementById('createPostLink').addEventListener('click', () => loadPage('createPost'));
    document.getElementById('chatLink').addEventListener('click', () => loadPage('chat'));
}

// toggle which page is shown
function loadPage(page) {
    hideAllPages(); // Hide all pages
    switch (page) {
        case 'login':
            showLoginPage();
            break;
        case 'register':
            showRegisterPage();
            break;
        case 'feed':
            showFeedPage();
            break;
        case 'createPost':
            showCreatePostPage();
            break;
        case 'chat':
            showChatPage();
            break;
        default:
            showFeedPage();
    }
}

function showPage(pageId) {
    // Show the page and hide others
    document.getElementById(pageId).style.display = 'block';
}

function hideAllPages() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
}
