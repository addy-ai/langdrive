```markdown
# HerokuHandler Documentation

**Description**: The `HerokuHandler` class is designed to facilitate interactions with the Heroku platform via its API. It provides methods to check if Heroku CLI is installed, verify login credentials, and handle Heroku specific tasks programmatically.

### Method: `constructor(props)`

**Returns**: An instance of the `HerokuHandler` class.

**Description**:

  - Initializes the `HerokuHandler` with the necessary properties to authenticate API requests.
  - Properties include Heroku API key, username, and password.

**Example**: Create an instance of the `HerokuHandler` class.

    const herokuHandler = new HerokuHandler({
      herokuApiKey: 'your-heroku-api-key',
      username: 'your-username',
      password: 'your-password'
    });

**Parameters**:

| Parameter Name | Description          | Accepted Values/Data Types    |
| -------------- | -------------------- | ----------------------------- |
| props          | Object containing authentication properties. | Object    |

### Method: `checkInstall()`

**Returns**: A promise that resolves to a boolean indicating if Heroku CLI is installed.

**Description**:

  - Makes a GET request to the Heroku API to check if the Heroku CLI is installed.
  - Logs the CLI version if installed, otherwise logs an error.

**Example**: Check if Heroku CLI is installed.

    herokuHandler.checkInstall()
      .then(isInstalled => {
        console.log(`Is Heroku installed: ${isInstalled}`);
      });

**Parameters**: None

### Method: `checkLogin()`

**Returns**: A promise that resolves to a boolean indicating whether the user is logged in to Heroku.

**Description**:

  - Makes a GET request to the Heroku API to verify if the user is logged in.
  - Logs the email address of the logged-in user if authentication is successful, otherwise logs an error.

**Example**: Verify if the user is logged into Heroku.

    herokuHandler.checkLogin()
      .then(isLoggedIn => {
        console.log(`Is User logged in: ${isLoggedIn}`);
      });

**Parameters**: None

### Method: `handleHeroku(args)`

**Returns**: A promise that resolves to an object containing the status and message of the Heroku login process.

**Description**:

  - Static method that creates an instance of `HerokuHandler` and checks the installation and login status.
  - Returns an object that indicates whether the user is installed and/or logged in to Heroku.

**Example**: Handle Heroku using provided arguments.

    HerokuHandler.handleHeroku({ herokuApiKey: 'your-heroku-api-key' })
      .then(result => {
        console.log(result);
      });

**Parameters**:

| Parameter Name | Description          | Accepted Values/Data Types |
| -------------- | -------------------- | -------------------------- |
| args           | Object containing properties to be passed to `HerokuHandler` constructor. | Object |
```