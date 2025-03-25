document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded fired")
    init();
});

let errorMsg = '';

function init() {

    authenticateSession();
    loadPage();

      // Handle logout
      document.getElementById('logout-button').addEventListener('click', () => {
        window.location.href = '/logout'; 
        loadPage();
    });

    // Handle navigation events (e.g., clicking on links or buttons)
    document.addEventListener("click", async (event) => {
        const postLink = event.target.closest(".post-title a");
        if (!postLink) return;

        // Get the post ID from the dataset and load the page
        const postID = postLink.dataset.postId;

        history.pushState({}, "", `/post/${postID}`);
        loadPage();
        event.preventDefault();

    });

    // Handle back/forward navigation
    window.addEventListener('popstate', () => {
        loadPage(); // Re-run init to reload correct page based on new URL
    });
}

// toggle which page is shown
function loadPage() {
    hideAllPages();

    const path = window.location.pathname; // Get the URL
    const segments = path.split('/').filter(Boolean); // Remove empty segments
    let page;
    console.log(segments)

    if (segments.length === 0) {
        page = 'feed'
        renderFeedPage();
    } else  if (segments[0] === 'post') {
        page = 'post-details'
        renderPostPage();
    } else if (segments[0] === 'login') {
        page = 'login-page'
        console.log("Login page detected!");
        renderLoginPage();
    } else if (segments[0] === 'signup') {
        page = 'signup-page'
        console.log("Signup page detected!");
        renderSignupPage();
    } else {
        page = 'error'
        errorMsg = "Page Not Found"
        renderSignupPage();
    }

    showPage(page)

}

// Function to authenticate session
async function authenticateSession() {
    try {
        const response = await fetch('/api/auth', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Include cookies for authentication
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('User is authenticated:', data);
            return;
            // Update your UI based on the authentication status, like showing/hiding buttons
        } else {
            console.log('User not authenticated');
            // Redirect to login page or show login button
        }
    } catch (error) {
        console.error('Error authenticating session:', error);
        // Handle any error with the API request
    }
    history.pushState({}, '', '/login');
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
        window.location.href = '/'; 
    });
}
