const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml'); 
const Train = require("./train");
require("dotenv").config(); 

// Gets the config and calls train
async function cli_train(args) { // console.log(`~~~~ cli_train: ARGS::${''}::\n`, args);  
  let config = getConfig(args); // console.log(`~~~~ cli_train: CONFIG::${''}::\n`, config);  
  config = mergeCliArgsAndYaml(args, config); // console.log(`~~~~ cli_train: MERGED::${''}:\n`, config);  
  config = await initConfig(config); // console.log(`~~~~ cli_train: INITIALIZED::${''}:\n`, config);  
  let training = await train(config);
  return config
}

// Retrieves YAML using args.path, default: to langdrive.yaml
// {[...services], train}
function getConfig(args){

  // Resolve Relative Path to YAML
  if(args.hasOwnProperty('yaml') && args['yaml'] == "false" ){return {}}
  const currentDirectory = process.cwd();
  let yamlFilePath = args.yaml ? 
    path.resolve(currentDirectory, args['yaml']) : 
    path.resolve(currentDirectory, './langdrive.yaml') 

  // Check if YAML File Exists
  let fileExists = fs.existsSync(yamlFilePath) 
  // console.log(`YAML File ${fileExists?"Found": "Not Found"}\n`)
  if(!fileExists){return {}} 

  // Check if it has contents
  const fileContents = fs.readFileSync(yamlFilePath, 'utf8'); 
  let config = yaml.load(fileContents);
  // console.log(`YAML Content ${config?"Found": "Not Found"}\n`)
  if(!config){return {}}  
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
function mergeCliArgsAndYaml(args, config) {  
  if(!args){return config}
  // console.log(`mergeCliArgsAndYaml:args`, args);
  config.train = config.train || {};  
  if (args['csv']) { config.train.path = args['csv']; }
  if (args['hfToken']) { 
    config.huggingface = {
      hfToken: args['hfToken'],
      ...(args['baseModel'] && { baseModel: args['baseModel'] }),
      ...(args['deployToHf'] && { deployToHf: args['deployToHf'] }),
      ...(args['hfModelPath'] && { hfModelPath: args['hfModelPath'] })
    };
  } 
  if (args['deploy']) { config.train.deploy = true; }
  if(args['path']){ config.train.path = args['path']; }
  if(args['outputValue']){ config.train.outputValue = args['outputValue']; }
  if(args['inputValue']){ config.train.inputValue = args['inputValue']; }
  if(args['outputPath']){ config.train.outputPath = args['outputPath']; }
  if(args['inputPath']){ config.train.inputPath = args['inputPath']; }
  config.verbose = args['verbose'] ? config.verbose : false;
   
  // config.verbose && console.log(`mergeCliArgsAndYaml:config`, config);
  return config
}

// without a query to match, the service does nothing
async function initClass (config, service){  
  if(!!!service){return false} 
  if(!!service){
    if(service=='csv'){return 'csv'} // todo: Class should be something like 'RawFileFromPath'
    let classInstance = await require(`./${service}`)  
    let returnThis = await classInstance?.init({verbose: config.verbose, ...config[service]})
    return returnThis
  }
}

async function initConfig(config) {
  // console.log(`~~~~ initConfig:`); //${JSON.stringify(config)}:`);   
  if(!config){return false} 
  config?.train?.service && ( config.train.service = await initClass(config, config.train?.service) ); 
  config?.train?.inputService && ( config.train.inputService = await initClass(config, config.train.input.service) ); 
  config?.train?.outputService && ( config.train.outputService =  await initClass(config, config.train.output.service) );
  // console.log(`~~~~ initConfig:`, config)
  return config
}

async function train(config) {
  // console.log(`~~~~ train: START `); 
  if(!config){return} 
  
  // Train the model using the spec  
  let trainConfig = {verbose: config.verbose, ...config.train};
  // console.log('trainConfig', Object.keys(trainConfig))
  let trainer = await Train.init(trainConfig); 
 
  let trainOnThis = {...{deployToHf: config.train.deploy||false}, ...config.huggingface}
  console.log({config}, {trainer})
  let trainingResults = await trainer.trainModel(trainOnThis);

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


  // Note: process.cwd() is Directory where the CLI Executed From
  // Note: __dirname is the Directory of this Current File

  // config.train.input.serviceName == config.serviceName == class serviceName 