#!/usr/bin/env node
process?.argv?.length > 2 && (async () => { 
  const mainCLI = require('./main_cli') 
  const args = process.argv.slice(3).reduce((acc, curr, i, arr) => {
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
  }, {}); 
  let config = await mainCLI( args )
  // console.log('main.js', {config})
  process.exit();
})() || process.exit();

// runs main_cli.js cli_train({flag: val})

module.exports = {
  DriveTrain: require("./src/train"),
  DriveUtils: require("./src/gdrive"),
  DriveChatbot: require("./src/chatbot")
};