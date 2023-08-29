const { google } = require("googleapis");
const querystring = require("querystring");
const axios = require("axios");
const { authenticate } = require("@google-cloud/local-auth");

const fs = require("fs").promises;
const path = require("path");
const process = require("process");

class DriveUtils {
  constructor(props) {
    this.verbose = props.verbose;
    this.client_id = props.client_id;
    this.client_secret = props.client_secret;
    this.redirect_uri = this.scopes = props.scopes;
    this.serviceKeyFile = props.serviceKeyFile;
    this.desktopKeyFile = props.desktopKeyFile;
    this.access_token = props.access_token || false;
    // const entryScriptPath = require.main.filename;
    // console.log(entryScriptPath);
    // __dirname + "/google_desktop_token.json";
    this.desktopTokenFile =
      props.desktopTokenFile || require.main.filename.replace(/[^\\\/]+$/, "") + "/google_desktop_token.json";
    this.oauth2Client = (async () => {
      let errormsg = "ERROR: DriveUtils: Unable to Authetnicate Drive. ";
      let client = false;
      try {
        if (this.serviceKeyFile) {
          // For Service Accounts
          this.verbose && console.log("Given A service Account", props);
          const auth = new google.auth.GoogleAuth({ keyFile: this.serviceKeyFile, scopes: this.scopes });
          client = await auth.getClient();
          let drive = google.drive({ version: "v3", auth: client });
          await this.listFilez(drive);
        }
        if (this.desktopKeyFile) {
          // For Desktop Accounts
          // this.verbose && console.log("\n Given A Desktop Account", props);
          client = await (async () => {
            // Try retrieving token information from a file
            // AND OR USE this.desktopTokenFileContents
            // console.log("this.desktopTokenFile", this.desktopTokenFile);
            try {
              const content = await fs.readFile(this.desktopTokenFile);
              const credentials = JSON.parse(content);
              client = google.auth.fromJSON(credentials);
            } catch (err) {
              this.verbose && console.log("desktopTokenFile ERROR: ", err);
            }
            // Otherwise create and save it for future use.
            if (!client && this.desktopKeyFile) {
              console.log("this.desktopKeyFile", this.scopes, this.desktopKeyFile);
              try {
                client = await authenticate({
                  scopes: this.scopes,
                  keyfilePath: this.desktopKeyFile
                });
              } catch (err) {
                this.verbose && console.log("desktopKeyFile ERROR: ", err);
              }
              if (client.credentials) {
                const content = await fs.readFile(this.desktopKeyFile);
                const keys = JSON.parse(content);
                const key = keys.installed || keys.web;
                const payload = JSON.stringify({
                  type: "authorized_user",
                  client_id: key.client_id,
                  client_secret: key.client_secret,
                  refresh_token: client.credentials.refresh_token
                });
                await fs.writeFile(this.desktopTokenFile, payload);
              }
            }
            return client;
          })();
          // console.log("FOUND", client);
          // let drive = google.drive({ version: "v3", auth: client });
          // await this.listFilez(drive);
          return client;
        } else if (this.client_id) {
          // For Web Applications
          this.verbose && console.log("Given A Web or Desktop", props);
          const client = new google.auth.OAuth2(this.client_id, this.client_secret);
          client.setCredentials({ access_token: this.access_token });
          return client;
        } else {
          this.verbose && console.log(errormsg);
        }
      } catch (error) {
        this.verbose && console.log(errormsg, ": ", error);
      }
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
        console.log("No files found.");
      }
    } catch (error) {
      console.error("Error listing files:", error);
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
      this.verbose && console.log("LIST FILES IS CALLING LIST DIRECTORIES WITH NO PARAMS");
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
          "\n\n ERROR: listFiles CALLING GOOGLEAPI: \n PROPS: ",
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
      this.verbose && console.log("DriveUtils: listDirectories: ", props, ", RETURNING: ", error, ", ERROR: ", err);
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
      // console.log("\n driveUtils.getFileInfo.listFiles:", data);
      if (!data) return error;
      return { status: 200, message: "Found File.", data };
    } catch (err) {
      this.verbose &&
        console.log("\n\n ERROR: DriveUtils: getFileInfo: RECIEVED: ", props, ", RETURNING: ", error, ", ERROR: ", err);
      return error;
    }
  }

  async getFileById(props) {
    await this.getDrive();
    // console.log("GET FILE BY ID", props);
    let { id, fileId } = props;
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~ Get Files By ID ~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", {id});
    */
    let error = { status: 400, data: false, message: "Unable to getFileById: " + id || fileId };
    try {
      const drive = await this.drive;
      const response = await drive.files.get({ fileId: id || fileId, alt: "media" });
      return { status: 200, message: "Got File by ID.", data: response.data };
    } catch (err) {
      this.verbose &&
        console.log(
          "\n\n ERROR: DriveUtils: getFileByName: RECIEVED: ",
          { fileId },
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
          "n\n ERROR: DriveUtils: getFileByName: RECIEVED: ",
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
          "\n\n ERROR: DriveUtils: createFile: RECIEVED: ",
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
          "DriveUtils: createAndOrGetFile: RECIEVED: ",
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
    let { fileId, mimeType, message } = props;
    /*
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~ Update File In Drive by ID ~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    */
    let error = { status: 400, data: false, message: "Unable to updateFile: " + fileId };
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
          "DriveUtils: updateFile: RECIEVED: ",
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
        this.verbose && console.log("ERROR: ", error);
      }
    }

    config.verbose && console.log("CHECK AND REFRESH RETURNING", access_token);
    return access_token;
  };

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
}
module.exports = DriveUtils;

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
