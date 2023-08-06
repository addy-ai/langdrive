const request = require("request");

const serverURL = "http://localhost:3000"; // Replace with your server URL

// Simple GET request to test the root endpoint
request(serverURL, (error, response, body) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Response:", body);
  }
});

// GET request to test the '/user' endpoint
request(`${serverURL}/user`, (error, response, body) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("User Endpoint Response:", body);
  }
});
