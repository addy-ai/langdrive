const { google } = require("googleapis");

class DriveUtils {
  constructor(CLIENT_ID, CLIENT_SECRET, OBJ) {
    this.CLIENT_ID = CLIENT_ID;
    this.CLIENT_SECRET = CLIENT_SECRET;
    this.access_token = OBJ.ACCESS_TOKEN;
    this.oauth2Client = new google.auth.OAuth2(this.CLIENT_ID, this.CLIENT_SECRET);
    this.verbose = OBJ.verbose;
  }

  async getDrive() {
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ CONNECTING TO DRIVE ~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    */
    const accessToken = this.access_token;
    if (!this.access_token) {
      return false; // res.status(401).send("Access token missing or expired.");
    }
    this.oauth2Client.setCredentials({ access_token: this.access_token });
    return google.drive({ version: "v3", auth: this.oauth2Client });
  }

  async listFiles(mimeType) {
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ LIST DRIVE FILES ~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", {mimeType});
    */
    let type = `mimeType='${mimeType}'`;
    try {
      const drive = await this.getDrive();
      const textFiles = [];
      const response = await drive.files.list({
        // q: "mimeType='text/plain'",
        q: mimeType ? type : "",
        fields: "nextPageToken, files(id, name)",
        spaces: "drive"
      });
      return { status: 200, message: "Found Files.", data: response.data };
    } catch {
      console.log("ERROR", error);
      return { status: 400, message: "Unable to List Files for" + mimeType, data: false };
    }
  }

  async getFileInfo(filename, mimeType) {
    /*
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("~~~~~~~~~ Get json File In Drive ~~~~~~~~~~~~~~~~~~~~~~");
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", { filename, mimeType });
    */
    let error = {
      status: 400,
      data: false,
      message: "Unable to getFileInfo for: " + filename + " Of Type: " + mimeType
    };
    try {
      const textFiles = [];
      const response = await this.listFiles(mimeType);
      if (response.status == 400) return error;
      textFiles.push(...response.data.files);
      return { status: 200, message: "Found Files.", data: textFiles.find(file => file.name === filename) };
    } catch {
      console.log("ERROR", error);
      return error;
    }
  }

  async getFileById(fileId) {
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ Get Files By ID ~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", {fileId});
    */
    let error = { status: 400, data: false, message: "Unable to getFileById: " + fileId };
    try {
      const drive = await this.getDrive();
      const response = await drive.files.get({ fileId, alt: "media" });
      return { status: 200, message: "Got File by ID.", data: response.data };
    } catch {
      console.log("ERROR getFileById:", error);
      return error;
    }
  }

  async getFileByName(filename, mimeType = false) {
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ Get File by Name ~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", {fileId, mimeType});
    */
    let error = { status: 400, data: false, message: "Unable to getFileById: " + fileId };
    try {
      let type = mimeType && `mimeType='${mimeType}'`;

      console.log("getFileByName", filename, mimeType);
      // console.log("getFileByName", filename, mimeType);
      let response = await this.getFileInfo(filename, type).data;
      if (response.status == 400) return error;
      response = this.getFileById(exists.id);
      if (response.status == 400) return error;
      return { status: 200, message: "Got File by ID.", data: file.data };
    } catch {
      console.log("ERROR getFileByName:", error);
      return error;
    }
  }

  async createFile(filename, mimeType, message) {
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ create File In Drive ~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", {filename, mimeType, message});
    */
    try {
      const drive = await this.getDrive();
      const response = await drive.files.create({
        resource: { name: filename },
        media: { mimeType, body: message },
        fields: "id"
      });
      return { status: 200, message: "Got File by ID.", data: file.data };
    } catch {
      console.log("ERROR createFile:", error);
      return { status: 400, data: false, message: "Unable to createFile: " + filename };
    }
  }

  async createAndOrGetFile(filename, mimeType, message) {
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~ Create and or Get File In Drive ~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    */
    let error = { status: 400, data: false, message: "Unable to createFile: " + filename };
    try {
      let response = await this.getFileInfo(filename, mimeType);

      let metaData =
        response.status == 200
          ? { status: 200, message: "File already exists.", data: response.data }
          : await this.createFile(filename, mimeType, message);
      if (metaData.status == 400) return error;

      let file = await this.getFileById(metaData.data.id);
      if (file.status == 400) return error;

      return { status: 200, message: "Got File by ID.", data: { file: file.data, metadata: metaData.data } };
    } catch {
      console.log("ERROR createAndOrGetFile:", error);
      return error;
    }
  }

  async updateFile(fileId, mimeType, message) {
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~ Update File In Drive by ID ~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    */
    const drive = await this.getDrive();
    try {
      const response = await drive.files.update({
        fileId,
        media: { mimeType, body: message },
        fields: "id"
      });
      return { status: 200, message: "Success", data: response.data };
    } catch {
      return { status: 400, data: false, message: "Unable to updateFile: " + fileId };
    }
  }
}
module.exports = DriveUtils;

/*
  - getDrive
  - getDrive <- listFiles
  - getDrive <- listFiles <- getFileInfo
  - getDrive <- getFileById
  - getDrive <- getFileById <= getDrive <- listFiles <- getFileInfo <= getFileByName
  - getDrive <- createFile
  - getDrive <- getFileById <= getDrive <- createFile <- getFileInfo <= createAndOrGetFile
  - getDrive <- updateFile
*/
