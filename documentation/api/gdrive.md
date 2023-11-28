```markdown
# Gdrive Documentation

**Description**: Gdrive is a JavaScript class designed for Node.js, intended to simplify interactions with Google Drive API. It allows developers to authenticate access, list directories and files, upload, update, and download files within Google Drive using Google's API.

### Method: `init(config)`

**Returns**: An instance of the Gdrive class.

**Description**:

  - Initializes a new instance of the Gdrive class using the provided configuration object.
  - Handles errors encountered during the initialization process.

**Example**: How to initialize a Gdrive instance.

```javascript
const Gdrive = require("./Gdrive");
const config = {
  verbose: true,
  appType: 'server',
  client_id: 'your-client-id',
  client_secret: 'your-client-secret',
  redirect_uri: 'your-redirect-uri',
  scopes: 'https://www.googleapis.com/auth/drive',
  keyFilePath: 'path-to-keyfile.json'
};
const driveInstance = await Gdrive.init(config);
```

**Parameters**:

| Parameter Name | Description                                | Accepted Values/Data Types          |
|----------------|--------------------------------------------|-------------------------------------|
| config         | An object containing the configuration for | Object                              |
|                | Gdrive initialization.                     |                                     |

### Method: `listFilez()`

**Returns**: Nothing directly, but logs the list of files to the console.

**Description**:

  - Lists up to 10 files from the authenticated user's Google Drive.
  - Outputs the file names and IDs to the console.
  - Handles errors and logs them to the console if listing fails.

**Example**: List files in Google Drive.

```javascript
await driveInstance.listFilez();
```

### Method: `listFiles(props)`

**Returns**: An object with a status code, message, and data containing the list of files.

**Description**:

  - Retrieves a list of files from Google Drive based on various filter criteria such as directories, MIME type, and filename.
  - Accepts a properties object to further customize the file listing.
  - Handles exceptions and returns an error object if the operation fails.

**Example**: Retrieve a specific list of files.

```javascript
const properties = {
  directory: 'Documents',
  mimeType: 'image/jpeg'
};
const fileList = await driveInstance.listFiles(properties);
```

**Parameters**:

| Parameter Name | Description                                  | Accepted Values/Data Types |
|----------------|----------------------------------------------|----------------------------|
| props          | An object containing properties for listing  | Object                     |
|                | the files, including directory, MIME type,   |                            |
|                | and filename.                                |                            |

### Method: `createFile(props)`

**Returns**: An object containing the status, message, and response data with the details of the created file.

**Description**:

  - Creates a file in Google Drive with specified properties including filename, MIME type, and contents.
  - Accepts a properties object to customize the created file.
  - Handles errors and returns an error object if the creation fails.

**Example**: Create a new file in Google Drive.

```javascript
const fileProps = {
  filename: 'NewDocument.txt',
  mimeType: 'text/plain',
  message: 'Hello World'
};
const createdFile = await driveInstance.createFile(fileProps);
```

**Parameters**:

| Parameter Name | Description                                    | Accepted Values/Data Types |
|----------------|------------------------------------------------|----------------------------|
| props          | An object containing properties for the file   | Object                     |
|                | to be created, such as filename, MIME type,    |                            |
|                | and content.                                   |                            |

### Method: `createAndOrGetContent(props)`

**Returns**: An object containing the status, message, and data with the details of the requested content or the content that was created.

**Description**:

  - Creates or retrieves the content specified by the path and MIME type from Google Drive.
  - Recursively handles directory creation if not existing and retrieves or creates the final file or folder.
  - Returns details of the content including metadata and file data.
  - Handles error cases returning structured error responses.

**Example**: Create or get content within a specified path.

```javascript
const contentProps = {
  path: '/MyDocuments/Project',
  mimeType: 'application/vnd.google-apps.folder'
};
const content = await driveInstance.createAndOrGetContent(contentProps);
```

**Parameters**:

| Parameter Name | Description                                        | Accepted Values/Data Types |
|----------------|----------------------------------------------------|----------------------------|
| props          | An object containing properties for the path, MIME | Object                     |
|                | type, and optional message content.                |                            |

### Method: `updateFile(props)`

**Returns**: An object containing the status, message, and response data with the details of the updated file.

**Description**:

  - Updates an existing file's content identified by the fileId in Google Drive.
  - Accepts a properties object containing fileId, MIME type, and new contents for the file.
  - Handles error cases and returns an error object if the update fails.

**Example**: Update an existing file's content.

```javascript
const updateProps = {
  fileId: 'file-id',
  mimeType: 'text/plain',
  message: 'Updated Content'
};
const updatedFile = await driveInstance.updateFile(updateProps);
```

**Parameters**:

| Parameter Name | Description                                       | Accepted Values/Data Types |
|----------------|---------------------------------------------------|----------------------------|
| props          | An object containing the fileId, MIME type, and   | Object                     |
|                | new content for the file to be updated.           |                            |

### Additional Static Methods:

- `createOAuthServer`: Creates and returns an Express server instance to facilitate OAuth authentication.
- `getAuthUrl(config)`: Creates and returns a Google OAuth URL based on provided parameters.
- `handleAuthCallback(config)`: Handles the OAuth callback to retrieve access tokens.
- `checkAndRefresh(config)`: Checks if an access token has expired and attempts to refresh it.
- `refreshToken(config)`: Refreshes the access token using the stored refresh token and returns the new access token.

Static methods are invoked on the Gdrive class itself and not on instances of the class. They are commonly used for initial OAuth setup, token handling, and to check or refresh access tokens when needed.

---

Navigate through our sections to find comprehensive guides and insights that suit your development needs!
```