let messages = [];

// Function to open a private chat with the selected user (implement this based on your app's logic)
function renderChatPage(username, chatID) {
    console.log("Starting private chat with", username);

    //send a message to the backend to get the old messages type = "chat" receiverID = 
    //backend responds with chatID and messages. chatID i need to save 

    //add chat header + rendering the messages 
    document.getElementById("chat-container").innerHTML = `
    <div id="chat-partner">
        <h3>${username}</h3>
        </div>
    <div id="chat-messages">
        <div id="messages"></div>
        <textarea id="message-input" placeholder="Type a message..."></textarea>
        <button id="send-button" class="send-btn">Send</button>
    </div>
    `;

    document.getElementById('send-button').addEventListener('click', sendMessage(chatID));
    // const messagesDiv = document.getElementById('messages');
    // messagesDiv.addEventListener('scroll', handleScroll);
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
        type: "message",
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