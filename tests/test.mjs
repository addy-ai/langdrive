import { ChatOpenAI } from "langchain/chat_models/openai";
import { z } from "zod";
import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { Calculator } from "langchain/tools/calculator";
import { DynamicStructuredTool } from "langchain/tools";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";

export const run = async () => {
  const model = new ChatOpenAI({
    temperature: 0
  });
  const tools = [
    new Calculator(),
    new DynamicStructuredTool({
      name: "random-number-generator",
      description: "generates a random number between two input numbers",
      schema: z.object({
        low: z.number().describe("The lower bound of the generated number"),
        high: z.number().describe("The upper bound of the generated number")
      }),
      func: async ({ low, high }) => (Math.random() * (high - low) + low).toString(), // Outputs still must be strings
      returnDirect: true // This is an option that allows the tool to return the output directly
    })
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    // agentType: "structured-chat-zero-shot-react-description",
    agentType: "chat-conversational-react-description",
    verbose: true,
    memory: new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
      inputKey: "input",
      outputKey: "output"
    }),
    maxIterations: 5
  });
  console.log("Loaded agent.");
  console.log(executor.agent.llmChain.prompt.promptMessages);
  const input0 = "Hi there! My name is carlos.";

  const result0 = await executor.call({ input: input0 });

  console.log(`Got output ${result0.output}`);
  /*
  const input1 = "whats my name?";

  const result1 = await executor.call({ input: input1 });

  console.log(`Got output ${result1.output}`);
  */
};
run();
/*
https://js.langchain.com/docs/modules/agents/agent_types/structured_chat  
const chainB = new LLMChain({
  prompt: chatPrompt,
  llm: chat
});
const resB = await chainB.call({
  input_language: "English",
  output_language: "French",
  text: "I love programming."
});
console.log({ resB });
// { resB: { text: "J'adore la programmation." } }
*/
