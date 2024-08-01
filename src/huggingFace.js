// uploadFile
const { deleteFiles, createRepo, deleteRepo, listSpaces, uploadFilesWithProgress } = require("@huggingface/hub");
var fs = require('fs').promises;
var path = require('path');
const axios = require('axios');

class HuggingFace {
    constructor(accessToken) {
        this.credentials = { accessToken };
    }
    
    // repoFullName = 'username/repoName'
    // directoryPath = Folder containing docker training service. Default: Autotrain-advanced. 
    // isPrivate = Default: false
    // hardware -  Default: 't4-medium'
    // secrets = A list of env variables the trainer will recieve. eg: { key: 'key1', value: 'val1'}], Default: []
    
    async createOrUpdateSpace(repoFullName, directoryPath = false, isPrivate = false, hardware = 't4-medium', secrets = []) {
        try { 
            const username = repoFullName.split('/')[0]; 
            let existingSpaces = await this.listSpaces(username); 
            console.log('Spaces check: ', { existingSpaces }); 
            let spaceExists = existingSpaces.some(space => space.name === repoFullName); 
            if (spaceExists) {  
                console.log('Deleting: ', { repoFullName });
                await this.deleteSpace(repoFullName); 
            } 
            existingSpaces = await this.listSpaces(username); 
            spaceExists = existingSpaces.some(space => space.name === repoFullName); 
            if (!spaceExists) { 
                var files = await this.getFiles(directoryPath || path.join(__dirname, 'train/image/') );
                console.log('Creating: ', repoFullName, 'With Files: ', {files}) 
                await createRepo({
                    repo: { name: repoFullName, type: "space" }, 
                    credentials: this.credentials,
                    private: isPrivate,
                    sdk: "docker", // Required for space 
                    hardware: hardware,
                    files,
                }); 
                console.log(`Space '${repoFullName}' created.`); 
                this.upgradeSpace(repoFullName, hardware); 
                const defaults = {
                    "PROJECT_NAME": 'my_llm',
                    "MODEL_NAME": 'abhishek/llama-2-7b-hf-small-shards',
                    "PUSH_TO_HUB": false,
                    "HF_TOKEN": this.credentials.accessToken,
                    "REPO_ID": repoFullName
                }; 
                secrets.forEach(secret => {
                    // Override default value if key exists in secrets
                    if (defaults.hasOwnProperty(secret.key)) {
                        defaults[secret.key] = secret.value;
                    }

                    // Set the secret, regardless of whether it was in defaults or not
                    this.setSecret(repoFullName, secret.key, secret.value);
                });
            } 
        } catch (error) {
            console.error('Error in createOrUpdateSpace:', error);
            throw error;
        }
    }
    
    async setSecret(repoFullName, secretKey, secretValue) {
        const endpoint = 'https://huggingface.co';
        const headers = { 'Authorization': `Bearer ${this.credentials.accessToken}`};
        const payload = {
            key: secretKey, 
            value: secretValue, 
        };
        try {
          const response = await axios.post(`${endpoint}/api/spaces/${repoFullName}/secrets`, payload, { headers });
          console.log('secret request response:', response.data);
        } catch (error) {
          console.error('Error requesting new secret:', error.response ? error.response.data : error);
        }
    }

    async upgradeSpace(repoFullName, hardware) {
        const endpoint = 'https://huggingface.co';
        const headers = { 'Authorization': `Bearer ${this.credentials.accessToken}`};
        const payload = { 
            flavor: hardware
        };
        try {
          const response = await axios.post(`${endpoint}/api/spaces/${repoFullName}/hardware`, payload, { headers });
          console.log('Hardware request response:', response.data);
        } catch (error) {
          console.error('Error requesting new hardware:', error.response ? error.response.data : error);
        }
    }

    async getFiles(directoryPath, rootPath = directoryPath) {
        console.log('directory path: ', {directoryPath})
        const entries = await fs.readdir(directoryPath, { withFileTypes: true });
        const files = await Promise.all(entries.map((entry) => {
            const fullPath = path.join(directoryPath, entry.name);
            let relativePath = path.relative(rootPath, fullPath);
            relativePath = relativePath.replace(/\\/g, '/'); // linux path
    
            if (entry.isDirectory()) {
                return this.getFiles(fullPath, rootPath);
            } else {
                return fs.readFile(fullPath).then((content) => ({
                    path: relativePath,
                    content: new Uint8Array(content),
                }));
            }
        }));
    
        // Flatten the array and remove any possible empty slots
        return Array.prototype.concat(...files);
    }
    
    async uploadDirectory(repoFullName, directoryPath) {
        // Read all files in the directory
        var filenames = await fs.readdir(directoryPath);
      
        // Map each filename to a File object
        var files = await Promise.all(filenames.map(async function(filename) {
          var filePath = path.join(directoryPath, filename);
          var content = await fs.readFile(filePath);
          return { path: filePath, content };
        }));
      
        // Call uploadFilesWithProgress with necessary parameters
        for await (var event of uploadFilesWithProgress({
            credentials: this.credentials,
            repo: repoFullName,
            files,
            // commitTitle: `Add ${files.length} files`,
            // hubUrl: '', // Your hubUrl here
            // branch: '', // Your branch here
            // isPullRequest: false, // Or true if it's a PR
            // parentCommit: '', // Your parentCommit here
            // useWebWorkers: false, // Or true if you want to use web workers
        })) {
          console.log('Upload progress:', event);
        }
      
        console.log('Upload completed');
    } 
    
    async listSpaces(owner) {
        try {
            // console.log('Listing spaces for owner:', owner);
    
            const spaces = [];
            for await (const space of listSpaces({ search: { owner:owner }, credentials: this.credentials })) {
                // console.log('Found space:', space.id);
                spaces.push(space);
            }
            return spaces;
        } catch (error) {
            console.error('Error listing spaces:', error);
            throw error;
        }
    }

    async deleteSpace(repoName) {
        try { 
            const deleteParams = {
                repo: { name: repoName, type: "space" },
                credentials: this.credentials
            };  
            // console.log('Deleting space:', repoName);
            await deleteRepo(deleteParams); 
        } catch (error) {
            console.error('Error deleting space:', error);
            throw error;
        }
    }

}

module.exports = HuggingFace;



//
// api.request_space_hardware(repo_id=TRAINING_SPACE_ID, hardware=SpaceHardware.CPU_BASIC)
// else: api.request_space_hardware(repo_id=TRAINING_SPACE_ID, hardware=SpaceHardware.T4_MEDIUM)
//