const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const firestore = require("./firestore");
require("dotenv").config(); 

function deploy(args) { 
  console.log(`~~~~ Start handleDeploy:${JSON.stringify(args)}:`);
  const config = getConfig(args);
  console.log(JSON.stringify(config))
  if(!config){return} 
  if(config.firebase){ firestore.handleFirebase(config.firebase); }
}

// Retrieves YAML using args.path, default: to langdrive.yaml
function getConfig(args){   
    // require(path.resolve(__dirname, args.clientJson)) 

    // Relative path to YAML
    // Note: process.cwd() is Directory where the CLI Executed From
    // Note: __dirname is the Directory of this Current File
    const currentDirectory = process.cwd();
    let yamlFilePath = args.path ? 
      path.resolve(currentDirectory, args[path]) : 
      path.resolve(currentDirectory, './langdrive.yaml')
  
    console.log(`- yamlFilePath: ${yamlFilePath}`);
  
    // Check if YAML File Exists
    let fileExists = fs.existsSync(yamlFilePath) 
    console.log(`YAML File ${fileExists?"Found": "Not Found"}\n`)
    if(!fileExists){return}
    console.log('getConfig5');

    // Check if it has contents
    const fileContents = fs.readFileSync(yamlFilePath, 'utf8'); 
    let config = yaml.load(fileContents);
    console.log(`YAML Content ${config?"Found": "Not Found"}\n`)
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
    return replaceEnvValues(config); 
}

module.exports = {deploy, getConfig};
exports = {deploy, getConfig};