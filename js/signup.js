function renderSignupPage() {
    const signupPage = document.getElementById('signup-page');
    
    signupPage.innerHTML = `
        <h2>Sign Up</h2>
        <div class="signup-link">Already have an account? 
            <a href="/login">Log in here</a>
        </div>
        <form id="signup-form">
            <label for="username">Username
                <div class="hover-icon">
                    <span class="material-symbols-outlined" style="font-size: 20px; vertical-align: middle;">info</span>
                    <span class="tooltip">Username must be 3-20 characters, letters, numbers, or _</span>
                </div>
            </label>
            <input type="text" id="username" name="username" placeholder="Enter your username" required>
            <label for="age">Age</label>
            <input type="number" id="age" name="age" placeholder="Enter your age" required>
            <label for="signup-gender">Gender</label>
            <select id="signup-gender" name="gender">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Prefer not to say</option>
            </select> 
            <label for="first-name">First Name</label>
            <input type="text" id="first-name" name="first-name" placeholder="Enter your first name" required>
            <label for="last-name">Last Name</label>
            <input type="text" id="last-name" name="last-name" placeholder="Enter your last name" required>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required>
            <label for="confirm-password">Re-enter Password</label>
            <input type="password" id="confirm-password" name="confirm-password" placeholder="Re-enter your password" required>
            <button type="submit">Sign Up</button>
        </form>
    `;
}

function setupSignupForm() {
    const signupForm = document.getElementById("signup-form");

    signupForm.addEventListener("submit", function(event) {
        event.preventDefault();  

        const formData = {
            username: document.getElementById("username").value,
            age: document.getElementById("age").value,
            gender: document.getElementById("signup-gender").value,
            firstName: document.getElementById("first-name").value,
            lastName: document.getElementById("last-name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            confirmPassword: document.getElementById("confirm-password").value,
        };

        // check if passwords match
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // sending the form data to the server
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Signup successful!");
                window.location.href = "/login"; // if signup is successful, redirect to login page
            } else {
                alert("Signup failed: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Something went wrong.");
        });
    });
}

// First we render the signup page
renderSignupPage();

// then we set up the form
setupSignupForm();
