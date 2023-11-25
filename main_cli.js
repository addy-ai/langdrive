// For now just call train
function cli(args) { 
  console.log(`~~~~ Start cli\n`) 
  require('./src/utilsNode').cli_train(args);
}

module.exports = cli;