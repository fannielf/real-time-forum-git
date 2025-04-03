
async function renderPageNotFound() {

    try {
        const response = await fetch('/api/error', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json();
    
        if (!response.ok) {
            throw new Error(data.message || "Unknown error");
        }
    
        } catch(error) {
            showError(error.message);
        };

}


function showError(errorMsg) {
    const errorText = document.getElementById("error-text");
    const backButton = document.getElementById("error-back-btn");

    errorText.textContent = errorMsg;

    backButton.addEventListener("click", () => {
        history.pushState({}, '', '/');
        init();
    });
    showPage('error-message')
}
