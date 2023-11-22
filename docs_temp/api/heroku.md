# Heroku

The `HerokuHandler` class in Node.js is designed to interact with the Heroku API. It facilitates checking the installation and login status on Heroku, and allows for additional functionality related to Heroku operations.

## Class: HerokuHandler

### Constructor
- **Parameters**:
  - `props` (Object): Contains `herokuApiKey`, `username`, and `password`.
- **Description**: 
  - Initializes the class with Heroku API key and user credentials.

### Method: `checkInstall()`
- **Returns**: Boolean indicating if Heroku CLI is installed.
- **Description**: 
  - Checks if the Heroku CLI is installed by making a GET request to the Heroku API.
  - Logs the CLI version or error message.

### Method: `checkLogin()`
- **Returns**: Boolean indicating if the user is logged into Heroku.
- **Description**: 
  - Verifies if the user is logged in to Heroku by making a GET request to the Heroku account API endpoint.
  - Logs the email address of the logged-in user or error message.

### Static Method: `handleHeroku(args)`
- **Parameters**: `args` (Object) - Heroku configuration arguments.
- **Returns**: Object with the status and message regarding Heroku installation and login.
- **Description**: 
  - Handles Heroku operations by creating an instance of `HerokuHandler` and checking both installation and login status.
  - Logs the status of Heroku installation and user login.

## Export
- The `HerokuHandler` class is exported for use in other modules.

## Additional Comments
- The class contains commented-out code, which provides an alternative approach using `exec` and `spawn` commands for interacting with the Heroku CLI.
- The commented section outlines additional potential functionalities, like installation and login via CLI commands, which are currently benched in favor of REST API interactions.
- The comments also provide insights into the Heroku login command behavior, particularly regarding multi-factor authentication (MFA) and API token handling.

