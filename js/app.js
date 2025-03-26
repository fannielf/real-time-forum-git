document.addEventListener('DOMContentLoaded', function() {
    init();
});

// Handle logout
document.getElementById('logout-button').addEventListener('click', async () => {
    await LogoutUser();
    init();
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
    };
    loadPage();

}

// toggle which page is shown
function loadPage() {
    hideAllPages();

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
            console.log('User is authenticated:');
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
    // Show the page and hide others
    document.getElementById(pageId).style.display = 'block';
}

function hideAllPages() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
}

function showError() {
    const errorContainer = document.querySelector("#error-message");
    const errorText = document.querySelector("#error-text");
    const backButton = document.querySelector("#error-back-btn");

    if (!errorContainer || !errorText || !backButton) return;

    errorText.textContent = errorMsg;

    backButton.addEventListener("click", () => {
        history.pushState({}, '', '/');
        loadPage();
    });
}
