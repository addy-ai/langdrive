#!/usr/bin/env node
require("dotenv").config();

if (process.argv.includes('deploy')) {
  const handleDeploy = require('./main_cli');
  handleDeploy(process.argv);
}

module.exports = {
  DriveUtils: require("./src/server/drive_utils"),
  DriveChatbot: require("./src/server/drive_chatbot")
};
