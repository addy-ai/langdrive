# Email

The `EmailRetriever` class in Node.js is designed to retrieve emails from different email clients using SMTP configurations.

## Class: EmailRetriever

### Constructor
- **Parameters**:
  - `emailAddress` (String): The email address of the account.
  - `emailPassword` (String): The password of the account.
  - `emailClient` (String): The email client hosting the email address (e.g., "gmail", "outlook").
  - `verbose` (Boolean): Optional flag for verbose error logging.
- **Description**: 
  - Initializes the `EmailRetriever` with the provided email address, password, and client.
  - Validates and sets the SMTP configuration based on the email client.

### Method: `getEmailsInFolder(folderName, limit, IMAPSearchCommand)`
- **Parameters**:
  - `folderName` (String): The name of the folder to scan in the email account.
  - `limit` (String): Maximum number of emails to retrieve.
  - `IMAPSearchCommand` (String): The IMAP search command (e.g., "ALL", "UNSEEN", "SEEN").
- **Returns**: Array of emails or undefined.
- **Description**: 
  - Retrieves emails from a specific folder in the user's email account.
  - Utilizes an external API for email retrieval.
  - Handles and reports errors, especially if `verbose` is enabled.

## Additional Information
- **SMTP Configuration Constants**: The class uses predefined SMTP configurations for supported email clients, which are stored in `emailClientSMTPConfigs`.
- **Error Handling**: The class throws an error if the specified email client is not supported.
- **External API Usage**: Email retrieval is performed through a call to a specified external API (`EMAIL_RETRIEVAL_API`).

## Usage Example
- Create an `EmailRetriever` instance by providing the necessary credentials and client information.
- Call `getEmailsInFolder` with the appropriate parameters to retrieve emails from a specified folder.

