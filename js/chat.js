let messages = [];
let userID = 0;
let receiverID = null;

// Function to open a private chat with the selected user (implement this based on your app's logic)
function renderChatPage(receiver) {
    console.log("Starting private chat with", receiver);
    receiverID = receiver.userID;

    document.getElementById("app").innerHTML = `
    <div id="chat-container">
        <div id="messages"></div>
        <textarea id="message-input" placeholder="Type a message..."></textarea>
        <button id="send-message" class="send-btn">Send</button>
    </div>
    `;

    document.getElementById('send-message').addEventListener('click', sendMessage);
    const messagesDiv = document.getElementById('messages');
    messagesDiv.addEventListener('scroll', handleScroll);

    loadMessages();
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const text = messageInput.value.trim();

    if (!text || !receiverID || !socket) return; 

    const message = {
        type: "chat",
        senderID: userID,
        receiverID: receiverID,
        text: text
    };

    socket.send(JSON.stringify(message)); 
    messageInput.value = ''; 
}

function loadMessages() {
    if (!currentChatUser || !socket) return;

    const messageRequest = {
        type: "load_messages",
        receiver: currentChatUser,
        lastMessageId: lastMessageId
    };

    socket.send(JSON.stringify(messageRequest));
}

function handleScroll() {
    const messagesDiv = document.getElementById('messages');
    if (messagesDiv.scrollTop === 0) { 
        loadMessages(); 
    }
}

function displayMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.sender}: ${message.text}`;
    messagesDiv.prepend(messageElement); // lets add a new message to the bottom so the older ones are on top
}





//function updateChat

//that updates the chat when somebody writes

//submit button --> sending the username(userID-value) and receiver and text as a json message to the websocket  