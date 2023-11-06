const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { spawn } = require("child_process"); 

// spawns a shell and runs a command within that shell, non interactive
// exec(command[, options][, callback])
const { promisify } = require('util');
const exec = promisify(require('child_process').exec); 

require("dotenv").config();
const os = require('os');
const isWindows = process.platform === 'win32'

function handleDeploy(args) {
    console.log('~~~~ Start handleDeploy');
    const config = getConfig(args);
    console.log(JSON.stringify(config))
    if(!config){return}
    if(config.heroku.apiKey || config.heroku.username){
        handleHeroku(config.heroku);
    }
    if(config.firebase){
        handleFirebase(config.firebase);
    }
}

function getConfig(args){ 
    // Relative path to YAML
    // Note: process.cwd() is Directory where the CLI Executed From
    // Note: __dirname is the Directory of this Current File
    const currentDirectory = process.cwd();
    let yamlFilePath = args.indexOf('--path') > 0 ? 
      path.resolve(currentDirectory, args[args.indexOf('--path') + 1]) : 
      path.resolve(currentDirectory, './addy.yaml')
  
    // console.log(`- yamlFilePath: ${yamlFilePath}`);
  
    // Check if YAML File Exists
    let fileExists = fs.existsSync(yamlFilePath)
    //console.log(`YAML File ${fileExists?"Found": "Not Found"}\n`)
    if(!fileExists){return}

    // Check if it has contents
    const fileContents = fs.readFileSync(yamlFilePath, 'utf8'); 
    let config = yaml.load(fileContents);
    console.log(`YAML Content ${config?"Found": "Not Found"}\n`)
    if(!config){return}

    // console.log(`- yamlData: ${JSON.stringify(config)}`);
    config.heroku = { 
        ...{
            apiKey : process.env.herokuApiKey || false,
            username : args.indexOf('--username') ? args[args.indexOf('--username') + 1] : false,
            password : args.indexOf('--password') ? args[args.indexOf('--password') + 1] : false
        },
        ...config.heroku
    }
    return config;
}

async function handleHeroku(args) {
    console.log('~~~~ Start handleHeroku\n');
    // Create a Heroku Handler
    const heroku = new herokuHandler(args); 
    if(!await heroku.installed){ 
        console.log('HEROKU USER NOT INSTALLED\n')
        if (!isWindows){ heroku.install(); } // Optional auto-install
        if(!heroku.installed) return {status:false, msg: 'Heroku Not Installed'};
    }
    if(!await heroku.loggedIn){ 
        console.log('HEROKU USER NOT LOGGED IN\n')
        heroku.login(); // Optional auto-install
        if(!heroku.loggedIn) return {status:false, msg: 'Heroku User Not Logged In'};
    }
    else{
        console.log('HEROKU USER LOGGED IN\n')
        return {status:true, msg: 'Heroku User Logged In'}
    }
}

async function handleFirebase(args) {
    console.log('~~~~ Start handleFirebase\n');
    // Create a Firebase Handler
    const firebase = new firebaseHandler(args); 
    if(!await firebase.installed){ 
        console.log('FIREBASE USER NOT INSTALLED\n')
        if (!isWindows){ firebase.install(); } // Optional auto-install
        if(!firebase.installed) return {status:false, msg: 'FIREBASE Not Installed'};
    }
    if(!await firebase.loggedIn){ 
        console.log('FIREBASE USER NOT LOGGED IN\n')
        firebase.login(); // Optional auto-install
        if(!firebase.loggedIn) return {status:false, msg: 'FIREBASE User Not Logged In'};
    }
    else{
        console.log('FIREBASE USER LOGGED IN\n', firebase)
        return {status:true, msg: 'FIREBASE User Logged In'}
    }
}

module.exports = handleDeploy;


class firebaseHandler {
    constructor(props) {
        this.checkInstall = this.checkInstall.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
        this.firebaseApiKey = props.firebaseApiKey || null;
        this.firebaseUsername = props.firebaseUsername || null;
        this.firebasePassword = props.firebasePassword || null;
        this.setup();
    }

    setup(){
        this.installed = this.checkInstall();
        this.loggedIn = this.installed && this.checkLogin();
    }

    async checkInstall() {
        try { 
          const command = isWindows ? 'firebase.cmd' : 'firebase';
          const { stdout } = await exec(`${command} --version`);
          console.log(`Firebase:checkInstall: CLI version: ${stdout}`);
          return true; // Firebase is installed
        } catch (err) {
          console.error('Firebase:checkInstall: CLI is not installed.', err);
          return false; // Firebase is not installed
        }
    }

    install() {
        // Note: This installation script is for Unix-like systems only.
        // For Windows, you would have to download the installer and run it.
        console.log('Attempting to install Firebase CLI...');
    
        const child = spawn('sh', ['-c', 'curl -sL https://firebase.tools | bash']);
      
        child.stdout.on('data', (data) => {
          console.log(data.toString());
        });
      
        child.stderr.on('data', (data) => {
          console.error(data.toString());
        });
      
        child.on('close', (code) => {
          if (code === 0) {
            console.log('Firebase CLI installed successfully.');
          } 
          else {
            console.error('Failed to install Firebase CLI.');
          }
        });
    }

