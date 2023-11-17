# WELCOME

## NPM: Langdrive: Getting Started

LangDrive was built for Node.js.

- `npm install langdrive` exposes `DriveChatbot` and it's underlying utility class `DriveUtils`.
- `DriveChatbot` - Uses an agent conditionally integrated with drive_utils.
- `DriveUtils` - Syncs data to a users google drive folder if the drive_chatbot is initialized with a OAuth2 access token. The extent of the data sync is conditioned on Auth scope.
- `emailRetriever` - Pulls data from gmail
- `ollama` - Use local model
- `train` - Trains a model
- `email` - Retrieve emails
- `huggingFace` -  Deploys and inquires


Node developers can `npm install langDrive` to access our `DriveUtils` and `DriveChatbot` classes. Individuals may use a free deployed instance of this service by visting addy-ai.com. Google [OAuth2](https://developers.google.com/identity/protocols/oauth2) keys are required to run your own instance (create credentials for a web app oAuth). Read our tutorial on OAuth2 on our [blog](https://addy.beehiiv.com/).