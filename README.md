# WELCOME

Create a chatbot using Google Drive.

This repo comes with a built-in Chatbot UI for easy 1-click [deployment](#1-click-deploy). Developers can install this repo via NPM to handle only backend functions. It provides code to both handle backend requests and the accompanying chatbot UI to issue the requests. Individuals may use a free instance of this service by vising addy-ai.com. Individual contributors can fork a copy, or contribute a PR, by following the instructions (and documentation) below. Google [OAuth2](https://developers.google.com/identity/protocols/oauth2) keys are required to run your own instance (create credentials for a web app oAuth). Read our tutorial on OAuth2 on our [blog](https://addy.beehiiv.com/).

## 1 CLICK DEPLOY

Get a chatbot up and running _NOW_!

1. Click here to [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://github.com/addy-ai/langdrive)

2. Set Heroku Secret Variables `CLIENT_ID` and `CLIENT_SECRET` with corresponding Google OAuth2 Keys [instructions](https://console.cloud.google.com/apis/dashboard).

## Components

For developers who would like to explore the full breadth of this repo's functionality.

| Root
|
| - package
| - .env.example
| - main.js -> Entrypoint for `import drive`
|
| - Src/
|
| - - Server/
| - - - start_server.js
| - - - drive_utils.js
| - - - test_server.js
|  
| - - Client/
| - - - chatbot.html
| - - - chatbot_utils.js

### Server

`start_server` is used in heroku. It serves `client/chatbot.html` and handles it's request's by using `drive_utils`.

- The app starts on the '/chat' endpoint.

- The npm import `langdrive` exposes `DriveChatbot` and it's underlying utility class `DriveUtils`.

- drive_chatbot can be constructed with the following properties:

```
  this.driveUtils =  new DriveUtils(props.CLIENT_ID, props.CLIENT_SECRET, props.ACCESS_TOKEN)
  this.drive_chat_history_filename = props.drive_chat_history_filename || "chatbot_chat_history.json";
  this.drive_chat_history_filepath = props.drive_chat_history_filepath || "./";
  this.drive_embeddings_filename = props.drive_embeddings_filename || "chatbot_embeddings.json";
  this.drive_embeddings_filepath = props.drive_embeddings_filepath || "./";
  this.drive_document_directory_filename = props.drive_documents_filename || "chatbot_documents.json";
  this.drive_document_directory_filepath = props.drive_document_directory_filepath || "./";

  At least one model must be specified. props.model Values: ['openAi', 'huggingFace', 'Endpoint'] and recieves props.model_config

  this.memory_length = props.memory_length || 5;
  this.vector_length = props.vector_length || 2;
  this.agent = props.agent || "chat-conversational-react-description";
  this.agent_config = props.agent_config || {};
  this.agent_verbose = props.agent_verbose || false;
  this.tools = [
    new Calculator(),
    "Drive Util: List Files" ,
    "Drive Util: Read Contents",
    ...props.tools
  ];
  this.DEFAULT_PREFIX = props.default_prefix || DEFAULT_PREFIX;
  this.DEFAULT_SUFFIX = props.default_suffix || DEFAULT_SUFFIX;
```

### Client -

`chatbot.html` is used in heroku and delivered via `start_server`.

## SETUP

1. Download Repo
2. > npm install
3. Create Google OAuth2 Keys
4. .env.examples -> .env + Keys

## LOCAL DEV

1. 'npm run start' -
2. 'npm run build' -
3. 'npm run test' -
