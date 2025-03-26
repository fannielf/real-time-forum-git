// renderng login page dynamically
function renderLoginPage() {
    const loginPage = document.getElementById('login-form');
    loginPage.innerHTML = '';

    loginPage.innerHTML = `
            <label for="username-login">Username</label>
            <input type="text" id="username-login" name="username" placeholder="Enter your username" required>
            <label for="password-login">Password</label>
            <input type="password" id="password-login" name="password" placeholder="Enter your password" required>
            <button type="submit">Login</button>
    `;
}

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();


    const username = document.getElementById('username-login').value;
    const password = document.getElementById('password-login').value;

    const loginData = {
        username: username,
        password: password
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.authToken); 
            history.pushState({}, '', '/');
            document.getElementById('logout-button').style.display = 'block';
            document.getElementById('chat-sidebar').style.display = 'block';
            loadPage();
        } else {
            errorMsg = data.message;
            showError();
            showPage('error')
            
        }
    } catch (error) {
        errorMsg = "Unknown Error";
        showError();
        showPage('error')
    }
});

// Handle the link to sign-up page
document.getElementById('signup-link').addEventListener('click', (event) => {
    event.preventDefault();
    history.pushState({}, '', '/signup');
    loadPage();
});