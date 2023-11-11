// For now just call deploy
function cli(args) { 
  console.log(`~~~~ Start cli\n`) 
  require('./src/utilsNode').cli_deploy(args);
}

module.exports = cli;