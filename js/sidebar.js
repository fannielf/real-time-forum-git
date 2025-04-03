// Create WebSocket connection
let socket = null;

// initialize websocket when logged or authorized 
function initializeSocket() {
    socket = new WebSocket('ws://localhost:8080/ws');

    // Listen for messages from the WebSocket
   socket.addEventListener('message', function(event) {
    try {
        const message = JSON.parse(event.data);

        if (message.type === "update_users") {
            updateSidebar(message.users);
        
        } else if (message.type === "chat") {
            console.log(message);
            hideAllPages();
            toggleEnvelope(message.chat_user, 'read')
            renderChatPage(message.chat_user.username, message.chat_id);
            allMessages = message.history; // Store all messages
            displayedMessages = allMessages.slice(0,10);
            displayMessages(displayedMessages);

        } else if (message.type === "message") {
            if (message.chatID !== getCurrentChatID()) {
                toggleEnvelope(message.sender, 'unread')
            } else {
                addMessage(message, 'new');
            }
        }
    } catch (error) {
        console.log("error with websocket data")
        init();
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

            const usernameSpan = document.createElement('div');
            usernameSpan.classList.add('chat-username'); 
            usernameSpan.textContent = user.username;

            userElement.appendChild(statusIndicator);
            userElement.appendChild(usernameSpan);

             // Add a notification icon if user has unread messages
             const notificationIcon = document.createElement('div');
             notificationIcon.classList.add('material-symbols-outlined');
             notificationIcon.innerHTML = 'mail';

             userElement.appendChild(notificationIcon);
            
            // Make the username clickable to start a private chat
            userElement.addEventListener('click', function() {
                if (userElement.dataset.value) {
                    const userId = parseInt(userElement.dataset.value, 10); // Parse to integer (base 10)
            
                    if (isNaN(userId)) {
                        console.error("Invalid user ID:", userElement.dataset.value);
                        return; // Don't send if invalid
                    }

                    const data = {
                        type: "chatBE",
                        chat_user: {
                            id: userId,
                            username: userElement.querySelector('.chat-username').textContent,
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

function toggleEnvelope(user, toggle) {
    const userElement = document.querySelector(`.chat-user[data-value='${user.id}']`)
    const notificationIcon = userElement.querySelector('.material-symbols-outlined');
    if (toggle === 'unread') {
    notificationIcon.style.display = 'inline-block'; // Show icon
    } else if (toggle === 'read') {
        notificationIcon.style.display = 'none'; // Hide icon
    }
}

function getCurrentChatID() {
    chatWindow = document.getElementById('chat-window');
    if (chatWindow.style.display === 'block') {
        return chatWindow.dataset.chatID;
    }
    return null;
}