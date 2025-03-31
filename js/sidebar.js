// Create WebSocket connection
let unreadMessages = {};
let socket = null;
let currentChatUser = null;

// initialize websocket when logged or authorized 
function initializeSocket() {
    socket = new WebSocket('ws://localhost:8080/ws');

    // Listen for messages from the WebSocket
   socket.addEventListener('message', function(event) {
    try {
        console.log("message received")
        const message = JSON.parse(event.data);
        console.log(message)

        if (message.type === "update_users") {
            console.log(message.users)
            const activeUsers = message.users;
        
            updateSidebar(activeUsers);
        
        } else if (message.type === "chat") {
            hideAllPages();
            renderChatPage(message.chat_user.username, message.chat_id);

        } else if (message.type === "message") {
            if (message.chatID !== getCurrentChatID()) {
                unreadMessages[message.chatID] = true; 
            }
            displayMessages(message);
            updateSidebar();
        }
    } catch (error) {
        console.log("error with websocket data")
    }
    });

}

// Function to update the sidebar with the list of active users
function updateSidebar(users) {
    const chatUsersDiv = document.getElementById('chat-users');
    chatUsersDiv.innerHTML = '';

    // Handle case where no users are present
    if (!users) {
        const noUsersMessage = document.createElement('div');
        noUsersMessage.textContent = "No active users";
        chatUsersDiv.appendChild(noUsersMessage);
    } else {
        // Loop through the active users and add them to the sidebar
        users.forEach(function(user) {
            const userElement = document.createElement('div');
            userElement.classList.add('chat-user');
            // userElement.textContent = user.username;
            userElement.dataset.value = user.id;

            // Create status indicator 
            const statusIndicator = document.createElement('div');
            statusIndicator.classList.add('status-indicator'); 

            const usernameSpan = document.createElement('span');
            usernameSpan.textContent = user.username;

            userElement.appendChild(statusIndicator);
            userElement.appendChild(usernameSpan);

             // Add a notification icon if user has unread messages
             const notificationIcon = document.createElement('span');
             notificationIcon.classList.add('notification-icon');
             if (user.hasUnreadMessages) {
                 notificationIcon.style.display = 'inline-block';  // Show icon if there are unread messages
             } else {
                 notificationIcon.style.display = 'none';  // Hide icon if no unread messages
             }
            userElement.appendChild(notificationIcon);
            
            // Make the username clickable to start a private chat
            userElement.addEventListener('click', function() {
                if (userElement.dataset.value) {
                    const userId = parseInt(userElement.dataset.value, 10); // Parse to integer (base 10)
            
                    if (isNaN(userId)) {
                        console.error("Invalid user ID:", userElement.dataset.value);
                        return; // Don't send if invalid
                    }

                    markMessagesAsRead(user.chatID);

                    const data = {
                        type: "chatBE",
                        chat_user: {
                            id: userId,
                            username: userElement.textContent,
                        }
                    };
                    console.log(data)
                    socket.send(JSON.stringify(data)); // Send as JSON string
                }

            });

            chatUsersDiv.appendChild(userElement);
        });
    }
}

function markMessagesAsRead(chatID) {
   unreadMessages[chatID] = false; // Mark messages as read
   // Update the sidebar to remove the notification icon
}

