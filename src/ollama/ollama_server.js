// A lil more complex example, uses chatbot.js to load the model which actually creates a chain with memory and stuff.

const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
// const { Ollama } = require("langchain/llms/ollama");
// const Chatbot = require("./chatbot.js");
// let test_bot = new Chatbot({});
/*
const model = new Ollama({
  baseUrl: "http://localhost:8912/",
  model: "llama2"
});
*/

// Current path is C:\\Users\\Carlos\\Documents\\GitHub\\drive\ good to src/server/ollama_server.js

const app = express();
const port = 8912;

const args = process.argv.slice(2); // slicing to remove 'node' and script path
let modelValue = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--model" && i + 1 < args.length) {
    modelValue = args[i + 1];
    break;
  }
}

let pythonProcess;
startPythonProcess();
function startPythonProcess() {
  if (modelValue) {
    pythonProcess = spawn("python", [__dirname + "/ollama_model.py", "--model", modelValue]);
  } else {
    pythonProcess = spawn("python", [__dirname + "/ollama_model.py"]);
  }

  pythonProcess.stdout.on("data", data => {
    console.log(`Python process output: ${data}`);
  });

  pythonProcess.stderr.on("data", data => {
    console.error(`Python process error: ${data}`);
  });

  pythonProcess.on("close", code => {
    console.log(`Python process exited with code ${code}`);
  });
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/api/generate", async (req, res) => {
  console.log("generate-text requested");
  const user_input = req.body.prompt;
  let returnText = {
    response: "Internal Server Error",
    model: "ollama2",
    created_at: "2023-08-09T12:34:56Z",
    done: true
  };
  if (!user_input) {
    res.status(400).send("Please provide a 'prompt' query parameter.");
    return;
  }

  if (user_input.toLowerCase() === "exit") {
    res.send("Exiting...");
    return;
  }

  pythonProcess.stdin.write(`${user_input}\n`, error => {
    if (error) {
      console.error(`Error writing to python process: ${error}`);
      res.status(500).json(returnText);
    }
  });

  pythonProcess.stdout.once("data", data => {
    console.log("Python script executed successfully");
    returnText.response = `${data}`;
    res.status(200).json(returnText);
  });
});

app.get("/", async (req, res) => {
  res.send("Ollama Model Server Using Node.js Express Started");
  /*
  try {
    const response = await test_bot.sendMessage(
      "System Prompt: You are a conversational chatbot that integrates with google chatbot. A user has either just started or re-entered a conversation with you. Say hello using whatever context available:"
    );
    console.log("Model response:", response);
  } catch (error) {
    console.error("Error from model:", error);
  }
  */
});

app.get("/generate", (req, res) => {
  console.log("Ollama Model Server generate-text requested");
  const user_input = req.query.prompt;
});

app.listen(port, () => {
  console.log(`Ollama Model Server is running on port ${port}`);
});
