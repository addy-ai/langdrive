# DriveUtils

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

