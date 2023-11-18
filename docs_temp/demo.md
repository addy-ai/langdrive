# Demo
<br>
Create a chatbot using Google Drive. Make it smart and store data by connecting it to you or your visitors' google drive account.

Select your AI Model and optionally connect you and/or your users' google drive. 

<br>
## 1 CLICK DEPLOY
<br>
Get a chatbot up and running _NOW_!

1. Click here to [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/addy-ai/langdrive)
2. Set Heroku Secret Variables to gain access to their service
- `GOOGLE_WEB_CLIENT_ID` and `GOOGLE_WEB_CLIENT_SECRET` with Google OAuth2 Keys [instructions](https://console.cloud.google.com/apis/dashboard) are needed for user login and to connect Google Drive to their chatbot.
- `OPENAI_API_KEY` for ChatGPT4.
- `HUGGINGFACE_API_KEY` to use a HuggingFace LLM. 

<br>
## App Developers 
<br>

You can clone the repo and get started with our demo chatbot

1. Download Repo
2. > npm install
3. Create Google OAuth2 Keys
4. .env.examples -> .env + Keys
5. npm run start

More instructions for hands-on configuration available in the [Chatbot](/api/chatbot.md) section