const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const { Ollama } = require("langchain/llms/ollama");

const app = express();
const port = 3000;

let pythonProcess;

startPythonProcess();

function startPythonProcess() {
  pythonProcess = spawn("python", ["model.py"]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python process output: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python process error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
  });
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const model = new Ollama({
  baseUrl: "http://localhost:3000/",
  model: "llama2",
});

app.post("/api/generate", async (req, res) => {
  console.log("generate-text requested");
  const user_input = req.body.prompt;
  let returnText = {
    response: "Internal Server Error",
    model: "ollama2",
    created_at: "2023-08-09T12:34:56Z",
    done: true,
  };
  if (!user_input) {
    res.status(400).send("Please provide a 'prompt' query parameter.");
    return;
  }

  if (user_input.toLowerCase() === "exit") {
    res.send("Exiting...");
    return;
  }

  pythonProcess.stdin.write(`${user_input}\n`, (error) => {
    if (error) {
      console.error(`Error writing to python process: ${error}`);
      res.status(500).json(returnText);
    }
  });

  pythonProcess.stdout.once("data", (data) => {
    console.log("Python script executed successfully");
    returnText.response = `${data}`;
    res.status(200).json(returnText);
  });
});

app.get("/", async (req, res) => {
  res.send("Node.js Express App");
  try {
    const response = await model.predict("What is the meaning of life?");
    console.log("Model response:", response);
  } catch (error) {
    console.error("Error from model:", error);
  }
});

app.get("/generate", (req, res) => {
  console.log("generate-text requested");
  const user_input = req.query.prompt;
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
