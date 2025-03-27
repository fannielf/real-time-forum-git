// Create WebSocket connection
let socket = null;

// initialize websocket when logged or authorized 
function initializeSocket() {
    socket = new WebSocket('ws://localhost:8080/ws');

    // Listen for messages from the WebSocket
    socket.addEventListener('message', function(event) {
        const message = JSON.parse(event.data);

        if (message.type === "update_users") {
            const activeUsers = message.users;
        
            updateSidebar(activeUsers);
        
        }
    });
}

// Function to update the sidebar with the list of active users
function updateSidebar(users) {
    const chatUsersDiv = document.getElementById('chat-users');
    chatUsersDiv.innerHTML = '';

    // Handle case where no users are present
    if (!users || users.length === 0) {
        const noUsersMessage = document.createElement('div');
        noUsersMessage.textContent = "No active users";
        chatUsersDiv.appendChild(noUsersMessage);
    } else {
        // Loop through the active users and add them to the sidebar
        users.forEach(function(user) {
            const userElement = document.createElement('div');
            userElement.classList.add('chat-user');
            userElement.textContent = user;

            // Make the username clickable to start a private chat
            userElement.addEventListener('click', function() {
                openPrivateChat(user);
            });

            chatUsersDiv.appendChild(userElement);
        });
    }
}

// Function to open a private chat with the selected user (implement this based on your app's logic)
function openPrivateChat(username) {
    console.log("Starting private chat with", username);
    // Add logic to open private chat with the selected user
}
