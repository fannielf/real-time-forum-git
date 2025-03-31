let messages = [];

// Function to open a private chat with the selected user (implement this based on your app's logic)
function renderChatPage(username, chatID) {

    //add chat header + rendering the messages 
    document.getElementById("chat-container").innerHTML = `
    <div id="chat-partner" data-chat-id="${chatID}">
        <h3>${username}</h3>
        </div>
    <div id="chat-messages">
        <div id="messages"></div>
        <textarea id="message-input" placeholder="Type a message..."></textarea>
        <button id="send-button" class="send-btn">Send</button>
    </div>
    `;

    document.getElementById('send-button').addEventListener('click', function() {
        const chatPartner = document.getElementById('chat-partner');
    
        if (chatPartner && chatPartner.dataset.chatId) { // Corrected: chatPartner.dataset.chatId
            const chatID = parseInt(chatPartner.dataset.chatId, 10); // Corrected: chatPartner.dataset.chatId
    
            if (isNaN(chatID)) {
                console.error("Invalid chat ID:", chatPartner.dataset.chatId);
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

//this function is to arrange the messages in the chat - sender or receiver
//receiving sender(id), content and timestamp from the database ==data
function displayMessages(data) {
    const messagesDiv = document.getElementById('messages');
    
    // go through all the messages and display them
    data.forEach(message => {
        const messageElement = document.createElement('div');

        if (message.sender.ID === userID) {
            messageElement.classList.add('my-message');
        } else {
            messageElement.classList.add('other-message');
        }

        messageElement.textContent = `${message.createdAt} - ${message.sender.username}: ${message.content}`;
        messagesDiv.appendChild(messageElement);
    });
}


//function updateChat

//that updates the chat when somebody writes

//submit button --> sending the username(userID-value) and receiver and text as a json message to the websocket  