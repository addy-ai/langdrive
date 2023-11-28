const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml'); 
const Train = require("./train");
require("dotenv").config(); 

// Gets the config and calls train
async function cli_train(args) { console.log(`~~~~ Start cli_train:${JSON.stringify(args)}:`);  
  let config = getConfig(args)
  config = await initConfig(config);
  // console.log({config})
  train(config);
}

async function initConfig(config) {
  console.log(`~~~~ Start initConfig:`);//${JSON.stringify(config)}:`);   
  if(!config){return} 

  let initClass = async (service) =>{ 
    if(!!service){
      let classInstance = await require(`./${service}`)  
      return await classInstance?.init({verbose: config.verbose, ...config[service]})
    }
    else{return false}
  }

  config.train.service = await initClass(config.train.service)
  config.train.inputService = await initClass(config.train.input.service)
  config.train.outputService = await initClass(config.train.output.service)
  return config
}

// config.train.input.serviceName == config.serviceName == class serviceName 
async function train(config) {
  console.log(`~~~~ Start train:`);//${JSON.stringify(config)}:`);   
  if(!config){return} 
  
  // Train the model using the spec
  let trainer = await Train.init({verbose: config.verbose, ...config.train});

  console.log("\n\n\n CHECK OUT THESE HF VALUES\n\n", config.huggingface, "\n\n\n")

  let trainingResults = await trainer.trainModel(config.huggingface);

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


module.exports = {train, getConfig, cli_train}; 
exports = {train, getConfig, cli_train};  


// if(config.firebase & !config.firebase.instance){ config.firebase.instance = firestore.init(config); }
// config.train.input.sourceTool = config[inputService]?.instance 