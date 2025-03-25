function renderLoginPage() {
    // Render Login form dynamically
    const loginPage = document.getElementById('login-page');

    loginPage.innerHTML += `
        <form id="login-form">
            <label for="username">Username</label>
            <input type="text" id="username-login" name="username" placeholder="Enter your username" required>
            <label for="password">Password</label>
            <input type="password" id="password-login" name="password" placeholder="Enter your password" required>
            <button type="submit">Login</button>
        </form>
    `;

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

        if (response.ok) {
            const data = await response.json();
            alert(data.message); // Show success message
            // Redirect to feed or home page
            window.location.href = '/feed'; 
        } else {
            const errorData = await response.json();
            alert(errorData.message); // Show error message
        }
    } catch (error) {
        alert('An error occurred while logging in');
    } finally {
        // restore the login button
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }
});

    // Handle the link to sign-up page
    document.querySelector('.signup-link a').addEventListener('click', (event) => {
        event.preventDefault();
        history.pushState({}, '', '/signup');
        loadPage(); // assuming this function loads the signup page
    });
}
