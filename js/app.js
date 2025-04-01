document.addEventListener('DOMContentLoaded', function() {
    init();
});

// Handle logout
document.getElementById('logout-button').addEventListener('click', async () => {
    await LogoutUser();
    loadPage();
});

// Handle back/forward navigation
window.addEventListener('popstate', () => {
    loadPage();
});

let errorMsg = '';

async function init() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('chat-sidebar').style.display = 'none';
        history.pushState({}, '', '/login');
        if (socket !== null) socket.close(); socket = null;
    };
    loadPage();

}

// toggle which page is shown
function loadPage() {

    const path = window.location.pathname; // Get the URL
    const segments = path.split('/').filter(Boolean); // Remove empty segments
    let page;

    if (segments.length === 0) {
        page = 'feed'
        renderFeedPage();
    } else  if (segments[0] === 'post') {
        page = 'post-details'
        renderPostPage();
    } else if (segments[0] === 'login') {
        page = 'login-page'
        renderLoginPage();
    } else if (segments[0] === 'signup') {
        page = 'signup-page'
        renderSignupPage();
    } else if (segments[0] === 'create-post') {
        page = 'create-post'
        renderCreatePostPage();
    } else {
        page = 'error-message'
        errorMsg = "Page Not Found"
        showError();
    }

    showPage(page)

}

// Function to authenticate session
async function isAuthenticated() {
    try {
        const response = await fetch('/api/auth', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Include cookies for authentication
        });
        
        // Check if the response is okay
        if (response.ok) {
            const data = await response.json();
            userID = parseInt(data.message, 10);
            console.log('User is authenticated:');
            if (socket === null) initializeSocket()
            return true;
        } else {
            console.log('Unauthorized');
            return false;
        }
    } catch (error) {
        console.error('Error authenticating session:', error);
        return false
    }
}

function showPage(pageId) {
    if (pageId === null) return;
    hideAllPages();
    // Show the page and hide others
    document.getElementById(pageId).style.display = 'block';
}

function hideAllPages() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
}

function showError() {
    const errorText = document.getElementById("error-text");
    const backButton = document.getElementById("error-back-btn");

    errorText.textContent = errorMsg;

    backButton.addEventListener("click", () => {
        history.pushState({}, '', '/');
        loadPage();
    });
}
