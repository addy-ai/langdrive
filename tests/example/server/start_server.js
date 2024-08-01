const https = require("https");
const passport = require("passport");
const express = require("express");
const session = require("express-session");
const path = require("path");
var SQLiteStore = require("connect-sqlite3")(session);
require("dotenv").config();

const axios = require("axios");
const querystring = require("querystring");

// The first sign is you go through the full authorization process
// To see it again, you have to revoke the app from your google account:
// https://myaccount.google.com/connections?filters=3,4&hl=en

// The OAuth2 playground helps:
// https://developers.google.com/oauthplayground/
// Access Tokens Need refreshing every hour.
const app = express();

let bot_local_memory = {};

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: new SQLiteStore({ db: "sessions.db", table: "sessions", dir: "." })
  })
);

const cors = require("cors");
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

// Serve static files for client
const publicDirectoryPath = __dirname + "/client";
app.use(express.static(publicDirectoryPath));

app.listen(3000, () => console.log(`Server running on http://localhost:3000`));

require("dotenv").config();
const Chatbot = require("./server/drive_chatbot.js");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const redirect_uri = process.env.REDIRECT_URI

// For normal oAuth2
const GOOGLE_WEB_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID;
const GOOGLE_WEB_CLIENT_SECRET = process.env.GOOGLE_WEB_CLIENT_SECRET;

const GOOGLE_DESKTOP_CLIENT_ID = process.env.GOOGLE_DESKTOP_CLIENT_ID;
const GOOGLE_DESKTOP_CLIENT_SECRET = process.env.GOOGLE_DESKTOP_CLIENT_SECRET;

// If you have a service account you can use either the keyfile contents or the keyfile's path:
const GOOGLE_WEB_CLIENT_KEYFILE_CONTENTS = process.env.GOOGLE_WEB_CLIENT_KEYFILE_CONTENTS; 
const GOOGLE_DESKTOP_CLIENT_KEYFILE_CONTENTS = process.env.GOOGLE_DESKTOP_CLIENT_KEYFILE_CONTENTS; 
const GOOGLE_SERVICE_CLIENT_KEYFILE_CONTENTS = process.env.GOOGLE_SERVICE_CLIENT_KEYFILE_CONTENTS; // google_service_credentials.json

const GOOGLE_WEB_CLIENT_KEYFILE_PATH = path.resolve() + '/' + process.env.GOOGLE_WEB_CLIENT_KEYFILE_PATH;  
const GOOGLE_DESKTOP_CLIENT_KEYFILE_PATH = path.resolve() + '/' + process.env.GOOGLE_DESKTOP_CLIENT_KEYFILE_PATH;
const GOOGLE_SERVICE_CLIENT_KEYFILE_PATH = path.resolve() + '/' + process.env.GOOGLE_SERVICE_CLIENT_KEYFILE_PATH; // google_service_credentials.json
app.use(express.json());

app.get("/", async (req, res) => {
  res.redirect("/chat"); /*
  res.send(`<h1>Welcome</h1><br> \ 
  <a href='./client_side_auth'>client_side_auth</a><br> \
  <a href='./chat'>Chat</a><br> \
  <a href='./user'>User Check</a><br> \ 
  <a href='./auth/google'>Auth Google</a><br> \ 
  `);*/
});

const DriveUtils = require("./server/drive_utils.js");
app.get("/auth/google", (req, res) => {
  let authUrl = DriveUtils.getAuthUrl({
    redirect_uri, 
    scope: "https://www.googleapis.com/auth/drive",
    client_id: GOOGLE_WEB_CLIENT_ID
  });
  res.redirect(authUrl);
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  let callback = await DriveUtils.handleAuthCallback({
    code,
    client_id: GOOGLE_WEB_CLIENT_ID,
    client_secret: GOOGLE_WEB_CLIENT_SECRET,
    redirect_uri
  });
  // console.log("auth/google/callback", { callback });
  req.session.access_token = callback.access_token;
  req.session.refresh_token = callback.refresh_token;
  req.session.timestamp = new Date().toISOString();
  // console.log("SAVING access_token: ", req.session.access_token);
  callback.access_token ? res.redirect("/chat") : res.status(500).send("Error during authentication");
});

async function checkAccessToken(req, res, next) {
  let access_token = req.session.access_token;
  if (access_token) {
    access_token = await DriveUtils.checkAndRefresh({
      access_token,
      timestamp: req.session.timestamp,
      refresh_token: req.session.refresh_token,
      client_id: GOOGLE_WEB_CLIENT_ID,
      client_secret: GOOGLE_WEB_CLIENT_SECRET
    });
    req.session.timestamp = new Date().toISOString();
  }
  if (!access_token) {
    // console.log("NO ACCESS TOKEN ");
    return res.redirect("/auth/google");
  }
  req.session.access_token = access_token;
  next();
}

