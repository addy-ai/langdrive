#!/usr/bin/env node
process?.argv?.length>2 && require('./main_cli')( 
  process.argv.slice(2).reduce((acc, curr, i, arr) => 
    (i % 2 === 0 ? acc[curr] = arr[i + 1] || '' : null, acc), {})); // runs deploy({flag:val})

module.exports = {
  DriveTrain: require("./src/train"),
  DriveUtils: require("./src/gdrive"),
  DriveChatbot: require("./src/chatbot")
};