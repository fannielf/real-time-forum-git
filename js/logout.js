async function LogoutUser() {

    try {
        const response = await fetch('/api/logout', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include' 
        });
        console.log('Response:', response);

        const data = await response.json();

        if (!response.ok) {
            errorMsg = data.message;
            showError();
            showPage('error');
            return
        } else {
        // Update UI
        if (socket !== null) socket.close();
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('chat-sidebar').style.display = 'none';
        history.pushState({}, '', '/login');
        }
    } catch (error) {
        errorMsg = "Unknown Error";
        showError();
        showPage('error')
    }
    
}