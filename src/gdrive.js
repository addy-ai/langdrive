const { google } = require("googleapis");
const { authenticate } = require("@google-cloud/local-auth");
const querystring = require("querystring");
const axios = require("axios"); 

const fs = require("fs").promises;
const path = require("path");
const process = require("process");
/*
else if(this.appType === "web") {
  client = new google.auth.OAuth2(
    this.client_id,
    this.client_secret,
    this.redirect_uri
  );
  client.setCredentials({ access_token: this.access_token });
}
*/
// google.auth.fromJSON(credentials);
// await authenticate({ scopes: this.scopes, keyfilePath: this.keyFilePath }); -> We need this one.

class DriveUtils {
  constructor(props) {
    this.verbose = props.verbose;
    this.appType = props.appType || 'false';
    this.client_id = props.client_id;
    this.client_secret = props.client_secret;
    this.redirect_uri = this.scopes = props.scopes;
    this.keyFilePath = props.keyFilePath || path.resolve() + `/google_${this.appType}_credentials.json` 
    this.keyFileContents = props.keyFileContents
    this.tokenFilePath = props.tokenFilePath || path.resolve() + `/google_${this.appType}_token.json`
    this.access_token = props.access_token; 
    this.oauth2Client = (async () => {
      let errormsg = `Drive: ${this.appType} ERROR: DriveUtils: Unable to Authetnicate Drive. `;
      let client = false;
      let auth;
      try { 
        this.verbose && console.log(`Drive: ${this.appType}: Auth: START`);
        if (this.appType === "server") {
          if (this.keyFile) { auth = new google.auth.GoogleAuth({ keyFile: this.keyFile, scopes: this.scopes });} 
          else if (this.keyFileContents) { auth = new google.auth.GoogleAuth({ credentials: JSON.parse(this.keyFileContents), scopes: this.scopes });  } 
          else { throw new Error('Drive: Either keyFile or keyFileContents must be provided');}
          // credentials = require(this.keyFile) 
          // auth = google.auth.fromJSON(credentials) 
        }   
        if (this.appType === "desktop") {
          // When using a keyfile or keyFileContents, 
          // We actually need to perfrom the auth and save the resulting token to a file
          // First we check if the token file exists 
          let tokenExists = await fs.access(this.tokenFilePath).then(() => true).catch(() => false);
          if(tokenExists){
            // If the token exists, use it!
            this.verbose && console.log(`Drive: ${this.appType}: Auth: TokenFile EXISTS`)
            const content = await fs.readFile(this.tokenFilePath);
            const credentials = JSON.parse(content);
            client =  google.auth.fromJSON(credentials);
          }
          else {   
            // If the token does not exist, we need to authenticate and save the token to a file
            this.verbose && console.log(`Drive: ${this.appType}: Auth: NO TokenFile`)
            let keyFileExists = await fs.access(this.keyFilePath).then(() => true).catch(() => false);
            if( this.keyFileContents && !keyFileExists ){
              await fs.writeFile(this.keyFilePath, this.keyFileContents);
            }
            client = await authenticate({
              scopes: this.scopes,
              keyfilePath: this.keyFilePath
            }); 
            if (client.credentials) { 
              this.verbose && console.log(`Drive: ${this.appType}: Auth: START`)
              // Save the file as a token file.
              const content = await fs.readFile(this.keyFilePath);
              const keys = JSON.parse(content);
              const key = keys.installed || keys.web;
              const payload = JSON.stringify({
                type: "authorized_user",
                client_id: key.client_id,
                client_secret: key.client_secret,
                refresh_token: client.credentials.refresh_token
              });
              this.verbose && console.log(`Drive: ${this.appType}: Auth: SAVING TokenFile`) 
              await fs.writeFile( this.tokenFilePath , payload);
            }
          }  
        } 
        else if(this.appType === "web") {
          client = new google.auth.OAuth2(
            this.client_id,
            this.client_secret,
            this.redirect_uri
          );
          client.setCredentials({ access_token: this.access_token });
        }
        else { this.verbose && console.log(`Drive: ${this.appType}: MISSING INFO: `, errormsg); } 
        this.verbose && console.log(`Drive: ${this.appType}: Auth: SUCCESS`);
        return client;
      } catch (error) { this.verbose && console.log(`Drive: ${this.appType}: TECHNICAL: `, errormsg, ": ", error); }
    })();
  }

