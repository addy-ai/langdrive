const { google } = require("googleapis");

class DriveUtils {
  constructor(CLIENT_ID, CLIENT_SECRET) {
    this.CLIENT_ID = CLIENT_ID;
    this.CLIENT_SECRET = CLIENT_SECRET;
    this.oauth2Client = new google.auth.OAuth2(
      this.CLIENT_ID,
      this.CLIENT_SECRET
    );
  }

  async getDrive(req) {
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ CONNECTING TO DRIVE ~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    */
    const accessToken = req.user.accessToken;
    // console.log("Access Token: ", accessToken);
    if (!accessToken) {
      return res.status(401).send("Access token missing or expired.");
    }
    this.oauth2Client.setCredentials({ access_token: accessToken });
    return google.drive({ version: "v3", auth: this.oauth2Client });
  }

  async getFileInfoInDrive(req, filename, mimeType) {
    try {
      let type = `mimeType='${mimeType}'`;
      /*
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("~~~~~~~~~ Get json File In Drive ~~~~~~~~~~~~~~~~~~~~~~");
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", mimeType);
      */
      const drive = await this.getDrive(req);
      //console.log({ drive });
      const textFiles = [];
      const response = await drive.files.list({
        // q: "mimeType='text/plain'",
        q: type,
        fields: "nextPageToken, files(id, name)",
        spaces: "drive",
      });
      /*console.log("Found all these JSON files : ", response.data);*/
      textFiles.push(...response.data.files);
      return textFiles.find((file) => file.name === filename);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getFileInDrive(req, fileId) {
    try {
      const drive = await this.getDrive(req);
      const response = await drive.files.get({
        fileId,
        alt: "media",
      });
      return response.data;
    } catch (error) {
      console.error("Error getting the file:", error);
      return null;
    }
  }

  async createFileInDrive(req, filename, mimeType, message) {
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ create File In Drive ~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    */
    const exists = await this.getFileInfoInDrive(req, filename, mimeType);
    if (exists)
      return { status: 400, message: "File already exists.", data: exists };
    const drive = await this.getDrive(req);
    const response = await drive.files.create({
      resource: { name: filename },
      media: { mimeType, body: message },
      fields: "id",
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
    });
    return { status: 200, message: "File created.", data: response.data };
  }
}

module.exports = DriveUtils;
