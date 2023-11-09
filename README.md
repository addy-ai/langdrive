# WELCOME

Create a chatbot using Google Drive. Make it smart and store data by connecting it to you or your visitors' google drive account.

Select your AI Model and optionally connect you and/or your users' google drive. Node developers can `npm install langDrive` to access our `DriveUtils` and `DriveChatbot` classes. Individuals may use a free deployed instance of this service by visting addy-ai.com. ChatGPT, HuggingFace, or more LLM Google [OAuth2](https://developers.google.com/identity/protocols/oauth2) keys are required to run your own instance (create credentials for a web app oAuth). Read our tutorial on OAuth2 on our [blog](https://addy.beehiiv.com/).

## 1 CLICK DEPLOY

Get a chatbot up and running _NOW_!

1. Click here to [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/addy-ai/langdrive)

2. Set Heroku Secret Variables to gain access to their service

- `GOOGLE_WEB_CLIENT_ID` and `GOOGLE_WEB_CLIENT_SECRET` with Google OAuth2 Keys [instructions](https://console.cloud.google.com/apis/dashboard) are needed for user login and to connect Google Drive to their chatbot.
- `OPENAI_API_KEY` for ChatGPT4.
- `HUGGINGFACE_API_KEY` to use a HuggingFace LLM. 

## NPM: Langdrive: Getting Started

LangDrive was built for Node.js.

- `npm install langdrive` exposes `DriveChatbot` and it's underlying utility class `DriveUtils`.
- `DriveChatbot` - Uses an agent conditionally integrated with drive_utils.
- `DriveUtils` - Syncs data to a users google drive folder if the drive_chatbot is initialized with a OAuth2 access token. The extent of the data sync is conditioned on Auth scope.
- `emailRetriever` - Pulls data from gmail
- `ollama` - Use local model
- `train` - Trains a model
- `email` - Retrieve emails
- `huggingFace` -  Deploys and inquires