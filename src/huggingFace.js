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
     * 
     *  @desc deleteFiles uploadFile createRepo 
     *    - check if the account and or api key is valid
     *    https://huggingface.co/docs/api-inference/quicktour
     *    https://huggingface.co/docs/hub/security-tokens 
     *    // Attempt to use the token with an inference call 
     *    - check if the account and or api key is valid
     *    https://huggingface.co/docs/api-inference/quicktour
     *    https://huggingface.co/docs/hub/security-tokens
    */ 
    async tokenIsValid() {
        console.log("HuggingFace:tokenIsValid:Start");
        try {
            let models = await this.inference.listModels(); 
            console.log(models)
            return true
        } 
        catch (error) {
            console.error("HuggingFace:tokenIsValid:Error", error);
            return false
        }
    }

    /**
     * 
     * @desc deleteFiles uploadFile createRepo 
     * - check if a hub exists
     * https://huggingface.co/docs/datasets-server/valid
     * https://huggingface.co/docs/huggingface_hub/v0.10.0.rc0/en/package_reference/hf_api#:~:text=Hugging%20Face%20Hub%20API,the%20root%20of%20the%20package
     * 
    */ 
    async hubExists() {
        console.log("HuggingFace:hubExists:Start");
        try {
            let models = await this.inference.listModels(); 
            console.log(models)
            return true
        } 
        catch (error) {
            console.error("HuggingFace:hubExists:Error", error);
            return false
        }
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

/* 
TODO: 
- Create or update a model on the hub
https://huggingface.co/docs/huggingface_hub/guides/model-cards
https://huggingface.co/docs/hub/models-uploading

- connect a model on the hub to an inference endpoint
https://huggingface.co/docs/inference-endpoints/index#:~:text=%F0%9F%A4%97%20Inference%20Endpoints%20offers%20a,a%20Hugging%20Face%20Model%20Repository
https://huggingface.co/inference-endpoints#:~:text=1,Choose%20your%20cloud
https://moon-ci-docs.huggingface.co/docs/huggingface_hub/pr_1513/en/package_reference/inference_client#:~:text=The%20huggingface_hub%20library%20provides%20an,Hugging%20Face%E2%80%99s%20infrastructure%20for%20free


- check to see if a spaces exists
https://huggingface.co/docs/hub/main/spaces-overview
https://huggingface.co/docs/huggingface_hub/main/guides/manage-spaces

- update or create a space by uploading a dockerfile
https://huggingface.co/docs/hub/spaces-sdks-docker-panel
https://huggingface.co/docs/hub/spaces-sdks-docker

- have that space use dedicated 16gb gpu's 
https://huggingface.co/docs/huggingface_hub/main/guides/manage-spaces
https://huggingface.co/docs/huggingface_hub/main/guides/manage-spaces

- code to run the space as well as close it
https://huggingface.co/docs/hub/main/spaces-overview
https://huggingface.co/docs/hub/spaces
*/