const https = require("https");
const passport = require("passport");
const express = require("express");
const session = require("express-session");
var SQLiteStore = require("connect-sqlite3")(session);
// https://stackoverflow.com/questions/69253707/cookies-not-storing-in-browser-when-using-passport-with-express
// If secure is set true, and your request to the server is sent over HTTP, the cookie will not be saved in the browser.
// Secure attribute must be set to true secure: true when the SameSite attribute has been set to 'none'
const app = express();
// We store the conversational chains memory in local storage so it can be retrieved fast.
// { userid: {chainid: memory}}
let bot_local_memory = {};

/*
// create an annonymous function and run it. 
import("@xenova/transformers").then(
  async ({ AutoTokenizer, AutoModelForSeq2SeqLM, env }) => {
    env.localModelPath = `.`; // Set to current directory
    env.allowRemoteModels = false; // Disable pulling from HF
    let tokenizer = await AutoTokenizer.from_pretrained("t5-small");
    let model = await AutoModelForSeq2SeqLM.from_pretrained("t5-small"); // Xenova/t5-small

    let { input_ids } = await tokenizer(
      "translate English to German: I love transformers!"
    );
    let outputs = await model.generate(input_ids);
    let decoded = tokenizer.decode(outputs[0], { skip_special_tokens: true });
    // console.log({ outputs });
    console.log({ decoded }); // 'Ich liebe Transformatoren!'

    pipeline = pipeline(
      "text2text-generation",
      (model = model),
      (tokenizer = tokenizer),
      (max_length = 128)
    );
    hf_llm = HuggingFacePipeline((pipeline = pipeline));
  }
); 
*/
/*
(async () => { 
})();*/

app.use(
  session({
    secret: "session-secret-key-addy-ai",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: new SQLiteStore({
      db: "sessions.db",
      table: "sessions",
      dir: ".",
    }),
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Serve static files for client
const publicDirectoryPath = __dirname + "/client";
app.use(express.static(publicDirectoryPath));

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});

require("dotenv").config();
const DriveUtils = require("./server/drive_utils");
const Chatbot = require("./server/drive_chatbot.js");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const driveUtils = new DriveUtils(CLIENT_ID, CLIENT_SECRET);

console.log("STARTING CHATBOT");
let test_bot = new Chatbot({});
console.log("TESTBOT CREATED");
(async () => {
  console.log("TESTBOT CREATED");
})();

app.get("/", async (req, res) => {
  const response = await test_bot.sendMessage(
    "System Prompt: You are a conversational chatbot that integrates with google chatbot. A user has either just started or re-entered a conversation with you. Say hello using whatever context available:"
  );
  console.log(
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
  );
  console.log(response);
  res.send(`<h1>Welcome</h1><br> \ 
  <a href='./client_side_auth'>client_side_auth</a><br> \
  <a href='./chat'>chat</a><br> \
  <a href='./user'>user check</a><br> \ 
  `);
});

let scope = ["profile", "email", "https://www.googleapis.com/auth/drive.file"];
app.get(
  "/chat",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    passport.authenticate("google", { scope })(req, res, next);
  },
  (req, res) => res.sendFile(__dirname + "/client/chatbot.html")
);

const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: "/chat",
      passReqToCallback: true,
      accessType: "offline",
      approvalPrompt: "force",
    },
    (req, accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      // req.session.save();
      return done(null, profile);
    }
  )
);

app.get("/bot_init", async (req, res) => {
  console.log("~~~~~~~~~~~~ START bot_init."); // is authed?", req.isAuthenticated());
  // Check and create. return id
  let response = await driveUtils.createFileInDrive(
    req,
    "chatbot.json",
    "application/json", // "text/plain",
    `{"message":"Hello, this is the content of the file."}`
  );
  // if (response.status == 400) console.log("FILE ALREADY EXISTS");

  let file = await driveUtils.getFileInDrive(req, response.data.id);
  // console.log({ file });
  // console.log({ message: file.message });
  bot_local_memory[req.user.id] = bot_local_memory[req.user.id] || {
    chatbot_file_id: response.data.id,
    chatbot_message_history: file,
  };
  let user = bot_local_memory[req.user.id];
  console.log("~~~~~~~~~~~~ END bot_init OVERWRITE ? ", Object.keys(user));

  //
  res.send(
    req.isAuthenticated()
      ? {
          status: 200,
          name: req.user._json.name + "'s Assistant",
          avatarURL: "https://i.imgur.com/vphoLPW.png",
        }
      : { status: 400, message: "User not Authenticated" }
  );
});

// Load up the bot and have it give a welcome message based on the history.
app.get("/bot_welcome*", async (req, res) => {
  console.log("~~~~~~~~~~~~~~~~ START bot_welcome");
  let user = bot_local_memory[req.user.id];
  console.log("OVERWRITE ? ", Object.keys(user));
  let chatbot = user.chatbot || new Chatbot({ OPENAI_API_KEY });
  bot_local_memory[req.user.id].chatbot = chatbot;

  const response = await chatbot.sendMessage(
    "System Prompt: You are a conversational chatbot that integrates with google chatbot. A user has either just started or re-entered a conversation with you. Say hello using whatever context available:"
  );
  // in no particular order
  // TODO: CREATE A LLAMA NOT OPEN AI CHATBOT.
  // TODO: USE THE FILE AS THE CONVERSATIONAL MEMORY.
  // TODO: CREATE AN EMBEDDINGS FILE AND DO SOMETHING WITH IT.
  // TODO: CREATE A SPECIAL WELCOME MESSAGE LANGCHAIN PROMPT

  // 1. CREATE A LANGHCAIN CONVERSATIONAL BOT W MESSAGE MEMORY
  // 2. DOWNLOAD THEN SERIALIZE/ DESERIALIZE BACK AND FORTH TO JSON.
  // GRAB LOCAL MEMORY USING USER ID.
  // UPLOAD IT TO CHAIN. GET RESPONSE.
  // STORE LANGCHAIN MESSAGE MEMORY TO LOCAL MEMORY.
  // UPLOAD TO DRIVE.

  res.send({
    response,
    avatarURL: "https://i.imgur.com/vphoLPW.png",
  });
});

// Continue the chat
app.get("/qa*", async (req, res) => {
  console.log("~~~~~~~~~~~~~~~~ START qa");
  let user = bot_local_memory[req.user.id];
  console.log("OVERWRITE 123 ? ", Object.keys(user));
  const chatbot = user.chatbot;
  const response = await chatbot.sendMessage(req.query.user_query);
  console.log("Chatbot's response:", response);
  res.send({ response: response });
});
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// example
app.get("/client_side_auth", (req, res) => {
  res.sendFile(__dirname + "/client/client_side_auth.html");
});

// passport check
app.get("/user", (req, res) => {
  console.log("~~~~~~~~~~~~~~~~ START user"); //, req.isAuthenticated());
  res.send(
    req.isAuthenticated()
      ? { session: req.session, user: req.user }
      : "User not Authenticated"
  );
});

// passport check
app.get("/create", (req, res, CLIENT_ID, CLIENT_SECRET) => {
  passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.send(
        req.isAuthenticated() ? { user: req.user, query: req.query } : "log in"
      );
      driveUtils.createFile(req, res, CLIENT_ID, CLIENT_SECRET, GOOGLE_API_KEY);
    };
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
