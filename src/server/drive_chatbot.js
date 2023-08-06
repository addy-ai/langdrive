const { OpenAI } = require("langchain/llms/openai");
const { BufferMemory } = require("langchain/memory");
const { ConversationChain } = require("langchain/chains");
const LocalPipeline = require("./hf_pipeline");

// chatbot_chat_embeddings.json - VectorStoreRetrieverMemory - https://python.langchain.com/docs/modules/memory/types/vectorstore_retriever_memory
// chatbot_chat_history.json - ConversationBufferWindowMemory -
// CombinedMemory - https://python.langchain.com/docs/modules/memory/multiple_memory

class Chatbot {
  constructor(props) {
    this.modelz = new OpenAI({
      openAIApiKey: props.OPENAI_API_KEY,
      temperature: 0.9,
    });
    this.model = LocalPipeline.from_model_id(
      "t5-small",
      "text2text-generation",
      {
        maxNewTokens: 10,
      }
    );
    this.sessionId = null;
    this.memory = new BufferMemory();
    this.chain = new ConversationChain({
      llm: this.model,
      memory: this.memory,
    });
    this.chain2 = new ConversationChain({
      llm: this.model,
      memory: this.memory,
    });
    this.agent = null;
  }

  async sendMessage(message) {
    try {
      console.log("sendMessage");
      console.log(await this.model);
      const test = await this.model.predict(message);
      console.log(test);
      //const response = (await this.chain.call({ input: message })).response;
      //console.log({ response });
      return response;
    } catch (error) {
      console.error("Error sending message:", error.message);
      return [];
    }
  }

  async endSession() {
    try {
      if (!this.sessionId) {
        throw new Error("Session not started.");
      }
      await this.model.closeSession(this.sessionId);
      this.sessionId = null;
      return true;
    } catch (error) {
      console.error("Error ending the session:", error.message);
      return false;
    }
  }
}
module.exports = Chatbot;
