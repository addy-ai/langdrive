const { google } = require('googleapis');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();
const port = 3000;
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user (required for session support)
passport.serializeUser((user, done) => { done(null, user);});
passport.deserializeUser((user, done) => { done(null, user);});

// Replace these values with your own client ID and client secret
const CLIENT_ID = '284266859441-og9mvpg4po3edrunad6gf233b0p22t0j.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
passport.use(
  new GoogleStrategy(
    { clientID: CLIENT_ID, clientSecret: CLIENT_SECRET, callbackURL: '/auth/google/callback' },
    (accessToken, refreshToken, profile, done) => {
      // Here, you can access the user's Google profile data.
      // You can save it to a database or perform other actions as needed.
      return done(null, profile);
    }
  ) 
);

// Route to start the OAuth 2.0 flow
const scope = ['profile', 'email', 'https://www.googleapis.com/auth/drive.file']
app.get('/auth/google', passport.authenticate('google', { scope }) );

// Callback route after Google redirects back
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log('req.query.code', req.query.code)
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
       
      // Log the authorization code to console (for debugging)
      console.log('Authorization Code:', req.query.code);  
      const accessToken = req.query.code; 
      oauth2Client.setCredentials({ access_token: accessToken }); 
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      // list the user's files
      const response = await drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(name, id)',
      });

      const files = response.data.files;
      // Send the user's profile information and file list as a response
      res.send('You are now logged in.' + JSON.stringify(req.user) + JSON.stringify(files));
    } catch (error) {
      console.error('Error accessing Google Drive:', error.message);
      console.error('Error details:', error);
      res.status(500).send('Error accessing Google Drive.');
    }
  }
);

 
app.get('/test', (req, res) => { res.sendFile(__dirname + '/index.html') })
app.get('/user', (req, res) => { req.isAuthenticated()? res.send(req.user): res.send('Not logged in.') });
app.listen(port, () => { console.log(`Server running on http://localhost:${port}`); });




// https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow

// Successful authentication, redirect to a different page or handle as needed. 
// ["_readableState","_events","_eventsCount","_maxListeners","socket","httpVersionMajor",
// "httpVersionMinor","httpVersion","complete","rawHeaders","rawTrailers","aborted","upgrade",
// "url","method","statusCode","statusMessage","client","_consuming","_dumped","next","baseUrl",
// "originalUrl","_parsedUrl","params","query","res","_parsedOriginalUrl","sessionStore","sessionID",
// "session","logIn","login","logOut","logout","isAuthenticated","isUnauthenticated","_sessionManager",
// "_passport","route","user","authInfo"]