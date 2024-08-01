const axios = require('axios');

class HerokuHandler {
    constructor(props) {
        this.herokuApiKey = props.herokuApiKey || null;
        this.username = props.username || null;
        this.password = props.password || null;
    }

    async checkInstall() {
        try {
            const response = await axios.get('https://api.heroku.com/apps', {
                headers: {
                    'Authorization': `Bearer ${this.herokuApiKey}`,
                    'Accept': 'application/vnd.heroku+json; version=3'
                }
            });
            console.log(`Heroku:checkInstall: CLI version: ${response.data}`);
            return true; // Heroku is installed
        } catch (err) {
            console.error('Heroku:checkInstall CLI is not installed.', err);
            return false; // Heroku is not installed
        }
    }

    async checkLogin() {
        try {
            const response = await axios.get('https://api.heroku.com/account', {
                headers: {
                    'Authorization': `Bearer ${this.herokuApiKey}`,
                    'Accept': 'application/vnd.heroku+json; version=3'
                }
            });
            console.log(`Heroku:checkLogin:Logged in as ${response.data.email}`);
            return true;
        } catch (error) {
            console.error('Heroku:checkLogin:Not logged in to Heroku.', error);
            return false;
        }
    }

    static async handleHeroku(args) {
        console.log('~~~~ Start handleHeroku\n');
        // Create a Heroku Handler
        const heroku = new HerokuHandler(args); 
        if(!await heroku.checkInstall()){ 
            console.log('HEROKU USER NOT INSTALLED\n')
            return {status:false, msg: 'Heroku Not Installed'};
        }
        if(!await heroku.checkLogin()){ 
            console.log('HEROKU USER NOT LOGGED IN\n')
            return {status:false, msg: 'Heroku User Not Logged In'};
        }
        else{
            console.log('HEROKU USER LOGGED IN\n')
            return {status:true, msg: 'Heroku User Logged In'}
        }
    }
}

module.exports = HerokuHandler;
exports = HerokuHandler;
// Benching this.
// 
// It was writting using exec & spawn commands to the shell which is hacky when a REST API is available.
// if(config.heroku.apiKey || config.heroku.username){ HerokuHandler.handleHeroku(config.heroku); }

/*
class HerokuHandler {
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
                // Todo: handleHerokuCommands();
            } 
            else { 
                console.log("Unable to log in to Heroku"); 
            }
        });
    }
    
    static async handleHeroku(args) {
      console.log('~~~~ Start handleHeroku\n');
      // Create a Heroku Handler
      const heroku = new HerokuHandler(args); 
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

}
*/

/*
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
