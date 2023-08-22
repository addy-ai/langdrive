const https = require("https");
const passport = require("passport");
const express = require("express");
const session = require("express-session");
var SQLiteStore = require("connect-sqlite3")(session);

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
    secret: "session-secret-key-addy-ai",
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
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
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

app.get("/auth/google", (req, res) => {
  const authQuery = querystring.stringify({
    redirect_uri: "http://localhost:3000/auth/google/callback",
    prompt: "consent",
    response_type: "code",
    client_id: CLIENT_ID,
    scope: "https://www.googleapis.com/auth/drive",
    access_type: "offline"
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authQuery}`;
  res.redirect(authUrl);
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      querystring.stringify({
        code: code,
        redirect_uri: "http://localhost:3000/auth/google/callback",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code"
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    req.session.access_token = data.access_token;
    req.session.refresh_token = data.refresh_token;
    req.session.timestamp = new Date().toISOString();
    res.redirect("/chat");
  } catch (error) {
    console.error("Error fetching tokens", error);
    res.status(500).send("Error during authentication");
  }
});
async function refreshToken(refresh_token) {
  try {
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      querystring.stringify({
        client_secret: CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refresh_token,
        client_id: CLIENT_ID
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    return data.access_token;
  } catch (error) {
    console.error("Error refreshing token", error);
    throw error;
  }
}

async function checkAccessToken(req, res, next) {
  if (!req.session.access_token) {
    return res.redirect("/auth/google");
    // return res.status(401).send("No access token found. Please authenticate.");
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 10); // 60 minutes * 60 seconds * 1000 milliseconds = 1 hour
  const sessionTimestamp = new Date(req.session.timestamp);

  if (sessionTimestamp < oneHourAgo) {
    try {
      // If the token is expired, try to refresh it
      const newAccessToken = await refreshToken(req.session.refresh_token);
      req.session.access_token = newAccessToken;
      req.session.timestamp = new Date();
    } catch (error) {
      req.session.access_token = null;
      return res.redirect("/auth/google");
      // return res.status(401).send("Error refreshing access token. Please re-authenticate.");
    }
  }
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
  // console.log("INIT CHATBOT");
  ACCESS_TOKEN = req.session.access_token;
  let chatbot = new Chatbot({
    model_config: {
      // modelName: "gpt-3.5-turbo", // default = "text-davinci-003"
      // maxTokens: 256, // default = 256
      openAIApiKey: OPENAI_API_KEY,
      huggingFaceApiKey: HUGGINGFACE_API_KEY
      // temperature: 0.9
    },
    CLIENT_ID,
    CLIENT_SECRET,
    ACCESS_TOKEN,
    memory_length: 2,
    vector_length: 2,
    agent: "chat-conversational-react-description",
    agent_config: {},
    verbose: true,
    agent_verbose: false,
    tools: []
  });
  bot_local_memory[req.session.id] = bot_local_memory[req.session.id] || { chatbot };

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
  let prompt = `The user has entered the chat. Greet the user.`;
  res.send({
    avatarURL: "https://i.imgur.com/vphoLPW.png",
    response: await bot_local_memory[req.session.id].chatbot.sendMessage(prompt)
  });
});

//
// Continue the chat once a user responds to the bot_welcome
//
app.get("/qa*", async (req, res) => {
  res.send({ response: await bot_local_memory[req.session.id].chatbot.sendMessage(req.query.user_query) });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// example
app.get("/client_side_auth", (req, res) => res.sendFile(__dirname + "/client/client_side_auth.html"));

// passport check
app.get("/user", checkAccessToken, (req, res) => {
  return { session: req.session, user: req.user };
});
