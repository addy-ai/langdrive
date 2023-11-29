const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml'); 
const Train = require("./train");
require("dotenv").config(); 

// Gets the config and calls train
async function cli_train(args) { console.log(`~~~~ Start cli_train:${JSON.stringify(args)}:`);  
  let config = getConfig(args)
  config = await mergeCliArgsAndYaml(args, config);
  config = await initConfig(config);
  // console.log({config})
  train(config);
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

// Overwrite YAML values with CLI args
async function mergeCliArgsAndYaml(args, config) { 
  if(!args){return config}
  config.train = config.train || {}; 
  if (args['csv']) { config.train.path = args['csv']; }
  if (args['hfToken']) {
    config.huggingface = {
      hfToken: args['--hfToken'],
      ...(args['baseModel'] && { baseModel: args['baseModel'] }),
      ...(args['deployToHf'] && { deployToHf: args['deployToHf'] }),
      ...(args['hfModelPath'] && { hfModelPath: args['hfModelPath'] })
    };
  }
  if (args['deploy']) { config.train.deploy = true; }
  config.verbose = args['verbose'] || config.verbose;
  // config.verbose && console.log(`mergeCliArgsAndYaml:config`, config);
  return config
}

async function initConfig(config) {
  console.log(`~~~~ Start initConfig:`);//${JSON.stringify(config)}:`);   
  if(!config){return false} 

  let initClass = async (service) =>{ 
    if(!!service){
      let classInstance = await require(`./${service}`)  
      return await classInstance?.init({verbose: config.verbose, ...config[service]})
    }
    else{return false}
  }
  config.train = config.train || {};
  config.train.service = await initClass(config.train?.service)
  config.train.inputService = await initClass(config.train.input?.service)
  config.train.outputService = await initClass(config.train.output?.service)
   
  return config
}

// config.train.input.serviceName == config.serviceName == class serviceName 
async function train(config) {
  console.log(`~~~~ Start train:`);//${JSON.stringify(config)}:`);   
  if(!config){return} 
  
  // Train the model using the spec
  // let deploy = {(config['deploy']||config['deployToHf'])?{deploy:true}:{}}
  let trainer = await Train.init({verbose: config.verbose, ...config.train} ) //, ...deploy});

  console.log("\n\n\n train: huggingface config VALUES\n\n", config.huggingface, "\n\n\n")

  let trainingResults = await trainer.trainModel(config.huggingface);

  // if(config.heroku){ config.firebase.heroku = heroku.handleHeroku(config); }
}

async function parseCsv(csvData) {
  return new Promise((resolve, reject) => {
    const Papa = require('papaparse');
    Papa.parse(csvData, {
      header: true,
      complete: results => resolve(results.data),
      error: error => reject(error)
    });
  });
}

module.exports = {train, getConfig, cli_train, parseCsv}; 
exports = {train, getConfig, cli_train, parseCsv};  


// if(config.firebase & !config.firebase.instance){ config.firebase.instance = firestore.init(config); }
// config.train.input.sourceTool = config[inputService]?.instance 