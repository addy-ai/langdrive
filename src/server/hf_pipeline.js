const DEFAULT_MODEL_ID = "gpt2";
const DEFAULT_TASK = "text-generation";
const VALID_TASKS = [
  "text2text-generation",
  "text-generation",
  "summarization",
];

class LocalPipeline {
  constructor(
    pipeline,
    modelId = DEFAULT_MODEL_ID,
    modelKwargs = {},
    pipelineKwargs = {}
  ) {
    this.pipeline = pipeline;
    this.modelId = modelId;
    this.modelKwargs = modelKwargs;
    this.pipelineKwargs = pipelineKwargs;
  }

  static async from_model_id(
    modelId,
    task,
    modelKwargs = {},
    pipelineKwargs = {}
  ) {
    let model;
    let tokenizer;
    import("@xenova/transformers").then(
      async ({ AutoTokenizer, AutoModelForSeq2SeqLM, env }) => {
        env.localModelPath = `.`; // Set to current directory
        env.allowRemoteModels = false; // Disable pulling from HF
        console.log("THE MODEL STARTs");
        tokenizer = await AutoTokenizer.from_pretrained(modelId); // (modelId, modelKwargs)
        try {
          if (task === "text-generation") {
            model = await TFAutoModelForCausalLM.fromPretrained(
              modelId,
              modelKwargs
            );
          } else if (
            task === "text2text-generation" ||
            task === "summarization"
          ) {
            console.log("LOADING FROM PRETRAINED");
            model = await AutoModelForSeq2SeqLM.from_pretrained(modelId); // Xenova/t5-small
            // await TFAutoModelForSeq2SeqLM.fromPretrained( modelId, modelKwargs);
          } else {
            throw new Error(
              `Got invalid task ${task}, currently only ${VALID_TASKS} are supported`
            );
          }
        } catch (e) {
          throw new Error(
            `Could not load the ${task} model due to missing dependencies.`
          );
        }
        console.log("TESTING");
      }
    );

    // Create the pipeline function based on your specific task and model
    const pipeline = async (inputs) => {
      console.log("Pipeline Inputs: ", inputs);
      console.log("Model", model);
      console.log("Tokenizer", tokenizer);
      // Process inputs using the tokenizer (encode, padding, etc.)
      // Pass the processed inputs to the model
      // Perform inference with the model
      // Return the generated output
      // Your implementation here
      let { input_ids } = await tokenizer(
        "translate English to German: I love transformers!"
      );
      let outputs = await model.generate(input_ids);
      let decoded = tokenizer.decode(outputs[0], {
        skip_special_tokens: true,
      });
      console.log({ decoded }); // 'Ich liebe Transformatoren!'
    };

    return new LocalPipeline(pipeline, modelId, modelKwargs, pipelineKwargs);
  }

  static async call(inputs) {
    console.log("CALLED");
  }
  static async _call(inputs) {
    console.log("_call");
  }
  static async callKeys(inputs) {
    console.log("callKeys");
  }

  async predict(inputs) {
    console.log("predict");
  }
}

module.exports = LocalPipeline;

/*
        pipeline = pipeline(
        "text2text-generation",
        (model = model),
        (tokenizer = tokenizer),
        (max_length = 128)
        );
        hf_llm = HuggingFacePipeline((pipeline = pipeline));
    }
    );
    */
