let allMessages = [];
let displayedMessages = [];

// Function to open a private chat with the selected user (implement this based on your app's logic)
function renderChatPage(username, chatID) {
    document.getElementById('chat-window').style.display = 'block';
    //add chat header + rendering the messages 
    document.getElementById("chat-container").innerHTML = `
    <div id="chat-header" data-chat-id="${chatID}">
        <h2>Chat</h2>
        <div id="chat-partner">
        <span class="material-symbols-outlined" style="font-size: 24px;">filter_vintage</span>
        <h3>${username}</h3>
        </div>
        <div id="close-chat" style="cursor: pointer;">X</div>
    </div>
    <div id="chat-content">
    <div id="chat-messages">
    <div id="loading-indicator">Loading older messages...</div>
        <div id="messages"></div>
    </div>
    <div id="input-container">
        <textarea id="message-input" placeholder="Type a message..." disabled></textarea>
        <button id="send-button" class="send-btn" disabled>Send</button>
        </div>
    </div>
`;

    displayMessages(displayedMessages, 'old');

    const messageDiv = document.getElementById('messages');
    messageDiv.scrollTop = messageDiv.scrollHeight; // Scroll to the bottom

    document.getElementById("close-chat").addEventListener("click", function() {
        document.getElementById('chat-window').style.display = 'none';
        init();
    });
    
    document.getElementById('messages').addEventListener('scroll', () => {
        // Check if the user has scrolled to the top
        if (document.getElementById('messages').scrollTop === 0 && displayedMessages.length !== allMessages.length) {
            toggleLoadingIndicator('show');
            setTimeout(loadMoreMessages, 1000);
        }
    });
}

function userStatus(username, online) {

    const partnerElement = document.getElementById('chat-partner');
    const partnerName = partnerElement.querySelector('h3')?.textContent;
    
    if (username === partnerName) {
        const message = document.getElementById("message-input")
        const sendbtn = document.getElementById("send-button")
        if (online) {
            message.classList.remove("disabled");
            sendbtn.classList.remove("disabled");
            message.disabled = false;
            sendbtn.disabled = false;
            document.getElementById('send-button').addEventListener('click', handleSendClick);
        } else {
            message.classList.add("disabled");
            sendbtn.classList.add("disabled");
            message.disabled = true;
            sendbtn.disabled = true;
            document.getElementById('send-button').removeEventListener('click', handleSendClick);
        }
    }

}

function handleSendClick() {
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
}

function sendMessage(chatID) {
    const messageInput = document.getElementById('message-input');
    const text = messageInput.value.trim();
    if (!text) {
        return
    }

    const message = {
        type: "messageBE",
        chat_id: chatID,
        content: text
    };
    socket.send(JSON.stringify(message)); 
    messageInput.value = ''; 
}

function loadMoreMessages() {
    if (!socket) return;

    const chatMessages = document.getElementById('messages');
    const previousScrollHeight = chatMessages.scrollHeight;

    const currentMessageCount = displayedMessages.length;
    const nextMessages = allMessages.slice(currentMessageCount, currentMessageCount + 10);

    if (nextMessages.length > 0) {
        nextMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        displayedMessages = [...nextMessages, ...displayedMessages];
        displayMessages(nextMessages, 'old')
    }

    // Wait for DOM to update, then adjust scroll position
    setTimeout(() => {
        const newScrollHeight = chatMessages.scrollHeight;
        chatMessages.scrollTop = newScrollHeight - previousScrollHeight;
        toggleLoadingIndicator('hide');
    }, 0);
}

// displayMessages function displays the messages in the chat window (eg load chat history)
function displayMessages(data, type = 'old') {
    const messagesDiv = document.getElementById('messages');
    
    data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    // go through all the messages and display them
    if (data) {
        data.forEach(message => {
            addMessage(message, type);
        });
    }
}

//addMessage function adds a single message to the chat window
// it checks if the sender is the user or the chat partner
function addMessage(message, type = 'new') {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');

    if (message.sender.id === userID) {
        messageElement.classList.add('my-message');
    } else {
        messageElement.classList.add('other-message');
    }
    messageElement.textContent = `${message.created_at} - ${message.sender.username}: ${message.content}`;
    if (type === 'new') {
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } else {
        messagesDiv.prepend(messageElement);
    }
}

// Toggle between showing and hiding the loading indicator
function toggleLoadingIndicator(status = 'hide') {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (status === 'show') {
        loadingIndicator.style.display = 'block';
    } else {
        loadingIndicator.style.display = 'none';
    }
}