#!/usr/bin/env node
process?.argv?.length > 2 && require('./main_cli')(
  process.argv.slice(3).reduce((acc, curr, i, arr) => {
    if (curr.startsWith('--')) {
      const key = curr.slice(2);
      const nextArg = arr[i + 1];
      if (nextArg && !nextArg.startsWith('--')) {
        acc[key] = nextArg;
        arr.splice(i + 1, 1); // Remove the next argument from the array as it's already processed
      } else {
        acc[key] = true;
      }
    }
    return acc;
  }, {})
);

// runs main_cli.js cli_train({flag: val})

module.exports = {
  DriveTrain: require("./src/train"),
  DriveUtils: require("./src/gdrive"),
  DriveChatbot: require("./src/chatbot")
};