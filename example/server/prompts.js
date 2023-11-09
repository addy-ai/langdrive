// conversational chat agents can to set the DEFAULT_PREFIX and DEFAULT_SUFFIX but not the PREFIX_END, TEMPLATE_TOOL_RESPONSE or FORMAT_INSTRUCTIONS.

// System Message == (args.systemMessage||Default_Prefix) + Prefix_End:
const DEFAULT_PREFIX = `Assistant is a conversational chatbot that can access a users Google Drive to help them. The Assistant's name is LangDrive.

Assistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. 

This includes retrieving files or storing them into google drive and ascertaining information from within the documents themselves.

As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

Assistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.

Overall, Assistant is a powerful system that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist.`;

// always included after Defaulit_Prefix
const PREFIX_END = ` However, above all else, all responses must adhere to the format of RESPONSE FORMAT INSTRUCTIONS.`;

// USes Either right after system message (args.humanMessage||DEFAULT_SUFFIX)
const DEFAULT_SUFFIX = `TOOLS

---

Assistant can ask the user to use tools to look up information that may be helpful in answering the users original question. The tools the human can use are:

{tools}

{format_instructions}

## USER'S INPUT

Here is the user's input (remember to respond with a markdown code snippet of a json blob with a single action, and NOTHING else):

{{input}}
`;

// Used for constructing the agent's scratchpad
const TEMPLATE_TOOL_RESPONSE = `TOOL RESPONSE:

---

{observation}

## USER'S INPUT

Okay, so what is the response to my last comment? If using information obtained from the tools you must mention it explicitly without mentioning the tool names - I have forgotten all TOOL RESPONSES! Remember to respond with a markdown code snippet of a json blob with a single action, and NOTHING else.`;

// This is used by the agent to parse the output of the model.
const FORMAT_INSTRUCTIONS = `RESPONSE FORMAT INSTRUCTIONS

---

Output a JSON markdown code snippet containing a valid JSON object in one of two formats:

**Option 1:**
Use this if you want the human to use a tool.
Markdown code snippet formatted in the following schema:

\`\`\`json
{{{{
    "action": string, // The action to take. Must be one of [{tool_names}]
    "action_input": string // The input to the action. May be a stringified object.
}}}}
\`\`\`

**Option #2:**
Use this if you want to respond directly and conversationally to the human. Markdown code snippet formatted in the following schema:

\`\`\`json
{{{{
    "action": "Final Answer",
    "action_input": string // You should put what you want to return to use here and make sure to use valid json newline characters.
}}}}
\`\`\`

For both options, remember to always include the surrounding markdown code snippet delimiters (begin with "\`\`\`json" and end with "\`\`\`")!
`;

module.exports = {
  TEMPLATE_TOOL_RESPONSE,
  DEFAULT_PREFIX,
  PREFIX_END,
  DEFAULT_SUFFIX,
  FORMAT_INSTRUCTIONS
};

