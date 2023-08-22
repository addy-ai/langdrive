# WELCOME

Create a chatbot using Google Drive.

This repo comes with a built-in Chatbot UI for easy 1-click [deployment](#1-click-deploy). Developers can install this repo via NPM for use in node. Individuals may use a free deployed instance of this service by vising addy-ai.com. ChatGPT, HuggingFace, or more LLM Google [OAuth2](https://developers.google.com/identity/protocols/oauth2) keys are required to run your own instance (create credentials for a web app oAuth). Read our tutorial on OAuth2 on our [blog](https://addy.beehiiv.com/).

## 1 CLICK DEPLOY

Get a chatbot up and running _NOW_!

1. Click here to [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/addy-ai/langdrive)

2. Set Heroku Secret Variables to gain access to their Service

- `CLIENT_ID` and `CLIENT_SECRET` with Google OAuth2 Keys [instructions](https://console.cloud.google.com/apis/dashboard) if you want to connect Google Drive to your chatbot.
- `OPENAI_API_KEY` for ChatGPT4.
- `HUGGINGFACE_API_KEY` to use a HuggingFace LLM.

## NPM: Langdrive: Getting Started

LangDrive was built for Node.js.

- `npm install langdrive` exposes `DriveChatbot` and it's underlying utility class `DriveUtils`.
- `DriveChatbot` - Uses an agent conditionally integrated with drive_utils.
- `DriveUtils` - Syncs data to a users google drive folder if the drive_chatbot is initialized with a OAuth2 access token. The extent of the data sync is conditioned on Auth scope.

## NPM: Langdrive: DriveChatbot Class

The Chatbot returns Async Promises.

Chatbot at minimum requires being initalized like so:
`Chatbot({model_config:{HuggingFaceAPIKey:<KEY>}})`
or like so:
`Chatbot({model_config:{openAIApiKey:<KEY>}})`

### Example Script

Get started with a sample script by created the following files then running:

```
npm install langdrive dotenv
node test.js
```

`.env` File:

```
OPENAI_API_KEY=<YOUR_KEY_HERE>
GOOGLE_CLIENT_ID=<YOUR_KEY_HERE>
GOOGLE_CLIENT_SECRET=<YOUR_KEY_HERE>
```

`test.js` File:

```
require("dotenv").config();
const langdrive = require("langdrive");
// LangDrive returns promises
(async()=>{
  // To initialize Langdrive, give it a model to use and any associated config information.
  // Here we select openAi and pass it an API key (hidden behind .env)
  const chatbot = await new langdrive.DriveChatbot({
    model_config: {
      openAIApiKey: process.env.OPENAI_API_KEY,
    }
  });

  let prompt = "My name is Michael, What can you do for me.";
  console.log("> " , await chatbot.sendMessage(prompt));

  prompt = "What can you do for me in google drive?";
  console.log("> " , await chatbot.sendMessage(prompt));

  prompt = "What is my name?";
  console.log("> " , await chatbot.sendMessage(prompt));
})()

```

```
  const chatbot = await new langdrive.DriveChatbot({
    model: "openAi", // Also Available: ['openAi', 'huggingFace', 'Endpoint']
    model_config: {
      // huggingFaceApiKey: process.env.HUGGINGFACE_API_KEY,
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo", // Example: ["meta-llama/Llama-2-7b", "google/flan-t5-large", etc..]
      maxTokens: 256,
      temperature: 0.9
    }
  });
```

// OpenAI Documentation has full list
https://huggingface.co/models?pipeline_tag=text2text-generation&sort=trending
https://platform.openai.com/docs/models/gpt-3-5

where `props` is a an js object used to configure your chatbot. Available settings and their default values are shown below.

of the available settings, the following are mandatory:
how to choose model names
model name is required

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
