Visit this page: https://console.cloud.google.com/apis/credentials

You can find it from the google cloud console [homepage](https://console.cloud.google.com/welcome) by clicking "api's and services", then clicking "credentials" from the tabbed navigation on the left-side of the page that loads.

Once on the page, click 'create credentials' -> 'oAuth Client Id'.

On the resulting page you will have to select what kind of credentials these are. 
You may need to visit this page twice because: 

If you want langDrive to access company resources through a private and secure server.
- Select 'desktop app' as your 'app' type

If you want user authentication and googleDrive access using langDrive
- Select 'Web application'
- You will be asked to provide valid js origins from which the oAuth process will occur.

Common Options:
http://localhost:3000
http://localhost:3000/chat
http://localhost:3000/auth
http://localhost:3000/auth/callback


Once your app is created, a popup will give your a 'desktop app' id and secret, and also an option to 'download json'. Either store the id, secret in your .env file, or provide a path to the jsonString, or even convert the json to a string and use that. 

you need to point to the drive server file. be sure to rename it because the file comes in funny