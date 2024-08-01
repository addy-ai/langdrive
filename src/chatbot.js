const { OpenAI } = require("langchain/llms/openai");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { BufferWindowMemory, CombinedMemory, ChatMessageHistory } = require("langchain/memory");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { Ollama } = require("langchain/llms/ollama");
const { HumanMessage, AIMessage, SystemMessage } = require("langchain/schema");
const DriveUtils = require("./gdrive");
const { HuggingFaceInference } = require("langchain/llms/hf");
const { Calculator } = require("langchain/tools/calculator");
const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { DynamicTool } = require("langchain/tools");
const { VectorStoreRetrieverMemory } = require("langchain/memory");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
//const { HNSWLib } = require("langchain/vectorstores/hnswlib");  
const { FaissStore } = require("langchain/vectorstores/faiss");
const { DEFAULT_PREFIX, DEFAULT_SUFFIX } = require("../example/server/prompts");
const fs = require("fs");

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

    this.model = props.model || false;
    this.model_service = props.model.service;
    this.model_config = this.model.model_config;
    const useOpenAiModel = !!this.model_config.openAIApiKey;
    const useHfAiModel = !!this.model_config.huggingFaceApiKey;
    if (!this.model_service && useOpenAiModel) this.model_service = "chatOpenAi";
    if (!this.model_service && useHfAiModel) this.model_service = "huggingFace";
    if (!this.model_service && !openAiModel && !useOpenAiModel) {
      // Install the huggingface Flant t5 small model and spin up a local endpoint for that.
      this.model_service = "Endpoint";
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
    if (this.model_service.includes("openAi")) this.model = new OpenAI(this.model_config);
    else if (this.model_service.includes("chatOpenAi") || useOpenAiModel)
      this.model = new ChatOpenAI(this.model_config);
    else if (this.model_service.includes("huggingFace") || useHfAiModel) {
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
    this.chat_embeddings_data = [];
    this.embeddings_id = null;
    this.embeddings_data = [];

    this.bufferMemory = [];
    this.memory = [];
    this.agent = props.agent.type || "chat-conversational-react-description";
    this.agent_config = props.agent.agent_config || {};
    this.agent_verbose = props.agent.verbose || false;
    this.DEFAULT_PREFIX = props.agent.prefix || DEFAULT_PREFIX;
    this.DEFAULT_SUFFIX = props.agent.suffix || DEFAULT_SUFFIX;
    this.tools = [
      new Calculator(),
      ...(this.driveClient
        ? [
            new DynamicTool({
              name: "Drive Util: List Files",
              description: "Call this to get a list of all files of a mimeType in a users drive. Inputs: mimeType",
              func: async () => {
                this.verbose && console.log("Drive Util: List Files");
                try {
                  let response = await this.driveClient.listFiles({});
                  let filenames = response.data.files.map(file => file.name).slice(0, 10);
                  return filenames;
                } catch (error) {
                  let msg = "Error Connecting to Drive.";
                  this.verbose && console.log(error);
                  return msg;
                }
              }
            }),
            new DynamicTool({
              name: "Drive Util: Read Contents",
              description: "Call this to get a single file in a users drive. Inputs: filename.ext",
              func: async (filename = "test.txt") => {
                try {
                  this.verbose && console.log("Drive Util: Read Contents");
                  let response = await this.driveClient.getFileByName(filename);
                  let innerContent = response.data;
                  fs.writeFileSync(filename, innerContent, "utf8");
                  const loader = new TextLoader(filename);
                  const docs = await loader.load();
                  fs.unlinkSync(filename);
                  return "The File has been read.";
                } catch (error) {
                  let msg = "Error Connecting to Drive.";
                  this.verbose && console.log(error);
                  return msg;
                }
              }
            }),
            new DynamicTool({
              name: "Fetch From Knowledge Base",
              description: "Call this to fetch a file from a single file in a users drive. Inputs: filename.ext",
              func: async (filename = "test.txt") => {
                try {
                  this.verbose && console.log("Drive Util: Read Contents");
                  let response = await this.driveClient.getFileByName(filename);
                  let innerContent = response.data;
                  fs.writeFileSync(filename, innerContent, "utf8");
                  const loader = new TextLoader(filename);
                  const docs = await loader.load();
                  fs.unlinkSync(filename);
                  return "The File has been read.";
                } catch (error) {
                  let msg = "Error Connecting to Drive.";
                  this.verbose && console.log(error);
                  return msg;
                }
              }
            })
          ]
        : []),
      ...(props.agent.tools || [])
    ];

    this.driveClient = props.drive.web
    ? new DriveUtils({ ...props.drive.web, verbose: props.drive?.web?.verbose !== undefined ? props.drive.web.verbose : props.drive?.verbose !== undefined ? props.drive.verbose : this.verbose })
    : false;
    this.drive_chat_history_filename = props?.drive?.web?.chat_history_filename || "chatbot_chat_history.json";
    this.drive_chat_history_filepath = props?.drive?.web?.chat_history_filepath || "chatbot/memory";
    this.drive_chat_embeddings_filename = props?.drive?.web?.chat_embeddings_filename || "chatbot_chat_embeddings.json";
    this.drive_chat_embeddings_filepath = props?.drive?.web?.chat_embeddings_filepath || "chatbot/memory";
    this.drive_document_directory_filename = props?.drive?.web?.documents_filename || "chatbot_documents.json";
    this.drive_document_directory_filepath = props?.drive?.web?.document_directory_filepath || "chatbot/memory";
    this.vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
    this.vectorStoreRetrieverMemory = new VectorStoreRetrieverMemory({
      vectorStoreRetriever: this.vectorStore.asRetriever(this.vector_length), // Return top n docs
      memoryKey: "chat_vector",
      inputKey: "input"
    });

    this.driveServer = props.drive.server
      ? new DriveUtils({ ...props.drive.server, verbose: props.drive?.server?.verbose !== undefined ? props.drive.server.verbose : props.drive?.verbose !== undefined ? props.drive.verbose : this.verbose })
      : false;
    this.drive_embed_from_folder = props.drive?.server?.embed_from_folder || "chatbot";
    this.drive_embed_to_folder = props.drive?.server?.embed_to_folder || "chatbot";
    this.drive_embeddings_filename = props.drive?.server?.embeddings_filename || "embeddings.json";

    this.kBVectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
    this.kBVectorStoreRetrieverMemory = new VectorStoreRetrieverMemory({
      vectorStoreRetriever: this.kBVectorStore.asRetriever(this.vector_length), // Return top n docs
      memoryKey: "server_vector",
      inputKey: "input"
    }); 

    // Fetch data from drive and initialize the chatbot using user-given props
    this.init();
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
      memories: [this.bufferMemory, this.vectorStoreRetrieverMemory, this.kBVectorStoreRetrieverMemory]
    });

    //
    // Initialize the agent. ConversationChain is used as the default agent w a BufferMemory.
    // Always use this one for now.
    //
    let config = {
      agentType: this.agent,
      memory: this.memory,
      verbose: this.agent_verbose,
      ...this.agent_config,
      agentArgs: {
        systemMessage: this.DEFAULT_PREFIX,
        humanMessage: this.DEFAULT_SUFFIX
      }
    }
    this.verbose && console.log("Chatbot: Initializing Agent Executor with config: ");
    this.agentExecutor = await initializeAgentExecutorWithOptions(this.tools, this.model, config);
    let chain = this.agentExecutor.agent.llmChain;
    let prompt_messages = chain.prompt.promptMessages;

    // This will insert our chat_vector memory into the model
    prompt_messages = [
      new MessagesPlaceholder("chat_vector"),
      new MessagesPlaceholder("server_vector"),
      ...prompt_messages
    ];

    // const response = await this.knowledgeBaseVectorStore.similaritySearch(prompt, 1);

    let memory = this.agentExecutor.memory;
    // uses the originals result but then modifies it to work w the agent.
    // when agentExecutor.call is made, base chain calls _formatValues which retrieves data from memory.
    memory.loadMemoryVariables_original = memory.loadMemoryVariables;
    memory.loadMemoryVariables = async values => {
      let returnThis = await memory.loadMemoryVariables_original(values);
      returnThis.server_vector = [
        new SystemMessage(
          "## Document Excerpts: \n\n The following is a random text extract you may use to help you:  \n" +
            returnThis.server_vector
        )
      ];
      returnThis.chat_vector = [
        new SystemMessage(
          "## Past Conversations: \n\n The following is an text extract from past conversations that LangDrive can use:  \n" +
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
    this.verbose && console.log('Chatbot: Message: ', message, '\n');
    let response = await this.agentExecutor.call({ input: message });
    this.verbose && console.log('\nChatbot: Response: \n', response.output, '\n');
    this.saveMemory();
    return response.output;
  }

  async getMemory() { 
    if (this.driveClient) {
      try {
        console.log('this.drive', this.driveClient)
        let chatpath = this.drive_chat_history_filepath + "/" + this.drive_chat_history_filename;
        this.verbose && this.driveClient.verbose && console.log("Chatbot: getMemory: chat history: START");
        let response = await this.driveClient.createAndOrGetContent({
          path: chatpath,
          mimeType: "application/json",
          message: `[]`
        }); 

        // Update our Agent
        this.chat_history_id = response.data.metadata.id;
        this.pastMessages = this.mapMessages(response.data.file);
        this.agentExecutor.memory.memories[0] = new BufferWindowMemory({
          chatHistory: new ChatMessageHistory(this.pastMessages),
          k: this.memory_length,
          returnMessages: true,
          memoryKey: "chat_history",
          inputKey: "input"
        });
        this.verbose && this.driveClient.verbose && console.log("Chatbot: getMemory: chat history: SUCCESS"); // { past_msgs: this.pastMessages }); 
      } catch (error) {
        this.verbose && this.driveClient.verbose && console.error("Chatbot: getMemory: chat history: ERROR: Failed to get message history:", error);
      }
      try {
        this.verbose && this.driveClient.verbose && console.log("Chatbot: getMemory: Embed history: START");
        let embedPath = this.drive_chat_embeddings_filepath + "/" + this.drive_chat_embeddings_filename;
        // console.log("\n\n RETRIEVING MEMORY chat embeddings", embedPath);
        let response = await this.driveClient.createAndOrGetContent({
          path: embedPath,
          mimeType: "application/json",
          message: `[]`
        }); 

        // Update our Agent
        let data = response.data;
        this.chat_embeddings_id = data.metadata && data.metadata.id;
        this.chat_embeddings_data = data.file; 
        // console.log(this.chat_embeddings_data)
        let docText = [data]; 
        this.verbose && this.driveClient.verbose && console.log("Chatbot: getMemory: Embed history: SUCCESS"); 
        let ids = docText.map((doc, index) => ({ id: index + 1 })); 
        this.verbose && this.driveClient.verbose && console.log("Chatbot: getMemory: Embed history: FaissStore.fromTexts: START");
        console.log('WEB', { docText, ids })
        /*
        this.vectorStore = await FaissStore.fromTexts(
          ["Hello world", "Bye bye", "hello nice world"],
          [{ id: 2 }, { id: 1 }, { id: 3 }],
          new OpenAIEmbeddings()
        );
        this.verbose && this.driveClient.verbose && console.log("Chatbot: getMemory: Embed history: FaissStore.fromTexts: SUCCESS");
        this.verbose && this.driveClient.verbose && console.log("Chatbot: getMemory: Embed history: CREATING vectorStoreRetrieverMemory");
        this.vectorStoreRetrieverMemory = new VectorStoreRetrieverMemory({
          vectorStoreRetriever: this.kBVectorStore.asRetriever(this.vector_length), // Return top n docs
          memoryKey: "chat_vector",
          inputKey: "input"
        });
        this.verbose && this.driveClient.verbose && console.log("Chatbot: getMemory: Embed history: ASSIGNING TO AGENTEXECUTOR");
        this.agentExecutor.memory.memories[1] = this.VectorStoreRetrieverMemory;
        this.verbose && this.driveClient.verbosev && console.log("Chatbot: getMemory: Embed history: SUCCESS");
        */
        //
        //
        //
      } catch (error) {
        this.verbose && this.driveClient.verbose && console.error("Chatbot: getMemory: Client Embed history: ERROR: Failed to get chat embeddings data:", error);
      }
    } else {
      this.verbose &&
        console.log(
          "Google Drive - driveClient - Not Configured. For data persistance, please provide: CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN*"
        );
    }
    if (this.driveServer) {
      try {
        this.verbose && this.driveServer.verbose && console.error("Chatbot: getMemory: Server Embeddings: START");
        // first make sure embeddings path is ok 
        if (typeof embedPath === "string") {
          embedPath =
            embedPath.indexOf("./") === 0
              ? embedPath.substring(2)
              : embedPath.indexOf("/") === 0
              ? embedPath.substring(1)
              : embedPath;
        }
        let embeddingsFile = await this.driveServer.createAndOrGetContent({
          path: this.drive_embed_to_folder + "/" + this.drive_embeddings_filename,
          mimeType: "application/json",
          message: `[]`
        });

        let fromDirectory = await this.driveServer.createAndOrGetContent({
          path: this.drive_embed_from_folder,
          mimeType: "folder"
        });
        // For each file in folder, get file contents
        let files = fromDirectory.data.files;

        this.verbose && this.driveServer.verbose && console.error("Chatbot: getMemory: Server Embeddings: GETTING FILES FROM DIRECTORY", this.drive_embed_from_folder, files); 
        let docText = (await files)
          .filter(file => file.name.endsWith(".txt"))
          .map(async file => {
            let fileContents = await this.driveServer.getFileById({ id: file.id });
            if (fileContents.status == 400) return error;
            return fileContents.data; 
          });
        docText = await Promise.all(docText);
        const ids = docText.map((doc, index) => ({ id: index + 1 }));
        let uploadThis = { texts: docText, ids };   
        this.verbose && this.driveServer.verbose && console.error("Chatbot: getMemory: Server Embeddings: UPDATING EMBED FILE", uploadThis);
        this.driveServer.updateFile({
          fileId: embeddingsFile.data.metadata.id,
          mimeType: "application/json",
          message: uploadThis
        });

        // Update our Agent 
        this.verbose && this.driveServer.verbose && console.error("Chatbot: getMemory: Server Embeddings: FaissStore.fromTexts: START");
        console.log('SERVER ',{ docText, ids })
        this.kBVectorStore = await FaissStore.fromTexts(docText, ids,
          new OpenAIEmbeddings()
        );
        this.verbose && this.driveServer.verbose && console.error("Chatbot: getMemory: Server Embeddings: FaissStore.fromTexts: SUCCESS");
        this.verbose && this.driveServer.verbose && console.error("Chatbot: getMemory: Server Embeddings: kBVectorStoreRetrieverMemory: START");
        this.kBVectorStoreRetrieverMemory = new VectorStoreRetrieverMemory({
          vectorStoreRetriever: this.kBVectorStore.asRetriever(this.vector_length), // Return top n docs
          memoryKey: "server_vector",
          inputKey: "input"
        });
        this.verbose && this.driveServer.verbose && console.error("Chatbot: getMemory: Server Embeddings: kBVectorStoreRetrieverMemory: SUCCESS");
        this.verbose && this.driveServer.verbose && console.error("Chatbot: getMemory: Server Embeddings: memories[2]: START");
        this.agentExecutor.memory.memories[2] = this.kBVectorStoreRetrieverMemory;
        this.verbose && this.driveServer.verbose && console.error("Chatbot: getMemory: Server Embeddings: memories[2]: SUCCESS");
        //
        //
        //
      } catch (error) {
        this.verbose && console.error("Chatbot: getMemory: Server Embeddings: ERROR: Failed to get embeddings data:", error);
      }
    } else {
      this.verbose &&
        console.log(
          "Google Drive - driveServer - Not Configured. For data persistance, please provide: CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN*"
        );
    }
  }

  // called after every message to Update the google drive(s) each time.
  async saveMemory() {
    if (this.driveClient) { 
      // for the page-visitors drive.
      try { 
        this.verbose && console.log("ChatBot: saveMemory: Client Chat Buffer: START");
        let bufferMemory = this.agentExecutor.memory.memories[0];
        let status = await this.driveClient.updateFile({
          fileId: this.chat_history_id,
          mimeType: "application/json",
          message: bufferMemory.chatHistory.messages
        });
        this.verbose && console.log("ChatBot: saveMemory: Client Chat Buffer: SUCCESS")
      } catch (error) { this.verbose && console.log("ERROR: Could not Save Chat History: ", error); }
      try {  
        this.verbose && console.log("ChatBot: saveMemory: Client Embeddings: START");
        let memory = this.agentExecutor.memory.memories[1];
        let vectors = memory.vectorStoreRetriever.vectorStore.memoryVectors; 
        let status = await this.driveClient.updateFile({
          fileId: this.chat_embeddings_id,
          mimeType: "application/json",
          message: vectors
        });
        this.verbose && console.log("ChatBot: saveMemory: Client Embeddings: SUCCESS") 
      } catch (error) { this.verbose && console.log("ERROR: Could not Save Chat Embeddings: ", error); }
    }
    if (this.driveServer) {
      this.verbose && console.log("ChatBot: saveMemory: Server Embeddings: Status: START");
      // No need to upload anything to the server.. but.
      // We need to overwrite this memory vector store to prevent the chat appending. 
      this.agentExecutor.memory.memories[2] = this.kBVectorStoreRetrieverMemory;
      this.verbose && console.log("ChatBot: saveMemory: Server Embeddings: Status: Success");
    }
  }
  mapMessages(content) {
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
