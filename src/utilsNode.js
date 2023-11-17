const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml'); 
const Train = require("./train");
require("dotenv").config(); 

// Gets the config and calls deploy
function cli_deploy(args) { console.log(`~~~~ Start cli_deploy:${JSON.stringify(args)}:`);  
  const config = getConfig(args);
  deploy(config);
}

// config.train.input.serviceName == config.serviceName == class serviceName 
async function deploy(config) {
  console.log(`~~~~ Start deploy:`);//${JSON.stringify(config)}:`);   
  if(!config){return}   

  let initClass = async (service) =>{ 
    if(!!service){ 
      let classInstance = await require(`./${service}`)  
      return await classInstance?.init({verbose: config.verbose, ...config[service]})
    }
  }
  config.train.service = await initClass(config.train.service)
  config.train.inputService = await initClass(config.train.input.service)
  config.train.outputService = await initClass(config.train.output.service)
  
  // Train the model using the spec
  let trainer = await Train.init({verbose: config.verbose, ...config.train}); 

  let trainingResults = await trainer.trainModel(config.huggingface);
  
  // Deploy the data needed
  // if(config.heroku){ config.firebase.heroku = heroku.handleHeroku(config); }
}

// Retrieves YAML using args.path, default: to langdrive.yaml
// {[...services], train}
function getConfig(args){ 
  console.log(`~~~~ Start getConfig:${JSON.stringify(args)}:`);  

    // Relative path to YAML
    // Note: process.cwd() is Directory where the CLI Executed From
    // Note: __dirname is the Directory of this Current File
    const currentDirectory = process.cwd();
    let yamlFilePath = args.yaml ? 
      path.resolve(currentDirectory, args[yaml]) : 
      path.resolve(currentDirectory, './langdrive.yaml')
  
    // console.log(`- yamlFilePath: ${yamlFilePath}`);
  
    // Check if YAML File Exists
    let fileExists = fs.existsSync(yamlFilePath) 
    // console.log(`YAML File ${fileExists?"Found": "Not Found"}\n`)
    if(!fileExists){return} 

    // Check if it has contents
    const fileContents = fs.readFileSync(yamlFilePath, 'utf8'); 
    let config = yaml.load(fileContents);
    // console.log(`YAML Content ${config?"Found": "Not Found"}\n`)
    if(!config){return}  
    /*
    config.heroku = { 
        apiKey : process.env.herokuApiKey,
        username : args['username'],
        password : args['password'],
        ...config.heroku
    }
    */
    function replaceEnvValues(node) {
      function getEnvValue(str){return process.env[str.substring(4)] || str}
      if (Array.isArray(node)) { return node.map(replaceEnvValues); } 
      else if (typeof node === 'string') { return getEnvValue(node); } 
      else if (typeof node === 'object' && node !== null) { 
      Object.keys(node).forEach((key) => { node[key] = replaceEnvValues(node[key]); });
      }
      return node;
    }

    config = replaceEnvValues(config); 
    return config
}


module.exports = {deploy, getConfig, cli_deploy}; 
exports = {deploy, getConfig, cli_deploy};  


// if(config.firebase & !config.firebase.instance){ config.firebase.instance = firestore.init(config); }
// config.train.input.sourceTool = config[inputService]?.instance 