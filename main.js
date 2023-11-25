#!/usr/bin/env node
process?.argv?.length > 2 && require('./main_cli')(
  process.argv.slice(2).reduce((acc, curr, i, arr) => {
    if (i % 2 === 0) {
      // Check if the next argument is another flag
      const nextArg = arr[i + 1];
      acc[curr] = nextArg && !nextArg.startsWith('-') ? nextArg : true;
    }
    return acc;
  }, {})
); // runs train({flag: val})

module.exports = {
  DriveTrain: require("./src/train"),
  DriveUtils: require("./src/gdrive"),
  DriveChatbot: require("./src/chatbot")
};