    async checkLogin() {
        try {
          const { stdout } = await exec('firebase whoami');
          console.log(`Firebase:checkLogin: Logged in as ${stdout.trim()}`);
          return true;
        } catch (error) {
          console.error('Firebase:checkLogin: Not logged.', error);
          return false;
        }
    }

    login() {
        console.log('~~~~ ~~~~ Firebase:Login:Start\n');
    
        // // Subprocess Must be a standalone executable so we invoke a shell with our command as an argument
        const cliProcess = spawn(isWindows ? 'cmd.exe' : 'sh', ["firebase login"]);
    
        cliProcess.stdout.on("data", data => { console.log(`CLI process output: ${data}`); });
        cliProcess.stderr.on("data", data => { console.error(`CLI process error: ${data}`); });
        cliProcess.on("close", code => { console.log(`CLI process exited with code ${code}`); });
        cliProcess.stdin.write(`${user_input}\n`, error => { console.error(`Firebase:Login:Error writing to CLI process: ${error}`); });
        cliProcess.stdout.once("data", data => {
            console.log("CLI executed successfully");
            console.log(`CLI process output: ${data}`)
            if (data.includes("Logged in")) {
                console.log("Logged in to Firebase");
                // handleFirebaseCommands();
            } 
            else { 
                console.log("Unable to log in to Firebase"); 
            }
        });
    }

}

class herokuHandler {
    constructor(props) {
        this.checkInstall = this.checkInstall.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
        this.herokuApiKey = props.herokuApiKey || null;
        this.username = props.username || null;
        this.password = props.password || null;
        this.installed = this.checkInstall();
        this.loggedIn = this.installed && this.checkLogin();
    }

    async checkInstall() {
        try { 
          const command = isWindows ? 'heroku.cmd' : 'heroku';
          const { stdout } = await exec(`${command} --version`);
          console.log(`Heroku:checkInstall: CLI version: ${stdout}`);
          return true; // Heroku is installed
        } catch (err) {
          console.error('Heroku:checkInstall CLI is not installed.', err);
          return false; // Heroku is not installed
        }
    }

    install() {
        // Note: This installation script is for Unix-like systems only.
        // For Windows, you would have to download the installer and run it.
        console.log('Attempting to install Heroku CLI...');
    
        const child = spawn('sh', ['-c', 'curl https://cli-assets.heroku.com/install.sh | sh']);
      
        child.stdout.on('data', (data) => {
          console.log(data.toString());
        });
      
        child.stderr.on('data', (data) => {
          console.error(data.toString());
        });
      
        child.on('close', (code) => {
          if (code === 0) {
            console.log('Heroku CLI installed successfully.');
          } else {
            console.error('Failed to install Heroku CLI.');
          }
        });
    }
    
    async checkLogin() {
        try {
          const { stdout } = await exec('heroku whoami');
          console.log(`Heroku:checkLogin:Logged in as ${stdout.trim()}`);
          return true;
        } catch (error) {
          console.error('Heroku:checkLogin:Not logged in to Heroku.', error);
          return false;
        }
    }
    
    login() { 
        const user_input = this.username
        console.log('~~~~ ~~~~ Heroku:login:Start \n');
    
        // // Subprocess Must be a standalone executable so we invoke a shell with our command as an argument
        const cliProcess = spawn(isWindows ? 'cmd.exe' : 'sh', ["heroku login"]);
    
        cliProcess.stdout.on("data", data => { console.log(`CLI process output: ${data}`); });
        cliProcess.stderr.on("data", data => { console.error(`CLI process error: ${data}`); });
        cliProcess.on("close", code => { console.log(`CLI process exited with code ${code}`); });
        cliProcess.stdin.write(`${user_input}\n`, error => { console.error(`Heroku:Login:Error: writing to CLI process: ${error}`); });
        cliProcess.stdout.once("data", data => {
            console.log("CLI executed successfully");
            console.log(`CLI process output: ${data}`)
            if (data.includes("Logged in")) {
                console.log("Logged in to Heroku");
                // handleHerokuCommands();
            } 
            else { 
                console.log("Unable to log in to Heroku"); 
            }
        });
    }
}


/*
// --path relativeDirectoryFromExecPath/addy.yaml

heroku login command 
- now opens your web browser to complete the login flow
- - stores API tokens in the standard Unix file ~/.netrc ($HOME\_netrc on Windows).
- - - The netrc format is well established and well supported by various network tools on unix.
- - - This way `curl -n` can access the Heroku API with little or no extra work
- - Overwride it using HEROKU_API_KEY environment variable.

- To continue using the interactive, terminal-based login flow, pass the --interactive option to heroku login
- - Error: Your account has MFA enabled; API requests using basic authentication with email and password are not supported. 
- - - Please generate an authorization token for API access.

let herokuCommands = `
    heroku login
    heroku ps:resize basic -a addy-puppeteer
    heroku ps:resize Standard-1x -a addy-puppeteer
    heroku ps:scale web=2 -a addy-puppeteer
    heroku apps:info -a addy-puppeteer
    heroku auth:whoami
    heroku deploy
`

*/
