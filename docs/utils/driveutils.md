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