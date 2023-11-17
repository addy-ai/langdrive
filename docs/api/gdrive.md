# NPM: Langdrive: DriveUtils Class

```
DriveUtils =

  ~~~~~~~~~~ class methods
  getDrive()
  listFiles(mimeType)
  getFileInfo(filename, mimeType)
  getFileById(fileId)
  getFileByName(filename, mimeType = false)
  createFile(filename, mimeType, message)
  createAndOrGetFile(filename, mimeType, message)
  updateFile(fileId, mimeType, message)

  ~~~~~~~~~~ static methods
  getAuthUrl({redirect_uri, client_id, scope})
  handleAuthCallback({client_secret, access_token, code, redirect_uri})
  refreshToken({client_secret, access_token, refresh_token, client_id})
  checkAndRefresh ({access_token, timestamp, refresh_token, client_id, client_secret})
```

Create an instance of the `DriveUtils` class like so:

```
const myDriveTool = new DriveUtils(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, { ACCESS_TOKEN, verbose })
```

The DriveUtils class has some helping static functions to help you work with google OAuth2 access tokens.

Provides a URL for a user-consent page.

```
  let authUrl = DriveUtils.getAuthUrl({
    redirect_uri: "http://localhost:3000/auth/google/callback",
    scope: "https://www.googleapis.com/auth/drive",
    client_id: GOOGLE_CLIENT_ID
  });
  res.redirect(authUrl);
```

Success will redirect you to the `redirect_uri` you with a `code` included in as a query parameter.

This `redirect_uri`` must be approved in the project's google cloud console oAuth2 admin panel.

We take the resulting `req.query.code` and issue anothe request to google to retrieve our `ACCESS_TOKEN`

```
let await DriveUtils.handleAuthCallback({
code,
client_id: GOOGLE_CLIENT_ID,
client_secret: GOOGLE_CLIENT_SECRET
});
```

The resulting data will return a refresh_token. If you save that, when the access_token expires, you can use `checkAndRefresh` to get a new one.

```
await DriveUtils.checkAndRefresh(
access_token,
req.session.timestamp,
req.session.refresh_token,
GOOGLE_CLIENT_ID,
GOOGLE_CLIENT_SECRET
);

```

With that, you can create a `new DriveUtils` which provides Drive access.

```
myDriveTool.listFiles(mimeType)
```



 
The `DriveUtils` class in Node.js is designed to interface with Google Drive. It handles authentication, file listing, information retrieval, and file operations using Google APIs.

## Class: DriveUtils

### Constructor
- **Parameters**: `props` (Object) containing various configuration options.
- **Description**: 
  - Initializes the class with properties such as `client_id`, `client_secret`, `scopes`, and `keyFilePath`.
  - Handles authentication for different application types (server, desktop, web).

### Method: `getDrive()`
- **Returns**: Google Drive instance.
- **Description**: 
  - Initializes and retrieves the Google Drive instance.

### Method: `listFilez()`
- **Description**: 
  - Lists files in Google Drive with a predefined page size and fields.

### Method: `listFiles(props)`
- **Parameters**: `props` (Object) containing file listing options.
- **Returns**: File list or error information.
- **Description**: 
  - Lists files in Google Drive based on various properties like directory, mime type, etc.

### Method: `listDirectories(props)`
- **Parameters**: `props` (Object) for directory listing.
- **Returns**: Directory list or error information.
- **Description**: 
  - Lists all directories or directories within a specific directory.

### Method: `getFileInfo(props)`
- **Parameters**: `props` (Object) containing file information options.
- **Returns**: File information or error.
- **Description**: 
  - Retrieves information about a specific file based on provided criteria.

### Method: `getFileById(props)`
- **Parameters**: `props` (Object) containing file ID.
- **Returns**: File data or error.
- **Description**: 
  - Retrieves a file by its ID.

### Method: `getFileByName(props)`
- **Parameters**: `props` (Object) containing file name and other options.
- **Returns**: File data or error.
- **Description**: 
  - Retrieves a file by its name.

### Method: `createFile(props)`
- **Parameters**: `props` (Object) containing file creation options.
- **Returns**: File creation result.
- **Description**: 
  - Creates a file in Google Drive.

### Method: `createAndOrGetContent(props)`
- **Parameters**: `props` (Object) containing file path and content options.
- **Returns**: File or directory content.
- **Description**: 
  - Creates or retrieves content based on a given path and other criteria.

### Method: `updateFile(props)`
- **Parameters**: `props` (Object) containing file update options.
- **Returns**: File update result.
- **Description**: 
  - Updates a file in Google Drive.

### Static Method: `getAuthUrl(config)`
- **Parameters**: `config` (Object) for authentication URL generation.
- **Returns**: Authentication URL.
- **Description**: 
  - Generates a Google authentication URL for obtaining access tokens.

### Static Method: `handleAuthCallback(config)`
- **Parameters**: `config` (Object) containing authentication callback information.
- **Returns**: Tokens or false.
- **Description**: 
  - Handles the authentication callback from Google to get access tokens.

### Static Method: `checkAndRefresh(config)`
- **Parameters**: `config` (Object) for token check and refresh.
- **Returns**: Access token or false.
- **Description**: 
  - Checks and refreshes the access token if it is expired.

### Static Method: `refreshToken(config)`
- **Parameters**: `config` (Object) for token refresh.
- **Returns**: New access token.
- **Description**: 
  - Refreshes the access token.

## Comments and Additional Information
- The class provides various static and instance methods for handling Google Drive operations.
- It supports different types of applications like server, desktop, and web.
- The methods are comprehensive, covering from authentication to file operations.

