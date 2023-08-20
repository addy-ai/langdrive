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
/* 
//
// https://myaccount.google.com/connections?filters=3,4&hl=en
//
// `drive_chatbot` - Uses a dual layered chain conditionally integrated with drive_utils.  
// drive_utils - Syncs data to a users google drive folder if the drive_chatbot is initialized with their OAuth2 access token 
// - - the extent of the data sync is conditioned on Auth scope
// 
// TODO: modle_one_endpoint_request_headers: {} // Example: {'Bearer Token: <API KEY>}  
// TODO - this.drive_chatbot.generate_OAuth2Link() 
// TODO: MAYBE: Use google oauth not passport to get refreshToken and to get oAuth URL callback for front end.
// TODO: allow config of Agent type:
// TODO: allow config of memory type: 
// ['buffer', 'conversation_buffer_window', 'buffer_window', 'entity', 'multiple', 'conversation_summary', 'vector_store']
*/

class Chatbot {
  constructor(props) {
    this.driveUtils = props.CLIENT_ID
      ? new DriveUtils(props.CLIENT_ID, props.CLIENT_SECRET, props.ACCESS_TOKEN)
      : false;
    this.drive_chat_history_filename = props.drive_chat_history_filename || "chatbot_chat_history.json";
    this.drive_chat_history_filepath = props.drive_chat_history_filepath || "./";
    this.drive_embeddings_filename = props.drive_embeddings_filename || "chatbot_embeddings.json";
    this.drive_embeddings_filepath = props.drive_embeddings_filepath || "./";
    this.drive_document_directory_filename = props.drive_documents_filename || "chatbot_documents.json";
    this.drive_document_directory_filepath = props.drive_document_directory_filepath || "./";

    if (!props.model) console.error("Error: At least one model must be specified.");
    else if (props.model.includes("chatOpenAi")) this.model = new ChatOpenAI(props.model_config);
    else if (props.model.includes("openAi")) this.model = new OpenAI(props.model_config);
    else if (props.model.includes("huggingFace")) this.model = new HuggingFaceInference(props.model_config);
    else if (props.model === "Endpoint") this.model = new Ollama(props.model_config);
    else console.error("Error: At least one model must be specified. Values: ['openAi', 'huggingFace', 'Endpoint']");

    this.chat_history_id = null;
    this.pastMessages = [];

    this.memory_length = props.memory_length || 5;
    this.vector_length = props.vector_length || 2;

    this.chat_embeddings_id = null;
    this.embeddings_data = [];

    this.memory = false;
    this.agent = props.agent || "chat-conversational-react-description";
    this.agent_config = props.agent_config || {};
    this.agent_verbose = props.agent_verbose || false;
    this.tools = [
      new Calculator(),
      new DynamicTool({
        name: "Drive Util: List Files",
        description: "Call this to get a list of all files of a mimeType in a users drive. Inputs: mimeType",
        func: async () => {
          console.log("Drive Util: List Files");
          let response = await this.driveUtils.listFiles();
          // console.log("response.data.files", response.data.files);
          let filenames = response.data.files.map(file => file.name).slice(0, 10);
          // console.log("Filenames", filenames);
          return filenames;
        },
        ...(props.tools || [])
      }),
      new DynamicTool({
        name: "Drive Util: Read Contents",
        description: "Call this to get a single file in a users drive. Inputs: filename.ext",
        func: async (filename = "test.txt") => {
          //console.log("Drive Util: Read Contents");
          let response = await this.driveUtils.getFileByName(filename);
          //console.log("response: ", response);
          let innerContent = response.data;
          return innerContent;
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
  }

  // Fetch data from drive and initialize the chatbot using user-given props
  async init() {
    console.log("Initializing Chatbot...");
    try {
      let file = await this.driveUtils.createAndOrGetFile(this.drive_chat_history_filename, "application/json", `[]`);
      this.chat_history_id = file.metaData.data.id;
      // console.log("Retrieving From Drive: ", this.drive_chat_history_filename, { file: file.metaData });
      this.pastMessages = this.mapMessages(file.content);
      // console.log({ past_msgs: this.pastMessages });
    } catch (error) {
      console.error("ERROR: Failed to get message history:", error);
      return false;
    }
    try {
      let file = await this.driveUtils.createAndOrGetFile(this.drive_embeddings_filename, "application/json", `[]`);
      this.chat_embeddings_id = file.metaData.data.id;
      // console.log("Retrieving From Drive: ", this.drive_embeddings_filename, { file: file.metaData });
      this.embeddings_data = file.content;
      // this.embeddings_data.map( input => {
      //     await this.vectorStoreMemory.saveContext({ input: "I don't the Celtics" }, { output: "ok" });
      // })
      // console.log({ past_msgs: this.pastMessages });
      let memoryVectors = this.vectorStoreMemory.vectorStoreRetriever.vectorStore.memoryVectors;
      // console.log("memoryVectors TESTING_2", { memoryVectors });
      memoryVectors = this.embeddings_data;
      // console.log("memoryVectors TESTING_3", { memoryVectors });
    } catch (error) {
      console.error("ERROR: Failed to get embeddings data:", error);
      return false;
    }
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
    if (this.agent == "chat-conversational-react-description" || true) {
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
    }
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
    console.log("CALLING agentExecutor ");
    // executes from chains/base.cjs
    //
    let response = await this.agentExecutor.call({ input: message });
    // console.log("chatbot_reply: ", response);

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
      // console.log({ status });
    } catch (error) {
      console.log("ERROR: Could not Save Chat History: ", error);
    }
    // Update the drive each time.
    try {
      let vectorMemory = this.agentExecutor.memory.memories[1];
      let vectors = vectorMemory.vectorStoreRetriever.vectorStore.memoryVectors;
      // console.log("\n\n\n SAVING this.agent.memory vectorMemory: ", { vectors }, "\n\n\n");
      console.log(this.chat_embeddings_id);
      let status = this.driveUtils.updateFile(this.chat_embeddings_id, "application/json", vectors);
      // console.log({ status });
    } catch (error) {
      console.log("ERROR: Could not Save Chat Embeddings: ", error);
    }
    return response.output;
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
