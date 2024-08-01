# Data Connectors

Welcome to the Data Connectors Overview! This document offers a detailed guide on the functionalities and capabilities of several Node.js classes, designed to enhance your development experience.

## Firestore Class Overview

### Class: `Firestore`
The `Firestore` class in Node.js is designed for robust interaction with Firebase Firestore. It supports various operations like querying, adding, updating, and deleting documents in your Firestore database.

#### Constructor
- **Parameters**: 
  - `props` (Object): Contains the Firestore database instance.
- **Description**: 
  - Initializes the Firestore class with a database instance.

#### Key Methods
- **`filterCollectionWithWhereClause(...)`**: Filters a collection using a where clause.
- **`addDocumentToCollection(...)`**: Adds a new document to a specified collection.
- **`updateDocument(...)`**: Updates an existing document in a collection.
- **`deleteDocumentFromCollection(...)`**: Deletes a document from a collection.
- **`getAllDocumentsInCollection(...)`**: Retrieves all documents from a specified collection.

---

## EmailRetriever Class Overview

### Class: `EmailRetriever`
The `EmailRetriever` class in Node.js is tailored for retrieving emails from different email clients using SMTP configurations. It provides a streamlined approach to email retrieval.

#### Constructor
- **Parameters**:
  - `emailAddress` (String): The email account's address.
  - `emailPassword` (String): The email account's password.
  - `emailClient` (String): The email client hosting the account.
  - `verbose` (Boolean): Enables verbose error logging.
- **Description**: 
  - Initializes the `EmailRetriever` with email credentials and client.

#### Key Methods
- **`getEmailsInFolder(...)`**: Retrieves emails from a specific folder in the email account.
- **`validateSMTPConfig()`**: Validates the SMTP configuration for the email client.

#### Additional Information
- **SMTP Configuration**: Uses predefined SMTP settings for supported email clients.
- **Error Handling**: Robust error management, especially for unsupported email clients.
- **External API Integration**: Utilizes external APIs for email retrieval.

---

# DriveUtils

## Class: `DriveUtils`

The `DriveUtils` class in Node.js is designed to interface with Google Drive. It handles authentication, file listing, information retrieval, and file operations using Google APIs.

### Constructor
- **Parameters**: `props` (Object) containing various configuration options.
- **Description**: 
  - Initializes the class with properties such as `client_id`, `client_secret`, `scopes`, and `keyFilePath`.
  - Handles authentication for different application types (server, desktop, web).

### Key Methods
- **`getDrive()`**: Initializes and retrieves the Google Drive instance.
- **`listFiles(props)`**: Lists files in Google Drive based on properties like directory, mime type, etc.
- **`listDirectories(props)`**: Lists all directories or directories within a specific directory.
- **`getFileInfo(props)`**: Retrieves information about a specific file based on provided criteria.
- **`getFileById(props)`**: Retrieves a file by its ID.
- **`getFileByName(props)`**: Retrieves a file by its name.
- **`createFile(props)`**: Creates a file in Google Drive.
- **`createAndOrGetContent(props)`**: Creates or retrieves content based on a given path and other criteria.
- **`updateFile(props)`**: Updates a file in Google Drive.

### Static Methods
- **`getAuthUrl(config)`**: Generates a Google authentication URL for obtaining access tokens.
- **`handleAuthCallback(config)`**: Handles the authentication callback from Google to get access tokens.
- **`checkAndRefresh(config)`**: Checks and refreshes the access token if it is expired.
- **`refreshToken(config)`**: Refreshes the access token.

## Comments and Additional Information
- The class provides various static and instance methods for handling Google Drive operations.
- It supports different types of applications like server, desktop, and web.
- The methods are comprehensive, covering from authentication to
