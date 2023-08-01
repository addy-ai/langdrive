# WELCOME

Create a chatbot using Google Drive.

This repo comes with a built-in Chatbot UI for easy 1-click [deployment](#1-click-deploy). Developers can install this repo via NPM to handle only backend functions. It provides code to both handle backend requests and the accompanying chatbot UI to issue the requests. Individuals may use a free instance of this service by vising addy-ai.com. Individual contributors can fork a copy, or contribute a PR, by following the instructions (and documentation) below. Google [OAuth2](https://developers.google.com/identity/protocols/oauth2) keys are required to run your own instance. Read our tutorial on OAuth2 on our [blog](https://addy.beehiiv.com/).

## 1 CLICK DEPLOY

Get a chatbot up and running _NOW_!

1. Click here to [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://github.com/addy-ai/embeddings-server)

2. _optionally_ Set Heroku Secret Variables `CLIENT_ID` and `CLIENT_SECRET` with corresponding Google OAuth2 Keys [instructions](https://console.cloud.google.com/apis/dashboard).

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

the npm import `drive` exposes `drive_utils`.

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
