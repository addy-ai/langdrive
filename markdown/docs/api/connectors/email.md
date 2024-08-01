# EmailRetriever

**Description**: The `EmailRetriever` class is designed to fetch emails from specific folders within an email account. It supports multiple email clients and allows for easy email retrieval with support for IMAP search commands. It leverages proprietary Addy AI technology to interact with email servers and facilitates the extraction of email data for use in applications.

### Constructor: `EmailRetriever()`

**Returns**: An instance of the `EmailRetriever` class.

**Description**:

  - Initializes an `EmailRetriever` instance with the provided details for email access and retrieval.
  - Throws an error if the specified email client is not supported.

**Example**: Instantiate the `EmailRetriever` for a Gmail account with verbose error logging.

```javascript
const retriever = new EmailRetriever(
  'your-email@gmail.com',
  'your-password',
  'gmail',
  true
);
```

**Parameters**:

  | Parameter Name | Description | Accepted Values/Data Types |
  | -------------- | ----------- | --------------------------- |
  | emailAddress   | The email address of the account to initialize | String |
  | emailPassword  | The password of the email account | String |
  | emailClient    | The email client hosting the email address | "gmail" \| "outlook" |
  | verbose        | Indicates if errors should be printed out | Boolean |


### Method: `getEmailsInFolder()`

**Returns**: A promise that resolves to an array of emails upon successful retrieval or undefined if unsuccessful.

**Description**:

  - Fetches emails from a specified folder within the user's email account up to a specified limit.
  - If `verbose` is `true`, any errors encountered will be printed to the console.

**Example**: Retrieve the last 10 unseen emails in the Inbox folder.

```javascript
retriever.getEmailsInFolder('Inbox', '10', 'UNSEEN')
  .then(emails => {
    if (emails) {
      console.log('Retrieved Emails:', emails);
    } else {
      console.log('No emails fetched or an error occurred');
    }
  })
  .catch(error => console.error(error));
```

**Parameters**:

  | Parameter Name     | Description | Accepted Values/Data Types |
  | ------------------ | ----------- | --------------------------- |
  | folderName         | The name of the folder to scan for emails | String |
  | limit              | The maximum number of emails to retrieve | String |
  | IMAPSearchCommand  | The IMAP command to determine which emails to fetch | "ALL" \| "UNSEEN" \| "SEEN" |


---