// let scope = ["profile", "email", "https://www.googleapis.com/auth/drive.file"];
app.get("/chat", checkAccessToken, (req, res, next) => {
  res.sendFile(__dirname + "/client/chatbot.html");
});

//
// Initialize the bot, load up it's data or create the associated files
//
app.get("/bot_init", checkAccessToken, async (req, res) => {
  console.log("\n INIT CHATBOT \n");
  let chatbot = new Chatbot({
    verbose: true,
    drive: {
      verbose: true,
      ...( !GOOGLE_WEB_CLIENT_ID && !GOOGLE_WEB_CLIENT_KEYFILE_CONTENTS && !GOOGLE_WEB_CLIENT_KEYFILE_PATH
        ? {}
        : {
          web: {
            verbose: true,
            scopes: ["https://www.googleapis.com/auth/drive"],
            appType:'web', 
            ...(
                GOOGLE_WEB_CLIENT_ID
                ? {
                    client_id: GOOGLE_WEB_CLIENT_ID,
                    client_secret: GOOGLE_WEB_CLIENT_SECRET,
                    access_token: req.session.access_token
                  }
                : {}
            ),
            ...(GOOGLE_WEB_CLIENT_KEYFILE_CONTENTS
                ? { appType:'web', keyFileContents: GOOGLE_WEB_CLIENT_KEYFILE_CONTENTS }
                : {}
            ),
            ...(GOOGLE_WEB_CLIENT_KEYFILE_PATH
                ? { appType:'web', keyFilePath: __dirname + GOOGLE_WEB_CLIENT_KEYFILE_PATH }
                : {}
            ),
          }
        }
      ),
      ...( !GOOGLE_DESKTOP_CLIENT_ID && !GOOGLE_DESKTOP_CLIENT_KEYFILE_CONTENTS && !GOOGLE_DESKTOP_CLIENT_KEYFILE_PATH
        ? {}
        : {
          server: {
            verbose: false,
            embed_from_folder: "chatbot",
            embed_to_folder: "chatbot/embeddings",
            scopes: ["https://www.googleapis.com/auth/drive"],
            ...(
                GOOGLE_DESKTOP_CLIENT_ID
                ? {
                    appType:'desktop', 
                    client_id: GOOGLE_DESKTOP_CLIENT_ID,
                    client_secret: GOOGLE_DESKTOP_CLIENT_SECRET,
                    client_redirect_uri: redirect_uri
                  }
                : {}
            ),
            ...(GOOGLE_DESKTOP_CLIENT_KEYFILE_CONTENTS
                ? { appType:'desktop', keyFileContents: GOOGLE_DESKTOP_CLIENT_KEYFILE_CONTENTS }
                : {}
            ),
            ...(GOOGLE_DESKTOP_CLIENT_KEYFILE_PATH
                ? { appType:'desktop', keyFilePath:  GOOGLE_DESKTOP_CLIENT_KEYFILE_PATH }
                : {}
            )
          }
        }
      )
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
  let setTo = bot_local_memory[req.session.id] ?? { chatbot };
  bot_local_memory[req.session.id] = setTo;

  res.send({
    status: 200,
    name: "LangDrive",
    avatarURL: "https://i.imgur.com/vphoLPW.png"
  });
});

//
// Load up the bot and have it give a welcome message based on the history.
//
app.get("/bot_welcome*", async (req, res) => {
  let sess = bot_local_memory[req.session.id];
  let prompt = `\n The user has entered the chat. Greet the user.\n`;
  console.log('\nSending Welcome Message to Chatbot...\n')
  res.send({
    avatarURL: "https://i.imgur.com/vphoLPW.png",
    response: await sess.chatbot.sendMessage(prompt)
  });
});

//
// Continue the chat once a user responds to the bot_welcome
//
app.get("/qa*", async (req, res) => {
  console.log(`\nSending QA Message to Chatbot...\n`)
  res.send({ response: await bot_local_memory[req.session.id].chatbot.sendMessage(req.query.user_query) });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// example
app.get("/client_side_auth", (req, res) => res.sendFile(__dirname + "/client/client_side_auth.html"));

// passport check
app.get("/user", checkAccessToken, (req, res) => {
  return { session: req.session, user: req.user };
});
