const { OpenAI } = require("langchain/llms/openai");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const {
  BufferMemory,
  BufferWindowMemory,
  CombinedMemory,
  ConversationSummaryMemory,
  ChatMessageHistory
} = require("langchain/memory");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { Ollama } = require("langchain/llms/ollama");
const { HumanMessage, AIMessage, SystemMessage } = require("langchain/schema");
const DriveUtils = require("./drive_utils");
const { HuggingFaceInference } = require("langchain/llms/hf");
const { Calculator } = require("langchain/tools/calculator");
const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { DynamicTool } = require("langchain/tools");
const { EntityMemory, ENTITY_MEMORY_CONVERSATION_TEMPLATE, VectorStoreRetrieverMemory } = require("langchain/memory");
const {
  DEFAULT_PREFIX,
  DEFAULT_SUFFIX,
  PREFIX_END,
  TEMPLATE_TOOL_RESPONSE,
  FORMAT_INSTRUCTIONS
} = require("./prompts");

const { ChatPromptTemplate, MessagesPlaceholder, StringPromptValue } = require("langchain/prompts");

const { spawn } = require("child_process");
//
// https://myaccount.google.com/connections?filters=3,4&hl=en
// https://developers.google.com/oauthplayground/
// https://console.cloud.google.com/apis/credentials/oauthclient/
//

/* 
// 
// TODO: request_headers: {} // Example: {'Bearer Token: <API KEY>}  
// MaybeDO ? - this.drive_chatbot.generate_OAuth2Link()  
// ['buffer', 'conversation_buffer_window', 'buffer_window', 'entity', 'multiple', 'conversation_summary', 'vector_store']
*/

