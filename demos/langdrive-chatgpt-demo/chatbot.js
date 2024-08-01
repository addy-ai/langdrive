
// Selecting the send button and input field
const sendButton = document.getElementById('send-button');
const messageInput = document.getElementById('message-input');
const chatHistory = document.getElementById('chat-history');

// Function to create a unique ID
function createUniqueId() {
    return 'msg-' + Date.now();
}

// Function to create a chat message div
function createChatMessageDiv(userInput, messageId) {
    return `
            <div class="chat-message" id="${messageId}">
                <div class="flex items-center justify-between mb-6">
                    <h1 class="text-xl font-semibold user-prompt">${userInput}</h1>
                    <div class="text-gray-400">
                        <button class="mr-2">
                            <i class="fas fa-print"></i>
                        </button>
                        <button>
                            <i class="fas fa-expand-arrows-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="bg-gray-700 p-6 rounded-md mb-6 flex-1 ai-response">
                    <p>thinking...</p>
                </div>
                <div class="flex justify-end mb-6">
                    <button class="bg-blue-600 text-white p-2 rounded-md">
                        <i class="fas fa-sync-alt"></i> Regenerate response
                    </button>
                </div>
            </div>
        `;
}

// Function to send API request
async function sendApiRequest(userInput) {
    const apiUrl = 'https://api.langdrive.ai/v1/completions';
    const requestData = {
        prompt: userInput,
        model: 'mistralai/Mistral-7B-Instruct-v0.1', // Replace with your model name
        // max_tokens: 50,
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        if (data.success) {
            return data.generated_text;
        } else {
            throw new Error('API response error');
        }
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry something went wrong. Please try again.';
    }
}

// Event listener for send button
sendButton.addEventListener('click', async () => {
    const userInput = messageInput.value;
    if (userInput.trim() === '') return; // Prevent empty inputs

    // Create and append the chat message
    const messageId = createUniqueId();

    const chatMessageDiv = createChatMessageDiv(userInput, messageId);
    chatHistory.insertAdjacentHTML('beforeend', chatMessageDiv);

    // Clear the input field
    messageInput.value = '';

    // Get the response from the API
    const apiResponse = await sendApiRequest(userInput);

    // Select the current chat message AI response div and update its content
    const currentMessageDiv = document.getElementById(messageId);

    const aiResponseDiv = currentMessageDiv.querySelector('.ai-response p');
    aiResponseDiv.textContent = apiResponse;
});

