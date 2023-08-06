// Values to be replaced
let chatbotName = undefined;
let chatbotAvatarURL = undefined;
let customerAvatarURL = "https://i.imgur.com/vphoLPW.png";
let customerName = "You";
let chatbotAPI =
  "https://us-central1-hey-addy-chatgpt.cloudfunctions.net/businessInference/infer";
chatbotAPI = "http://localhost:3000";

const currentUrl = window.location.href;
// const publicId = currentUrl.split("/").pop(); // public ID of chatbot
const publicId = "71ea43c6-b108-4c50-bf36-fe86d500a819";

const chatHistory = document.getElementById("chat-history");
const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");
const container = document.querySelector(".chat-container");
const header = document.querySelector(".header-container");

// Send button is disabled by default until input len > 1
sendBtn.disabled = true;

window.onload = async function () {
  /*
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get("code");
  console.log("code", code);
  if (code) {
    localStorage.setItem("authCode", code);
  }
  if (localStorage.getItem("authCode")) {
    initializeBot(); // jumpstart this bot
  }*/
  initializeBot();
};

function initializeBot() {
  // Show loading
  const loadingView = document.querySelector(".loading-overlay");
  const mainView = document.querySelector(".main-container");

  if (mainView) mainView.style.display = "none"; // Hide main view
  if (loadingView) loadingView.style.display = "flex"; // Show loading view
  // Get the bot information.
  console.log("fetching");
  fetch(`${chatbotAPI}/bot_init`)
    .then((response) => response.json())
    .then((botInfo) => {
      // Handle the response from the server
      if (botInfo.status == 400) {
        window.location.href = "./auth/google";
        // showError(loadingView);
        return;
      }
      // Bot info is available
      chatbotName = botInfo.name; // set name
      chatbotAvatarURL = botInfo.avatarURL; // set avatar URL
      // Show the bot view, then get first message
      if (loadingView) loadingView.style.display = "none";
      if (mainView) mainView.style.display = "block";
      updateHeader(botInfo);
      onSendButtonClick(publicId, botInfo); // Activate send button
      showBotWelcomeMessage(publicId, botInfo);
    })
    .catch((err) => {
      console.error("Addy AI Error: ", err);
      // Handle errors
    });
}

function showBotWelcomeMessage(botPublicId, botInfo) {
  fetch(`${chatbotAPI}/bot_welcome?publicId=${botPublicId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.response) {
        createBotMessageElement(data.response, botInfo);
      }
      chatHistory.scrollTop = chatHistory.scrollHeight;
    });
}

function addMessageToChat(message, type) {
  const messageElem = document.createElement("div");
  if (type == "customer") {
    messageElem.setAttribute("class", "message-customer-parent");
    messageElem.innerHTML = customerMessageHTML.replace("{{message}}", message);
  }
  chatHistory.append(messageElem);
}

function createBotMessageElement(message, botInfo) {
  const messageId = `bot-message-${Date.now()}`;
  const messageElem = document.createElement("div");

  messageElem.setAttribute("class", "message-chatbot-parent");
  let innerHTML = chatbotMessageHTML.replace("{{messageId}}", messageId);
  // Replace, name, message, avatar URL
  console.log("CREATING MESSAGE: ", { message, botInfo });
  innerHTML = innerHTML.replace("{{chatbotName}}", botInfo.name);
  innerHTML = innerHTML.replace("{{chatbotAvatarURL}}", botInfo.avatarURL);
  innerHTML = innerHTML.replace("{{message}}", message);
  messageElem.innerHTML = innerHTML;

  chatHistory.append(messageElem);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  return messageId;
}

document
  .getElementById("message-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the default action (form submission, line break, etc.)
      document.getElementById("send-btn").click();
    }
  });

function updateHeader(botInfo) {
  if (header) {
    header.innerHTML = botInfo.name;
  }
  // Change title
  document.title = botInfo.name;
}

function showError(element) {
  if (element) {
    element.innerHTML = "Error: Chatbot not found";
    element.style.color = "#D2042D";
  }
}

function onSendButtonClick(publicId, botInfo) {
  sendBtn.addEventListener("click", () => {
    const message = messageInput.value;
    if (message) {
      addMessageToChat(message, "customer");
      messageInput.value = "";

      // show thinking element
      const thinkingElem = document.createElement("div");
      thinkingElem.setAttribute("class", "message-chatbot-parent");
      let thinkingInnerHTML = chatbotThinking;
      thinkingInnerHTML = thinkingInnerHTML.replaceAll(
        "{{chatbotAvatarURL}}",
        botInfo.avatarURL
      );
      thinkingInnerHTML = thinkingInnerHTML.replaceAll(
        "{{chatbotName}}",
        botInfo.name
      );

      setTimeout(() => {
        thinkingElem.innerHTML = thinkingInnerHTML;
        chatHistory.append(thinkingElem);
        chatHistory.scrollTop = chatHistory.scrollHeight;
      }, 400);

      // There's an element to fetch message in
      fetch(`${chatbotAPI}/qa?user_query=${message}&publicId=${publicId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // remove thinking
          thinkingElem.style.display = "none";
          if (data.response) {
            createBotMessageElement(data.response, botInfo);
          } else {
            createBotMessageElement(
              "Sorry I could not understand your question",
              botInfo
            );
          }
          chatHistory.scrollTop = chatHistory.scrollHeight;
        })
        .catch((error) => {
          thinkingElem.style.display = "none";
          createBotMessageElement(
            "Oops... I had a glitch :( My engineers are working on it",
            botInfo
          );
        });
    }
  });
}

// Send button only visible when input text value > 1 character
messageInput.addEventListener("input", () => {
  // Get trimmed value of input
  const trimmedValue = messageInput.value.trim();

  // Enable/disable send button based on input value
  if (trimmedValue.length > 1) {
    sendBtn.disabled = false;
  } else {
    sendBtn.disabled = true;
  }
});

const customerMessageHTML = `
    <div class="message customer">
        <div class="horizontal-flex flex-end">
            <img class="avatar" src="${customerAvatarURL}">
            <div class="text">
                <span class="name">${customerName}</span>
                <p>{{message}}</p>
            </div>
        </div>
        
    </div>

`;

const chatbotMessageHTML = `
    <div class="message chatbot">
        <img class="avatar" src="{{chatbotAvatarURL}}">
        <div class="text">
            <span class="name" id="chatbot-name">{{chatbotName}}</span>
            <p id="{{messageId}}">{{message}}</p>
        </div>
    </div>
`;

const chatbotThinking = `
    <div class="message chatbot">
        <img class="avatar" src="{{chatbotAvatarURL}}">
        <div class="text">
            <span class="name" id="chatbot-name">{{chatbotName}}</span>
            <p id="{{messageId}}">thinking...</p>
        </div>
    </div>
`;