/*
// Initialize Agent: https://github.com/hwchase17/langchainjs/blob/main/langchain/src/agents/initialize.ts#L98
// Baseline chat agent Code: https://github.com/hwchase17/langchainjs/blob/main/langchain/src/agents/agent.ts#L203
// Conversational chat Agent Code & Prompt Template: https://github.com/hwchase17/langchainjs/blob/65e59d669889ef07a564c5ec8fd23e21ed1aa68a/langchain/src/agents/chat_convo/index.ts#L23
// Chat Agent Output Parser: https://github.com/hwchase17/langchainjs/blob/main/langchain/src/agents/chat_convo/outputParser.ts


  // https://js.langchain.com/docs/modules/agents/agent_types/structured_chat

  // https://js.langchain.com/docs/modules/agents/agent_types/chat_conversation_agent
  // Passing "chat-conversational-react-description" as the agent type
  // automatically creates and uses BufferMemory with the executor.
  // If you would like to override this, you can pass in a custom
  // memory option, but the memoryKey set on it must be "chat_history".


WHEN CREATING OUR AGENT:

- We use: initializeAgentExecutorWithOptions( 
  tools, 
  llm,
  options?: InitializeAgentExecutorOptions
): Promise<AgentExecutor> : https://github.com/hwchase17/langchainjs/blob/475f31afd1ae07152d04a9a9a5f6107338e42457/langchain/src/agents/initialize.ts#L103

- - It returns an Agent Executor
 Agent Executor: https://github.com/hwchase17/langchainjs/blob/main/langchain/src/agents/executor.ts#L25

- - It can recieve prompt overrides for the specific implementation. 
- - - InitializeAgentExecutorOptions = ({ 
  agentType: "chat-conversational-react-description"; 
  agentArgs?: Parameters<typeof ChatConversationalAgent.fromLLMAndTools>[2]; 
} & Omit<AgentExecutorInput, "agent" | "tools">);

- - - - where AgentExecutorInput = { agent, tools, returnIntermediateSteps? maxIterations?, earlyStoppingMethod? }
- - - - - which extends BaseLangChainParams = {memory?, callbackManager}

- - There are default overrides, and can pass (some) of your own into the 'agentArgs' parameter. 

- Ultimately, the crafted prompt will be passed to an LLM chain: https://js.langchain.com/docs/api/chains/classes/LLMChain

- This LLMChain will be used within a ChatConversationalAgent and is what gets returend by InitializeAgentExecutorOptions
<==>

- The InitializeAgentExecutorOptions function essentiall performs this logic using the ChatConversationalAgent.fromLLMAndTools which build off and returns an AgentExecutor:
- - https://github.com/hwchase17/langchainjs/blob/65e59d669889ef07a564c5ec8fd23e21ed1aa68a/langchain/src/agents/chat_convo/index.ts#L25

case "chat-conversational-react-description": {
  const { agentArgs, memory, tags, ...rest } = options;
  const executor = AgentExecutor.fromAgentAndTools({
    tags: [...(tags ?? []), "chat-conversational-react-description"],
    agent: ChatConversationalAgent.fromLLMAndTools(
      llm,
      tools as Tool[],
      agentArgs
    ),
    tools,
    memory:
      memory ??
      new BufferMemory({
        returnMessages: true,
        memoryKey: "chat_history",
        inputKey: "input",
        outputKey: "output",
      }),
    ...rest,
  });
  return executor;
}

<==>  

- the ChatConversationalAgent.fromLLMAndTools function returns a ChatConversationalAgent which is what is returned by InitializeAgentExecutorOptions

- It uses the prompts from above or being passed from the agentArgs property ...

chain_prompt === ChatConversationalAgent.createPrompt(tools, { ...args, outputParser, })
<==>  
chain_prompt === ChatPromptTemplate.fromPromptMessages([
SystemMessagePromptTemplate.fromTemplate(systemMessage),
new MessagesPlaceholder("chat_history"),
HumanMessagePromptTemplate.fromTemplate(renderedHumanMessage),
new MessagesPlaceholder("agent_scratchpad"),
])

<==>  

- This prompt is then used to create an LLMChain which is used by the ChatConversationalAgent class to return an instance of itself.
- - It is this which we interact with when using the agent. The Agent class has utility functions for processing it's output and formatting it's input.

const chain = new LLMChain({
chain_prompt,
llm,
callbacks: args?.callbacks ?? args?.callbackManager,
});
<==>  
return new ChatConversationalAgent({
llmChain: chain,
outputParser,
allowedTools: tools.map((t) => t.name),
});
*/

/*

// { userid: {chainid: memory}}

// https://js.langchain.com/docs/modules/model_io/models/llms/integrations/openai
// https://platform.openai.com/docs/models/gpt-3-5
// https://github.com/hwchase17/langchainjs/blob/6a54462a20973ddb5c134038e6c59bad34f04ea6/langchain/src/llms/openai.ts

// https://pbs.twimg.com/media/F3GZ07pbUAAut3Y?format=png&name=900x900
// chatbot_chat_embeddings.json - VectorStoreRetrieverMemory - https://python.langchain.com/docs/modules/memory/types/vectorstore_retriever_memory
// chatbot_chat_history.json - ConversationBufferWindowMemory -
// CombinedMemory - https://python.langchain.com/docs/modules/memory/multiple_memory

// https://github.com/ShumzZzZz/GPT-Rambling/blob/main/LangChain%20Specific/langchain_persist_conversation_memory.ipynb
// load messages into a BufferMemory instance by creating and passing in a ChatHistory object.

// https://news.ycombinator.com/item?id=37067933

*/
