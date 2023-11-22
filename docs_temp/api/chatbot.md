# NPM: Langdrive: DriveChatbot Class

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