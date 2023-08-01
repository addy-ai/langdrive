const express = require('express');
const passport = require('passport');
const session = require('express-session');
const serverUtils = require('./server_utils');

const app = express();
const port = 3000;
app.use(session({ secret: 'session-secret-key-addy-ai', resave: false, saveUninitialized: false }));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user (required for session support)
passport.serializeUser((user, done) => { done(null, user);});
passport.deserializeUser((user, done) => { done(null, user);});

// Replace these values with your own client ID and client secret
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
serverUtils.setupGoogleStrategy(CLIENT_ID, CLIENT_SECRET);

// Route to start the OAuth 2.0 flow
const scope = ['profile', 'email', 'https://www.googleapis.com/auth/drive.file']
app.get('/auth/google', passport.authenticate('google', { scope }) );

// Callback route after Google redirects back
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  serverUtils.handleGoogleCallback
);

app.get('/test', (req, res) => { res.sendFile(__dirname + '../client/index.html') })
app.get('/chat'), (req, res) => { res.sendFile(__dirname + '../client/chatbot.html')}
app.get('/user', (req, res) => { req.isAuthenticated()? res.send(req.user): res.send('Not logged in.') });
app.listen(port, () => { console.log(`Server running on http://localhost:${port}`); });
