let messages = [];

// Function to open a private chat with the selected user (implement this based on your app's logic)
function renderChatPage(username, chatID) {
    document.getElementById('chat-window').style.display = 'block';
    //add chat header + rendering the messages 
    document.getElementById("chat-container").innerHTML = `
    <div id="chat-header" data-chat-id="${chatID}">
        <h2>Chat</h2>
        <div id="chat-partner">
        <h3>${username}</h3>
        </div>
        <div id="close-chat" style="cursor: pointer;">X</div>
    </div>
    <div id="chat-content">
        <div id="chat-messages">
            <div id="messages"></div>
        </div>
        <div id="input-container">
        <textarea id="message-input" placeholder="Type a message..."></textarea>
        <button id="send-button" class="send-btn">Send</button>
        </div>
    </div>
`;
    document.getElementById("close-chat").addEventListener("click", function() {
        document.getElementById('chat-window').style.display = 'none';
        init();
    });
    document.getElementById('send-button').addEventListener('click', function() {
        const chat = document.getElementById('chat-header');
    
        if (chat && chat.dataset.chatId) { 
            const chatID = parseInt(chat.dataset.chatId, 10); 
    
            if (isNaN(chatID)) {
                console.error("Invalid chat ID:", chat.dataset.chatId);
                return; // Don't send if invalid
            }
    
            sendMessage(chatID); // Call sendMessage with the retrieved chatID
        } else {
            console.error("chat-partner element or data-chat-id not found.");
        }
    });
}

function sendMessage(chatID) {
    console.log("Sending message...");
    const messageInput = document.getElementById('message-input');
    console.log("messageInput:", messageInput); // Check if element is found
    const text = messageInput.value.trim();
    console.log(text)
    if (!text) {
        return
    }

    const message = {
        type: "messageBE",
        chat_id: chatID,
        content: text
    };
    console.log("message: ", message)
    socket.send(JSON.stringify(message)); 
    messageInput.value = ''; 
}

function loadMessages() {
    if (!socket) return;

    const messageRequest = {
        type: "load_messages", //type of the message
        senderID: userID, //ID for the user who is logged in
        receiverID: receiverID //ID for the user we are chatting with
    };

    socket.send(JSON.stringify(messageRequest));
}

// function handleScroll() {
//     const messagesDiv = document.getElementById('messages');
//     if (messagesDiv.scrollTop === 0) { 
//         loadMessages(); 
//     }
// }


// displayMessages function displays the messages in the chat window (eg load chat history)
function displayMessages(data) {
    console.log(data)
    
    // go through all the messages and display them
    if (data) {
        data.forEach(message => {
            addMessage(message);
        });
    }
}

//addMessage function adds a single message to the chat window
// it checks if the sender is the user or the chat partner
function addMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');

    console.log(userID)
    console.log(message.sender.id)
    console.log(message.sender.username)
    console.log(message.content)
    if (message.sender.id === userID) {
        messageElement.classList.add('my-message');
    } else {
        messageElement.classList.add('other-message');
    }

    messageElement.textContent = `${message.created_at} - ${message.sender.username}: ${message.content}`;
    messagesDiv.appendChild(messageElement);
}