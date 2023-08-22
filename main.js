require("dotenv").config();

module.exports = {
  DriveUtils: require("./src/server/drive_utils"),
  DriveChatbot: require("./src/server/drive_chatbot")
};
