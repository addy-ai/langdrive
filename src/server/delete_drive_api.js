//
// Google Drive API	.../auth/drive.appdata	See, create, and delete its own configuration data in your Google Drive
// Google Drive API	.../auth/drive.file	See, edit, create, and delete only the specific Google Drive files you use with this app
// Google Drive API	.../auth/drive.install	Connect itself to your Google Drive
const service_endpoint = "https://www.googleapis.com";

// Gets information about the user, the user's Drive, and system capabilities.
// https://www.googleapis.com/auth/drive.file
// https://www.googleapis.com/auth/drive.appdata
const service_about = service_endpoint + "/drive/v3/about";

// Subscribes to changes for a user.
// https://www.googleapis.com/auth/drive.appdata
// https://www.googleapis.com/auth/drive.file
const service_watch =
  service_endpoint + "drive/api/reference/rest/v3/changes/watch";

//Lists the changes for a user or shared drive.
const service_changes = service_endpoint + "/drive/v3/changes";

//https://developers.google.com/drive/api/quickstart/js
//https://developers.google.com/drive/api/guides/about-sdk
//https://developers.google.com/drive/api/guides/manage-uploads#node.js

// Requires the following OAuth scope:
// https://www.googleapis.com/auth/drive
const service_create = service_endpoint + "/drive/v3/drives";

// https://developers.google.com/drive/api/reference/rest/v3
// https://developers.google.com/drive/api/reference/rest/v3/changes/list
// https://developers.google.com/drive/api/reference/rest/v3/drives
// https://developers.google.com/drive/api/reference/rest/v3/permissions
