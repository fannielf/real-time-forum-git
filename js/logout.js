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
            showError(data.message);
            return
        } else {
        // Update UI
        if (socket !== null) socket.close(); socket = null;
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('chat-sidebar').style.display = 'none';
        history.pushState({}, '', '/login');
        }
    } catch (error) {
        showError(data.message);
    }
    
}