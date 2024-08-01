// For now just call train
async function cli(args) { 
  const utils = require('./src/utilsNode')
  const returnThis = await utils.cli_train(args);
  // console.log('~~~~ main_cli', {returnThis})
  return returnThis
}

module.exports = cli;