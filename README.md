# WELCOME

Create a chatbot using Google Drive. Make it smart and store data by connecting it to you or your visitors' google drive account.

Select your AI Model and optionally connect you and/or your users' google drive. Node developers can `npm install langDrive` to access our `DriveUtils` and `DriveChatbot` classes. Individuals may use a free deployed instance of this service by vising addy-ai.com. ChatGPT, HuggingFace, or more LLM Google [OAuth2](https://developers.google.com/identity/protocols/oauth2) keys are required to run your own instance (create credentials for a web app oAuth). Read our tutorial on OAuth2 on our [blog](https://addy.beehiiv.com/).

## 1 CLICK DEPLOY

Get a chatbot up and running _NOW_!

1. Click here to [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/addy-ai/langdrive)

2. Set Heroku Secret Variables to gain access to their Service

- `GOOGLE_WEB_CLIENT_ID` and `GOOGLE_WEB_CLIENT_SECRET` with Google OAuth2 Keys [instructions](https://console.cloud.google.com/apis/dashboard) are needed for user login and to connect Google Drive to their chatbot.
- `OPENAI_API_KEY` for ChatGPT4.
- `HUGGINGFACE_API_KEY` to use a HuggingFace LLM.
- ``

## NPM: Langdrive: Getting Started

LangDrive was built for Node.js.

- `npm install langdrive` exposes `DriveChatbot` and it's underlying utility class `DriveUtils`.
- `DriveChatbot` - Uses an agent conditionally integrated with drive_utils.
- `DriveUtils` - Syncs data to a users google drive folder if the drive_chatbot is initialized with a OAuth2 access token. The extent of the data sync is conditioned on Auth scope.

## NPM: Langdrive: DriveChatbot Class

The Chatbot returns Async Promises.

Chatbot's minimal initalization is like so:
`chatbot = new langdrive.DriveChatbot({model_config:{HuggingFaceAPIKey:<KEY>}})`
or like so:
`chatbot = new langdrive.Chatbot({model_config:{openAIApiKey:<KEY>}})`

### Chatbot Example Script

Get started with a sample script by created the following files:

```
npm install langdrive dotenv
node test.js
```

`.env` File:

```
OPENAI_API_KEY=<YOUR_KEY_HERE>
GOOGLE_DESKTOP_CLIENT_KEYFILE_PATH=<YOUR_KEY_HERE>
```

`test.js` File:

```
require("dotenv").config();
const langdrive = require("langdrive");

// LangDrive returns promises
(async()=>{
  // To initialize Langdrive, give it a model to use and any associated config information.
  // Here we select openAi and pass it an API key (hidden behind .env)
  let chatbot = await new langdrive.DriveChatbot({
    verbose: true,
    drive: {
      verbose: false,
      ...(!GOOGLE_DESKTOP_KEYFILE_PATH
        ? {}
        : {
            server: {
              embed_from_folder: "chatbot",
              embed_to_folder: "chatbot/embeddings",
              scopes: ["https://www.googleapis.com/auth/drive"],
              // serviceKeyFile: __dirname + "/../" + GOOGLE_SERVICE_KEYFILE_PATH
              // OR
              desktopKeyFile: __dirname + GOOGLE_DESKTOP_KEYFILE_PATH
              // ( Alternately:) desktopKeyFileContents: GOOGLE_DESKTOP_CLIENT_KEYFILE_CONTENTS
              // OR
              // desktopTokenFile: GOOGLE_DESKTOP_CLIENT_TOKEN_PATH:
              // ( Alternately:) desktopTokenFileContents: GOOGLE_DESKTOP_CLIENT_TOKEN_CONTENTS
              // OR
              //client_id: GOOGLE_DESKTOP_CLIENT_ID, // and
              //client_secret: GOOGLE_SERVICE_CLIENT_SECRET //and
              //client_redirect_uri: xyz
            }
          })
    },
    model: {
      service: !!HUGGINGFACE_API_KEY ? "huggingFace" : "chatOpenAi",
      model_config: !!HUGGINGFACE_API_KEY
        ? {
            model_id: "meta-llama/Llama-2-30b",
            huggingFaceApiKey: HUGGINGFACE_API_KEY
          }
        : {
            modelName: "gpt-3.5-turbo", // default = "text-davinci-003"
            // maxTokens: 256, // default = 256
            openAIApiKey: OPENAI_API_KEY,
            temperature: 0.9
          }
    },
    agent: {
      type: "chat-conversational-react-description",
      memory_length: 2,
      vector_length: 2,
      verbose: false,
      tools: [],
      agent_config: {}
      // prefix
      // suffix
    }
  });
  // LangDrive returns a promise, so let's await those.
  let prompt = "My name is Michael, What can you do for me.";
  console.log("> " , await chatbot.sendMessage(prompt));

  prompt = "What can you do for me in google drive?";
  console.log("> " , await chatbot.sendMessage(prompt));

  prompt = "What is my name?";
  console.log("> " , await chatbot.sendMessage(prompt));
})()
```

You can also clone the repo and get started with our demo chatbot

1. Download Repo
2. > npm install
3. Create Google OAuth2 Keys
4. .env.examples -> .env + Keys
5. npm run start

### Chatbot Properties

The `props` used in DriveChatbot(`props`) configure your chatbot. Available settings and their default values are shown below.

## NPM: Langdrive: DriveUtils Class

```
DriveUtils =

  ~~~~~~~~~~ class methods
  getDrive()
  listFiles(mimeType)
  getFileInfo(filename, mimeType)
  getFileById(fileId)
  getFileByName(filename, mimeType = false)
  createFile(filename, mimeType, message)
  createAndOrGetFile(filename, mimeType, message)
  updateFile(fileId, mimeType, message)

  ~~~~~~~~~~ static methods
  getAuthUrl({redirect_uri, client_id, scope})
  handleAuthCallback({client_secret, access_token, code, redirect_uri})
  refreshToken({client_secret, access_token, refresh_token, client_id})
  checkAndRefresh ({access_token, timestamp, refresh_token, client_id, client_secret})
```

Create an instance of the `DriveUtils` class like so:

```
const myDriveTool = new DriveUtils(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, { ACCESS_TOKEN, verbose })
```

The DriveUtils class has some helping static functions to help you work with google OAuth2 access tokens.

Provides a URL for a user-consent page.

```
  let authUrl = DriveUtils.getAuthUrl({
    redirect_uri: "http://localhost:3000/auth/google/callback",
    scope: "https://www.googleapis.com/auth/drive",
    client_id: GOOGLE_CLIENT_ID
  });
  res.redirect(authUrl);
```

Success will redirect you to the `redirect_uri` you with a `code` included in as a query parameter.

This `redirect_uri`` must be approved in the project's google cloud console oAuth2 admin panel.

We take the resulting `req.query.code` and issue anothe request to google to retrieve our `ACCESS_TOKEN`

```
let await DriveUtils.handleAuthCallback({
code,
client_id: GOOGLE_CLIENT_ID,
client_secret: GOOGLE_CLIENT_SECRET
});
```

The resulting data will return a refresh_token. If you save that, when the access_token expires, you can use `checkAndRefresh` to get a new one.

```
await DriveUtils.checkAndRefresh(
access_token,
req.session.timestamp,
req.session.refresh_token,
GOOGLE_CLIENT_ID,
GOOGLE_CLIENT_SECRET
);

```

With that, you can create a `new DriveUtils` which provides Drive access.

```
myDriveTool.listFiles(mimeType)
```
