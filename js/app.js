document.addEventListener('DOMContentLoaded', function() {
    init();
});

// Handle logout
document.getElementById('logout-button').addEventListener('click', async () => {
    await LogoutUser();

    const loggedInUserElement = document.getElementById('logged-in-user');
    if (loggedInUserElement) {
        loggedInUserElement.textContent = ''; // remove the username
    }

    init();
});

document.getElementById('home-button').addEventListener('click', function (){
    history.pushState({}, '', '/');
    init();
})

// Handle back/forward navigation
window.addEventListener('popstate', () => {
    loadPage();
});

let userID = null;
let authenticated;

async function init() {
    authenticated = await isAuthenticated();

    if (!authenticated) {
        
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('chat-sidebar').style.display = 'none';
        if (!window.location.pathname !== '/signup') {
        history.pushState({}, '', '/login');
        }
        userID = null;
        if (socket !== null) socket.close(); socket = null;

    } else {
        //recover username from local storage
        const username = localStorage.getItem('username');
        if (username) {
            const loggedInUserElement = document.getElementById('logged-in-user');
            if (loggedInUserElement) {
                loggedInUserElement.textContent = `Logged in as: ${username}`;
            }
        }
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
        apiGET('/api/feed', page)
    } else  if (segments[0] === 'post' && segments.length == 2 && segments[1]) {
        page = 'post-details'
        apiGET(`/api/post/${segments[1]}`, page)
    } else if (segments[0] === 'login' && !authenticated) {
        page = 'login-page'
        renderLoginPage();
    } else if (segments[0] === 'signup' && !authenticated) {
        page = 'signup-page'
        renderSignupPage();
    } else if (segments[0] === 'create-post') {
        page = 'create-post'
        renderCreatePostPage();
    } else {
        apiGET('/api/error', 'error')
        return
    }

    showPage(page)

}

async function apiGET(adress, page) {
    try {
    const response = await fetch(adress, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unknown error");
    }
        if (page === 'feed') {
        renderPosts(data);  // Pass posts to the render function
        } else if (page === 'post-details') {
            renderPost(data);
        } else if (page === 'create-post') {
            return data || [];
        }

    } catch(error) {
        showError(error.message);
    };
}

async function apiPOST(adress, page, postData) {
    try {
    const response = await fetch(adress, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unknown error");
    }
        if (page === 'create-post') {
            history.pushState({}, '', '/');
        } else if (page === 'login') {
            if (socket === null) initializeSocket();
            history.pushState({}, '', '/');
            document.getElementById('logout-button').style.display = 'block';
            document.getElementById('chat-sidebar').style.display = 'block';

            if (data.username) {
                console.log(data.username)
                localStorage.setItem('username', data.username);
                const loggedInUserElement = document.getElementById('logged-in-user');
                if (loggedInUserElement) {
                    loggedInUserElement.textContent = `Logged in as: ${data.username}`;
                }
            }

        } else if (page === 'signup') {
            history.pushState({}, '', '/login');
        }
        init();

    } catch(error) {
        showError(error.message);
    };
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

            if (socket === null) initializeSocket()
            return true;
        } else {
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
