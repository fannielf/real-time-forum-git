// Create WebSocket connection
let socket = null;
let currentChatUser = null;

// initialize websocket when logged or authorized 
function initializeSocket() {
    socket = new WebSocket('ws://localhost:8080/ws');

    // Listen for messages from the WebSocket
    socket.addEventListener('message', function(event) {
        console.log("message received")
        const message = JSON.parse(event.data);
        console.log(message)

        if (message.type === "update_users") {
            const activeUsers = message.users;
        
            updateSidebar(activeUsers);
        
        } else if (message.type === "chat") {
            displayMessage(message);
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
            userElement.dataset.value = user.id;
            userElement.textContent = user.username;

            // Make the username clickable to start a private chat
            userElement.addEventListener('click', function() {
                renderChatPage(user);
            });

            chatUsersDiv.appendChild(userElement);
        });
    }
}

