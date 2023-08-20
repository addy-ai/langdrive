const { google } = require("googleapis");

class DriveUtils {
  constructor(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN) {
    this.CLIENT_ID = CLIENT_ID;
    this.CLIENT_SECRET = CLIENT_SECRET;
    this.access_token = ACCESS_TOKEN;
    this.oauth2Client = new google.auth.OAuth2(this.CLIENT_ID, this.CLIENT_SECRET);
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
    let type = `mimeType='${mimeType}'`;
    const drive = await this.getDrive();
    const textFiles = [];
    const response = await drive.files.list({
      // q: "mimeType='text/plain'",
      q: mimeType ? type : "",
      fields: "nextPageToken, files(id, name)",
      spaces: "drive"
    });
    //let filenames = textFiles.push(...response.data.files);
    //filenames =  textFiles.map(file => file.name);
    //console.log("Found all these JSON files : ", filenames);
    return { status: 200, message: "Found Files.", data: response.data };
  }

  async getFileInfo(filename, mimeType) {
    try {
      /*
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("~~~~~~~~~ Get json File In Drive ~~~~~~~~~~~~~~~~~~~~~~");
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", mimeType);
      */
      const drive = await this.getDrive();
      const textFiles = [];
      const response = await this.listFiles(mimeType);
      textFiles.push(...response.data.files);
      return textFiles.find(file => file.name === filename);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getFileById(fileId) {
    try {
      const drive = await this.getDrive();
      const response = await drive.files.get({
        fileId,
        alt: "media"
      });
      return response.data;
    } catch (error) {
      console.error("Error getting the file:", error);
      return null;
    }
  }

  async getFileByName(filename, mimeType = false) {
    try {
      let type = mimeType && `mimeType='${mimeType}'`;

      console.log("getFileByName", filename, mimeType);
      // console.log("getFileByName", filename, mimeType);
      const exists = await this.getFileInfo(filename, type);
      if (!exists) return { status: 400, message: "File does not exist.", data: false };
      console.log("exists", exists);
      return this.getFileById(exists.id);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async createFile(filename, mimeType, message) {
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ create File In Drive ~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    */
    //console.log("CREATEing file");
    const drive = await this.getDrive();
    const response = await drive.files.create({
      resource: { name: filename },
      media: { mimeType, body: message },
      fields: "id"
    });
    return { status: 200, message: "File created.", data: response.data };
  }

  async createAndOrGetFile(filename, mimeType, message) {
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~ Create and or Get File In Drive ~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    */
    const exists = await this.getFileInfo(filename, mimeType); // returns: {id, name}
    let metaData = exists
      ? { status: 400, message: "File already exists.", data: exists }
      : await this.createFile(filename, mimeType, message);
    // console.log("~~~ Chat History File: ", metaData);
    let file = await this.getFileById(metaData.data.id);
    // console.log("~~~ Chat History: ", file);
    return { content: file, metaData };
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
      return response.data;
    } catch (error) {
      console.error("Error updating the file:", error);
      return null;
    }
  }
}
module.exports = DriveUtils;
