const { google } = require("googleapis");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const fs = require("fs");

function setupGoogleStrategy(CLIENT_ID, CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        // Here, you can access the user's Google profile data.
        // You can save it to a database or perform other actions as needed.
        return done(null, profile);
      }
    )
  );
}

async function handleGoogleCallback(req, res) {
  try {
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
    console.log(
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
    console.log("req.query.code", req.query.code);
    console.log(
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    );

    // Log the authorization code to console (for debugging)
    console.log("Authorization Code:", req.query.code);
    const accessToken = req.query.code;
    oauth2Client.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // list the user's files
    const response = await drive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(name, id)",
    });

    const files = response.data.files;
    // Send the user's profile information and file list as a response
    res.send(
      "You are now logged in." +
        JSON.stringify(req.user) +
        JSON.stringify(files)
    );
  } catch (error) {
    console.error("Error accessing Google Drive:", error.message);
    console.error("Error details:", error);
    res.status(500).send("Error accessing Google Drive.");
  }
}

// Function to create a new file in the specified folder
async function createFileInFolder(auth, folderId, fileName, fileContent) {
  const drive = google.drive({ version: "v3", auth });

  try {
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
      mimeType: "text/plain", // Change the mime type based on your file type
    };

    const media = {
      mimeType: "text/plain", // Change the mime type based on your file type
      body: fileContent,
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    console.log("File created with ID:", response.data.id);
  } catch (error) {
    console.error("Error creating file:", error.message);
  }
}

// Function to get the folder ID of the specified folder path
async function getFolderId(auth, folderPath) {
  const drive = google.drive({ version: "v3", auth });

  try {
    const response = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderPath}'`,
      fields: "files(id)",
    });

    if (response.data.files.length > 0) {
      return response.data.files[0].id;
    } else {
      console.error("Folder not found.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving folder ID:", error.message);
    return null;
  }
}

// Function to initialize the Google Drive API
function initGoogleDriveAPI() {
  gapi.load("client:auth2", () => {
    gapi.client
      .init({
        apiKey: "YOUR_API_KEY",
        clientId: "YOUR_CLIENT_ID",
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
        ],
        scope: "https://www.googleapis.com/auth/drive.readonly",
      })
      .then(() => {
        driveApi = gapi.client.drive;
      });
  });
}

// Function to retrieve the SQLite file from Google Drive
function getSQLiteFile(fileId) {
  if (!driveApi) {
    console.error("Google Drive API not initialized.");
    return;
  }

  driveApi.files
    .get({ fileId: fileId, alt: "media" })
    .then((response) => {
      const sqliteData = response.body;
      // Process the SQLite file data here
      console.log(sqliteData);
    })
    .catch((error) => {
      console.error("Error retrieving SQLite file:", error);
    });
}

// Function to download the file from Google Drive
function downloadSQLiteFile(fileId, filename) {
  if (!driveApi) {
    console.error("Google Drive API not initialized.");
    return;
  }

  driveApi.files
    .get({ fileId: fileId, alt: "media" })
    .then((response) => {
      const sqliteData = response.body;
      const blob = new Blob([sqliteData], { type: "application/octet-stream" });

      // Create an anchor element to trigger the download
      const anchor = document.createElement("a");
      anchor.href = URL.createObjectURL(blob);
      anchor.download = filename;

      // Trigger the download by clicking the anchor element
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    })
    .catch((error) => {
      console.error("Error downloading SQLite file:", error);
    });
}

// Function to retrieve the SQLite file from Google Drive using the filename
function getSQLiteFileByName(filename) {
  if (!driveApi) {
    console.error("Google Drive API not initialized.");
    return;
  }

  // Search for the file with the given filename in the user's Google Drive
  driveApi.files
    .list({
      q: `name='${filename}'`,
      fields: "files(id)",
      pageSize: 1,
    })
    .then((response) => {
      const files = response.result.files;
      if (files.length > 0) {
        const fileId = files[0].id;
        getSQLiteFile(fileId);
      } else {
        console.error(`File '${filename}' not found in Google Drive.`);
      }
    })
    .catch((error) => {
      console.error("Error retrieving SQLite file by filename:", error);
    });
}

module.exports = {
  getFolderId,
  createFileInFolder,
  setupGoogleStrategy,
  handleGoogleCallback,
};