class Chatbot {
  constructor(props) {
    this.verbose = props.verbose || false;
    this.driveUtils = props.CLIENT_ID
      ? new DriveUtils(props.CLIENT_ID, props.CLIENT_SECRET, {
          ACCESS_TOKEN: props.ACCESS_TOKEN,
          verbose: this.verbose
        })
      : false;
    this.drive_chat_history_filename = props.drive_chat_history_filename || "chatbot_chat_history.json";
    this.drive_chat_history_filepath = props.drive_chat_history_filepath || "./";
    this.drive_embeddings_filename = props.drive_embeddings_filename || "chatbot_embeddings.json";
    this.drive_embeddings_filepath = props.drive_embeddings_filepath || "./";
    this.drive_document_directory_filename = props.drive_documents_filename || "chatbot_documents.json";
    this.drive_document_directory_filepath = props.drive_document_directory_filepath || "./";

    this.model = props.model;
    this.model_config = props.model_config;
    const useOpenAiModel = !!this.model_config.openAIApiKey;
    const useHfAiModel = !!this.model_config.huggingFaceApiKey;
    if (!this.model && useOpenAiModel) this.model = "chatOpenAi";
    if (!this.model && useHfAiModel) this.model = "huggingFace";
    if (!this.model && !openAiModel && !useOpenAiModel) {
      // Install the huggingface Flant t5 small model and spin up a local endpoint for that.
      this.model = "Endpoint";
      this.model_config = { baseUrl: "http://localhost:8912/", model: "meta-llama/Llama-2-7b" };
      const model_server = spawn("node", [__dirname + "/ollama_server.js", "--model", "meta-llama/Llama-2-7b"]);
      model_server.stdout.on("data", data => console.log(`stdout: ${data}`));
      model_server.stderr.on("data", data => console.error(`stderr: ${data}`));
      model_server.on("close", code => console.log(`child process exited with code ${code}`));
      console.debug(
        "WARNING: Using Default model. PLEASE update using props.model: ['openAi', 'huggingFace', 'Endpoint']."
      );
    }
    if (!this.model_config) {
      console.debug(
        "WARNING: Using Default model config. PLEASE update props.model_config to correspond with a valid langchain configuration object \
        EXAMPLE: chatBot({ \
          model:'openAi', \
          model_config:{ \
            modelName: 'gpt-3.5-turbo', \
            maxTokens: 256, \
            openAIApiKey: OPENAI_API_KEY, \
            temperature: 0.9 })"
      );
    }
    if (this.model.includes("openAi")) this.model = new OpenAI(this.model_config);
    else if (this.model.includes("chatOpenAi") || useOpenAiModel) this.model = new ChatOpenAI(this.model_config);
    else if (this.model.includes("huggingFace") || useHfAiModel) {
      this.model_config.model_id = this.model_config.model_id || this.model_config.modelName || "meta-llama/Llama-2-7b";
      this.model = new HuggingFaceInference(this.model_config);
    } else if (this.model === "Endpoint") this.model = new Ollama(this.model_config);
    else
      console.error(
        "Error: At least one model must be specified. Values: ['chatOpenAi', 'openAi', 'huggingFace', 'Endpoint']"
      );

    this.chat_history_id = null;
    this.pastMessages = [];

    this.memory_length = props.memory_length || 5;
    this.vector_length = props.vector_length || 2;

    this.chat_embeddings_id = null;
    this.embeddings_data = [];

    this.memory = false;
    this.agent = props.agent || "chat-conversational-react-description";
    this.agent_config = props.agent_config || {};
    this.agent_verbose = props.agent_verbose || this.verbose;
    this.tools = [
      new Calculator(),
      new DynamicTool({
        name: "Drive Util: List Files",
        description: "Call this to get a list of all files of a mimeType in a users drive. Inputs: mimeType",
        func: async () => {
          this.verbose && console.log("Drive Util: List Files");
          try {
            let response = await this.driveUtils.listFiles();
            let filenames = response.data.files.map(file => file.name).slice(0, 10);
            return filenames;
          } catch (error) {
            let msg = "Error Connecting to Drive.";
            this.verbose && console.log(error);
            return msg;
          }
        },
        ...(props.tools || [])
      }),
      new DynamicTool({
        name: "Drive Util: Read Contents",
        description: "Call this to get a single file in a users drive. Inputs: filename.ext",
        func: async (filename = "test.txt") => {
          try {
            this.verbose && console.log("Drive Util: Read Contents");
            let response = await this.driveUtils.getFileByName(filename);
            let innerContent = response.data;
            return innerContent;
          } catch (error) {
            let msg = "Error Connecting to Drive.";
            console.log(error);
            return msg;
          }
        }
      })
    ];

    this.DEFAULT_PREFIX = props.default_prefix || DEFAULT_PREFIX;
    this.DEFAULT_SUFFIX = props.default_suffix || DEFAULT_SUFFIX;
    this.bufferMemory = [];
    this.vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
    this.vectorStoreMemory = new VectorStoreRetrieverMemory({
      vectorStoreRetriever: this.vectorStore.asRetriever(this.vector_length), // Return top n docs
      memoryKey: "chat_vector",
      inputKey: "input"
    });
    this.memory = [];
    // Fetch data from drive and initialize the chatbot using user-given props
    this.init();
  }

  async getMemory() {
    if (this.driveUtils) {
      try {
        let response = await this.driveUtils.createAndOrGetFile(
          this.drive_chat_history_filename,
          "application/json",
          `[]`
        );
        this.chat_history_id = response.data.metadata.id;
        this.pastMessages = this.mapMessages(response.data.file);
        // console.log({ past_msgs: this.pastMessages });
      } catch (error) {
        this.verbose && console.error("ERROR: Failed to get message history:", error);
      }
      try {
        let response = await this.driveUtils.createAndOrGetFile(
          this.drive_embeddings_filename,
          "application/json",
          `[]`
        );
        this.chat_embeddings_id = response.data.metaData.id;
        this.embeddings_data = response.data.file;
        // this.embeddings_data.map( input => {
        //     await this.vectorStoreMemory.saveContext({ input: "I don't the Celtics" }, { output: "ok" });
        // })
        let memoryVectors = this.vectorStoreMemory.vectorStoreRetriever.vectorStore.memoryVectors;
        memoryVectors = this.embeddings_data;
      } catch (error) {
        this.verbose && console.error("ERROR: Failed to get embeddings data:", error);
      }
    } else {
      this.verbose &&
        console.log(
          "Google Drive Not Configured. For data persistance, please provide: CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN*"
        );
    }
  }

