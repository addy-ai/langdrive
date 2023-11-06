const { google } = require("googleapis");

async function initializeAuth() {
  const auth = new google.auth.GoogleAuth({
    keyFilename: "C:\\Users\\Carlos\\Documents\\GitHub\\drive\\src/../google_service_credentials.json",
    scopes: ["https://www.googleapis.com/auth/drive"]
  });
  console.log({ auth });

  try {
    const client = await auth.getClient();
    const drive = google.drive({ version: "v3", auth: client });

    // Now that we have authenticated, let's list the files
    listFilez(drive);
  } catch (error) {
    console.error("Error initializing auth:", error);
  }
}

async function listFilez(drive) {
  try {
    const response = await drive.files.list({
      pageSize: 10, // List 10 files. You can adjust this.
      fields: "nextPageToken, files(id, name)"
    });
    const files = response.data.files;
    if (files.length) {
      console.log("Files:");
      files.map(file => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log("No files found.");
    }
  } catch (error) {
    console.error("Error listing files:", error);
  }
}

initializeAuth();