  async getDrive() {
    this.drive = this.drive || google.drive({ version: "v3", auth: await this.oauth2Client });
  }
  async listFilez() {
    await this.getDrive();
    try {
      const response = await this.drive.files.list({
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
        console.log(`Drive: ${this.appType}: listFilez: No files found.`);
      }
    } catch (error) {
      console.error(`Drive: ${this.appType}: listFilez: Error listing files:`, error);
    }
  }

  // Lists all of <name> <mimeType> within a <directory or directoryId>
  async listFiles(props) {
    await this.getDrive();
    let { directory, directoryId, mimeType, filename, name, fields, spaces, orderBy, pageSize, additional, q } = props;
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ LIST DRIVE FILES ~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", { mimeType });
    */
    let prompt = [];

    // Filter Searchy By MimeType
    let type = mimeType ? `mimeType='${mimeType}'` : null;
    if (type) prompt.push(type);

    // Filter Search By Directory Id/ Name
    if (!directoryId && directory) {
      this.verbose && console.log(`${this.appType} LIST FILES IS CALLING LIST DIRECTORIES WITH NO PARAMS`);
      let dirs = (await this.listDirectories({})).data.files;
      let matchedDir = dirs.find(dir => dir.name === props.directory);
      if (matchedDir) directoryId = matchedDir.id;
    }
    if (directoryId) prompt.push(`'${directoryId}' in parents`);

    if (name) prompt.push(`name='${name}'`);
    else if (filename) prompt.push(`name='${filename}'`);

    if (additional) prompt.push(additional);
    prompt = prompt.length ? prompt.join(" and ") : null;

    let error = { status: 400, message: "Unable to List Files for " + mimeType, data: false };
    q = !!q ? q : prompt;
    try {
      let passThese = {
        ...(!!q ? { q } : {}),
        ...(!!pageSize ? { pageSize } : {}),
        fields: !!fields ? fields : "nextPageToken, files(id, name)",
        spaces: !!spaces ? spaces : "drive",
        orderBy: !!orderBy ? orderBy : "folder,modifiedTime desc,name"
      };
      // this.verbose && console.log("\n\n Drive_utils: listFiles: ", { passThese });
      const response = await this.drive.files.list(passThese);
      if (response.status == 400) return error;
      return { status: 200, message: "Found Files.", data: response.data };
    } catch (err) {
      this.verbose &&
        console.log(
          `\n\n ${this.appType} ERROR: listFiles CALLING GOOGLEAPI: \n PROPS: `,
          props,
          ", \n RETURNING: ",
          error,
          ", \n ERROR: ",
          err
        );
      return error;
    }
  }

  // Lists all directories/ all within a directory
  async listDirectories(props) {
    let { directory, directoryId } = props;
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ LIST DRIVE DIRECTORIES ~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", { mimeType });
    */
    try {
      const response = await this.listFiles({
        mimeType: "application/vnd.google-apps.folder",
        additional: "'me' in owners",
        fields: "nextPageToken, files(parents, id, name)",
        ...props
      });
      if (response.status == 400) return error;
      return { status: 200, message: "Found Directories.", data: response.data };
    } catch (err) {
      this.verbose && console.log(`${this.appType} DriveUtils: listDirectories: `, props, ", RETURNING: ", error, ", ERROR: ", err);
      return error;
    }
  }

  // Filters ListFiles by name. Returns 1 result.
  async getFileInfo(props) {
    let { filename, mimeType, directory, directoryId } = props;
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~ Get json File In Drive ~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", { filename, mimeType });
    */
    let error = {
      status: 400,
      data: false,
      message: `Unable to getFileInfo for: ${filename} Of Type: ${mimeType} In Directory: ${directory || directoryId}`
    };
    try {
      //// console.log("\n\n 0 - getFileInfo CALLING listFiles: ", props);
      const response = await this.listFiles(props);
      if (response.status == 400) return error;
      let data = response.data.files.find(file => file.name === filename);
      // console.log(\n\n ${this.appType} driveUtils.getFileInfo.listFiles:`, data);
      if (!data) return error;
      return { status: 200, message: "Found File.", data };
    } catch (err) {
      this.verbose &&
        console.log(`\n\n ${this.appType} ERROR: DriveUtils: getFileInfo: RECIEVED: `, props, ", RETURNING: ", error, ", ERROR: ", err);
      return error;
    }
  }

  async getFileById(props) {
    await this.getDrive();
    let { id, fileId } = props;
    id = id || fileId;
    // console.log("GET FILE BY ID", props);
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ Get Files By ID ~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", {id});
    */
    let error = { status: 400, data: false, message: "Unable to getFileById: " + id };
    if (!!!id) {
      error.message = "Unable to getFileById: No id: " + id + " nor fileId: " + fileId;
      console.log("Drive_utils: getFILEBYIID: NO ID PROVIDED");
      return error;
    }
    try {
      const drive = await this.drive;
      const response = await drive.files.get({ fileId: id, alt: "media" });
      return { status: 200, message: "Got File by ID.", data: response.data };
    } catch (err) {
      this.verbose &&
        console.log(
          `\n\n ${this.appType} ERROR: DriveUtils: getFileByName: RECIEVED: `,
          { id },
          ", RETURNING: ",
          error,
          ", ERROR: ",
          err
        );
      return error;
    }
  }

  async getFileByName(props) {
    let { filename, mimeType, directory, directoryId } = props;
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ Get File by Name ~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    */
    let error = { status: 400, data: false, message: "Unable to filename: ", filename, mimeType };
    try {
      let type = mimeType && `mimeType='${mimeType}'`;
      let response = await this.getFileInfo({ filename, type, directory, directoryId });
      if (response.status == 400) return error;
      console.log("\n\n 1 - DriveUtils: getFileByName => getFileInfo: ", response);
      response = this.getFileById({ fileId: response.data.id });
      if (response.status == 400) return error;
      return { status: 200, message: "Got File by ID.", data: file.data };
    } catch (err) {
      this.verbose &&
        console.log(
          `\n\n ${this.appType} ERROR: DriveUtils: getFileByName: RECIEVED: `,
          { filename, mimeType },
          ", RETURNING: ",
          error,
          ", ERROR: ",
          err
        );
      return error;
    }
  }

  async createFile(props) {
    await this.getDrive();
    let { filename, mimeType, message, parentId } = props;
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ create File In Drive ~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", {filename, mimeType, message});
    */
    let error = { status: 400, data: false, message: "Unable to createFile: " + filename };
    try {
      let sendThis = {
        resource: {
          name: filename,
          mimeType: mimeType,
          parents: parentId ? [parentId] : undefined
        },
        ...(!!!message ? {} : { media: { mimeType, body: message } }),
        fields: "id"
      };
      let response = await this.drive.files.create(sendThis);
      return { status: 200, message: "CREATED FILE: ", data: response.data };
    } catch (err) {
      this.verbose &&
        console.log(
          `\n\n ${this.appType} ERROR: DriveUtils: createFile: RECIEVED: `,
          { filename, mimeType, message },
          ", RETURNING: ",
          error,
          ", ERROR: ",
          err
        );
      return error;
    }
  }

  async createAndOrGetContent(props) {
    let { path, mimeType, message } = props;
    let foldrType = "application/vnd.google-apps.folder";
    mimeType = "folder" == mimeType ? foldrType : mimeType;
    const pathSegments = path.split("/");
    let currentDirectoryId = null;

    let error = {
      status: 400,
      data: false,
      message: "Unable to createAndOrGetFile: " + path
    };

    try {
      for (let i = 0; i < pathSegments.length - 1; i++) {
        // For each segment, check if the folder exists or create it
        let folderInfo = await this.getFileInfo({
          filename: pathSegments[i],
          mimeType: foldrType,
          directoryId: currentDirectoryId
        });
        if (folderInfo.status !== 200) {
          // console.log("FOLDER INFO: ", pathSegments[i], folderInfo);
          folderInfo = await this.createFile({
            filename: pathSegments[i],
            mimeType: foldrType,
            parentId: currentDirectoryId
          });
          if (folderInfo.status !== 200) return error;
        }
        currentDirectoryId = folderInfo.data.id;
      }

      const targetFilename = pathSegments[pathSegments.length - 1];

      let response = await this.getFileInfo({
        filename: targetFilename,
        mimeType,
        directoryId: currentDirectoryId
      });
      // Information about the content we want to create or get
      let metaData =
        response.status === 200
          ? { status: 200, message: "File already exists.", data: response.data }
          : await this.createFile({
              filename: targetFilename,
              mimeType,
              message,
              parentId: currentDirectoryId
            });
      if (metaData.status == 400) return error;

      // console.log("FINAL FILE PATH:", { response, metaData });

      let success = { status: 200, message: "Got File by ID.", metaData, targetFilename, currentDirectoryId };
      if (mimeType == foldrType) {
        let directoryContent = await this.listFiles({
          directoryId: metaData.data.id
        });
        if (directoryContent.status == 400) return error;
        success.data = {
          files: directoryContent.data.files,
          metadata: metaData.data
        };
      } else {
        let file = await this.getFileById({ id: metaData.data.id });
        success.data = { file: file.data, metadata: metaData.data };
        if (file.status == 400) return error;
      }
      return success;
    } catch (err) {
      this.verbose &&
        console.log(
          `\n\n ${this.appType} DriveUtils: createAndOrGetFile: RECIEVED: `,
          { path, mimeType, message },
          ", RETURNING:",
          error,
          ", ERROR: ",
          err
        );
      return error;
    }
  }

  async updateFile(props) {
    await this.getDrive();
    let { fileId, mimeType, message, id } = props;
    fileId = fileId || id;

    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~ Update File In Drive by ID ~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    */
    let error = { status: 400, data: false, message: "Unable to updateFile: " + fileId };
    if (!!!fileId) {
      error.message = "Unable to updateFile: No fileId: " + fileId + " nor id: " + id;
      console.log("Drive_utils: updateFile: NO ID PROVIDED");
      return error;
    }
    try {
      const response = await this.drive.files.update({
        fileId,
        media: { mimeType, body: message },
        fields: "id"
      });
      return { status: 200, message: "Success", data: response.data };
    } catch (err) {
      this.verbose &&
        console.log(
          `\n\n ${this.appType} DriveUtils: updateFile: RECIEVED: `,
          { fileId, mimeType, message },
          ", RETURNING: ",
          error,
          ", ERROR: ",
          err
        );
      return error;
    }
  }

  // CALLED BEFORE CREATING AN INSTANCE
  // GET THE LOGIN URL TO GET THE ACCESS TOKEN TO INITIALIZE THE CHATBOT
  static getAuthUrl = config => {
    const authQuery = querystring.stringify({
      redirect_uri: config.redirect_uri,
      prompt: "consent",
      response_type: "code",
      client_id: config.client_id,
      scope: config.scope,
      access_type: "offline"
    });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authQuery}`;
    config.verbose && console.log("getAuthUrl", authUrl);
    return authUrl;
  };

  // Handle the auth callback from Google to get the access token
  static handleAuthCallback = async config => {
    try {
      const { data } = await axios.post(
        "https://oauth2.googleapis.com/token",
        querystring.stringify({
          code: config.code,
          redirect_uri: config.redirect_uri,
          client_id: config.client_id,
          client_secret: config.client_secret,
          grant_type: "authorization_code"
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );
      return {
        refresh_token: data.refresh_token,
        access_token: data.access_token
      };
    } catch (error) {
      config.verbose && console.error("ERROR fetching tokens: ", error);
      return false;
    }
  };

  // Check if the access token is expired. If so, try to refresh it
  static checkAndRefresh = async config => {
    let { access_token, timestamp, refresh_token, client_id, client_secret } = config;
    if (!access_token || !timestamp) return false;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 10); // 60 minutes * 60 seconds * 1000 milliseconds = 1 hour
    const sessionTimestamp = new Date(timestamp);
    this.verbose && console.log(sessionTimestamp < oneHourAgo, sessionTimestamp, oneHourAgo);
    if (sessionTimestamp < oneHourAgo) {
      try {
        if (!refresh_token || !client_id || !client_secret) return false;
        // If the token is expired, try to refresh it
        access_token = await this.refreshToken({ refresh_token, client_id, client_secret });
      } catch (error) {
        this.verbose && console.log("checkAndRefresh ERROR: ", error);
      }
    }

    config.verbose && console.log("CHECK AND REFRESH RETURNING", access_token);
    return access_token;
  };

  // Refresh the access token and return back the new access token
  static refreshToken = async config => {
    try {
      const { data } = await axios.post(
        "https://oauth2.googleapis.com/token",
        querystring.stringify({
          client_secret: config.client_secret,
          grant_type: "refresh_token",
          refresh_token: config.refresh_token,
          client_id: config.client_id
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );

      return data.access_token;
    } catch (error) {
      config.verbose && console.error("Error refreshing token", error);
      throw error;
    }
  };
}
module.exports = DriveUtils;
// Frontend: 
// Getting the auth tokens is separate from the DriveUtils class. our needs for them are also different.
// retrieving the service.json to create the access token for our users
// Backend : 
// storage and retrieval and refreshing of user access token 
// 
/*
  - getAuthUrl
  - handleAuthCallback
  - refreshToken 
  - checkAndRefresh 
  - getDrive
  - getDrive <- listFiles
  - getDrive <- listFiles <- getFileInfo
  - getDrive <- getFileById
  - getDrive <- getFileById <= getDrive <- listFiles <- getFileInfo <= getFileByName
  - getDrive <- createFile
  - getDrive <- getFileById <= getDrive <- createFile <- getFileInfo <= createAndOrGetFile
  - getDrive <- updateFile
*/