  // Fetch data from drive and initialize the chatbot using user-given props
  async init() {
    this.getMemory();
    this.bufferMemory = new BufferWindowMemory({
      chatHistory: new ChatMessageHistory(this.pastMessages),
      k: this.memory_length,
      returnMessages: true,
      memoryKey: "chat_history",
      inputKey: "input"
    });
    this.memory = new CombinedMemory({
      memories: [this.bufferMemory, this.vectorStoreMemory]
    });

    //
    // Initialize the agent. ConversationChain is used as the default agent w a BufferMemory.
    // Always use this one for now.
    //
    this.agentExecutor = await initializeAgentExecutorWithOptions(this.tools, this.model, {
      agentType: this.agent,
      memory: this.memory,
      verbose: this.agent_verbose,
      ...this.agent_config,
      agentArgs: {
        systemMessage: this.DEFAULT_PREFIX,
        humanMessage: this.DEFAULT_SUFFIX
      }
    });
    let chain = this.agentExecutor.agent.llmChain;
    let prompt_messages = chain.prompt.promptMessages;

    // This will insert our chat_vector memory into the model
    prompt_messages = [new MessagesPlaceholder("chat_vector"), ...prompt_messages];

    let memory = this.agentExecutor.memory;
    // uses the originals result but then modifies it to work w the agent.
    // when agentExecutor.call is made, base chain calls _formatValues which retrieves data from memory.
    memory.loadMemoryVariables_original = memory.loadMemoryVariables;
    memory.loadMemoryVariables = async values => {
      let returnThis = await memory.loadMemoryVariables_original(values);
      returnThis.chat_vector = [
        new SystemMessage(
          "## Past Conversations \n\n The following is an text extract from past conversations that LangDrive can use:  \n" +
            returnThis.chat_vector
        )
      ];
      return returnThis;
    };
    /*
    // This would add a new input to the human message?
    let systemPrompt = prompt_messages[2].prompt;
    systemPrompt.inputVariables = [...systemPrompt.inputVariables, "chat_vector"];
    systemPrompt.template = systemPrompt.template + "{chat_vector}\n";
    */
    let template = ChatPromptTemplate.fromPromptMessages(prompt_messages);
    this.agentExecutor.agent.llmChain.prompt = template;
    return true;
  }
  async sendMessage(message) {
    //const response = await (await this.model).predict(message);
    // console.log("CALLING agentExecutor ");
    // executes from chains/base.cjs

    //
    let response = await this.agentExecutor.call({ input: message });
    // console.log("chatbot_reply: ", response);

    this.saveMemory();
    return response.output;
  }

  saveMemory() {
    if (this.driveUtils) {
      // Update the drive each time.
      let memories = this.agentExecutor.memory.memories;
      try {
        let bufferMemory = this.agentExecutor.memory.memories[0];
        /*
          console.log(
            "\n\n\n SAVING this.agent.memory bufferMemory: ",
            { memory: bufferMemory.chatHistory.messages },
            "\n\n\n"
          );
        */
        let status = this.driveUtils.updateFile(
          this.chat_history_id,
          "application/json",
          bufferMemory.chatHistory.messages
        );
      } catch (error) {
        console.log("ERROR: Could not Save Chat History: ", error);
      }
      // Update the drive each time.
      try {
        let vectorMemory = this.agentExecutor.memory.memories[1];
        let vectors = vectorMemory.vectorStoreRetriever.vectorStore.memoryVectors;
        // console.log("\n\n\n SAVING this.agent.memory vectorMemory: ", { vectors }, "\n\n\n");
        // console.log(this.chat_embeddings_id);
        let status = this.driveUtils.updateFile(this.chat_embeddings_id, "application/json", vectors);
        // console.log({ status });
      } catch (error) {
        console.log("ERROR: Could not Save Chat Embeddings: ", error);
      }
    }
  }
  //
  // Chatbot non-drive Helper Functions
  //

  // De-serialize the chat history. Used in init()
  mapMessages(content) {
    // console.log("Mapping Messages...", content);
    return (
      content.map(msg => {
        const content = msg.kwargs.content;
        const additional_kwargs = msg.kwargs.additional_kwargs;

        if (msg.id.includes("HumanMessage")) {
          return new HumanMessage(content, additional_kwargs);
        } else if (msg.id.includes("AIMessage")) {
          return new AIMessage(content, additional_kwargs);
        } else if (msg.id.includes("SystemMessage")) {
          return new SystemMessage(content, additional_kwargs);
        }
      }) || []
    );
  }
}
module.exports = Chatbot;
