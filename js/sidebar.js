// Create WebSocket connection
let socket = null;
const userNotificationState = new Map();

// initialize websocket when logged or authorized 
function initializeSocket() {
    socket = new WebSocket('ws://localhost:8080/ws');

    // Listen for messages from the WebSocket
   socket.addEventListener('message', function(event) {
    try {
        const message = JSON.parse(event.data);

        if (message.type === "update_users") {
            console.log(message.users)
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
        noUsersMessage.textContent = "No other users";
        chatUsersDiv.appendChild(noUsersMessage);
    } else {
        // Loop through the active users and add them to the sidebar
        users.forEach(function(user) {
            const userElement = document.createElement('div');
            userElement.classList.add('chat-user');
            userElement.dataset.value = user.id;

            // Create status indicator 
            const statusIndicator = document.createElement('div');
            statusIndicator.classList.add('status-indicator'); 
            // statusIndicator.style.backgroundColor = user.online ? 'green' : 'red';

            if (user.online) {
                statusIndicator.classList.add('online'); // Add 'online' class if user is online
            }

            const usernameSpan = document.createElement('div');
            usernameSpan.classList.add('chat-username'); 
            usernameSpan.textContent = user.username;


             // Add a notification icon if user has unread messages
             const notificationIcon = document.createElement('div');
             notificationIcon.classList.add('material-symbols-outlined');
             notificationIcon.innerHTML = 'mail';

             const state = userNotificationState.get(user.id);

            // Apply styles based on the stored state
            if (state === 'unread') {
                notificationIcon.style.display = 'inline-block'; // Show icon if unread
            }

             userElement.appendChild(notificationIcon);
            
            // Make the username clickable to start a private chat
            if (user.online) {
                userElement.addEventListener('click', function() {
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
                });
            } else {
                usernameSpan.style.color = 'gray';
                userElement.style.cursor = 'not-allowed';
            }
            userElement.appendChild(statusIndicator);
            userElement.appendChild(usernameSpan);

            chatUsersDiv.appendChild(userElement);
            });
    }
}


function toggleEnvelope(user, toggle) {
    const userElement = document.querySelector(`.chat-user[data-value='${user.id}']`)
    const notificationIcon = userElement.querySelector('.material-symbols-outlined');
    if (toggle === 'unread') {
    notificationIcon.style.display = 'inline-block'; // Show icon
    userNotificationState.set(user.id, 'unread'); // Save the state as 'unread'
    } else if (toggle === 'read') {
        notificationIcon.style.display = 'none'; // Hide icon
        userNotificationState.set(user.id, 'read'); // Save the state as 'read'
    }
}

function getCurrentChatID() {
    chatWindow = document.getElementById('chat-window');
    if (chatWindow.style.display === 'block') {
        return chatWindow.dataset.chatID;
    }
    return null;
}