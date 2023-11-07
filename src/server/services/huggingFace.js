import { HfInference } from '@huggingface/inference'

class HuggingFace {
    // Looks like the access token is all we need
    constructor(accessToken, defaultOptions) {
        this.accessToken = accessToken;
        this.defaultOptions = defaultOptions;

        const hf = new HfInference(this.accessToken);
        this.hf = hf;
    }

    /**
     * @desc Calls a question answer model on hugging face
     * @param {String} model 
     * @param {String} inputs 
     * @returns ?
     */
    async questionAnswering(model, inputs) {
        return await this.hf.questionAnswer({
            "model": model,
            "inputs": inputs,
        });
    }
}
module.exports = HuggingFace;