import { HfInference } from '@huggingface/inference';
import { createRepo, uploadFile, deleteFiles} from "@huggingface/hub";

class HuggingFace {
    // Looks like the access token is all we need
    constructor(accessToken, defaultOptions) {
        this.accessToken = accessToken;
        this.defaultOptions = defaultOptions;

        const inference = new HfInference(this.accessToken);
        this.inference = inference;
    }

    /**
     * @desc Calls a question answer model on hugging face
     * @param {String} model 
     * @param {String} inputs 
     * @returns ?
     */
    async questionAnswering(model, inputs) {
        return await this.inference.questionAnswer({
            "model": model,
            "inputs": inputs,
        });
    }

    /**
     * @desc - Create a repository / folder in hugging face hubs
     * @param {String} repoPath - The path to the repo
     * @param {String} type - The type of repo. This is useful for "models"
     * @returns 
     */
    async createRepo(repoPath, type) {
        if (type == "model") {
            return await createRepo({
                repo: {type: type, name: repoPath},
                credentials: {accessToken: this.accessToken}
              });
        } else {
            return await createRepo({
                repo: repoPath, // or {type: "model", name: "my-user/nlp-test"},
                credentials: {accessToken: this.accessToken}
              });
        }
        
    }

    /**
     * @desc Upload a file, like a model to hugging face hub
     * @param {String} repoPath 
     * @param {String} filePath 
     * @param {Blob} blob 
     * @returns 
     */
    async uploadFile(repoPath, filePath, blob) {
        return await uploadFile({
            repo: repoPath,
            credentials: {accessToken: this.accessToken},
            // Can work with native File in browsers
            file: {
              path: filePath,  // Eg. "pytorch_model.bin",
              content: blob
            }
          });
    }

    /**
     * @desc Delete files in hugging face hub
     * @param {String} type - Space | 
     * @param {String} name - The path to the repo or space eg. my-user/my-space
     * @param {Array} path - An array of strings representing the file paths to delete
     * @returns 
     */
    async deleteFiles(type, name, paths) {
        return await deleteFiles({
            repo: {type: type, name: name}, // or "spaces/my-user/my-space"
            credentials: {accessToken: this.accessToken},
            paths: paths
          });
    }
    

    
}
module.exports = HuggingFace;