from transformers import pipeline
pipe = pipeline("text-generation", model="tiiuae/falcon-40b-instruct")

while True:
    user_input = input("")
    if user_input.lower() == 'exit':
        break
    print(pipe(user_input)[0]['generated_text'])

"""
# example curl request
$uri = "http://localhost:3000/generate-text"
$headers = @{
    "Content-Type" = "application/json"
}
$body = @{
    prompt = "Translate to German: I love the weather in spain."
} | ConvertTo-Json

Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body
"""

forserver = """
/*
const { spawn } = require("child_process"); // Use spawn instead of exec for better handling
let pythonProcess; // Declare pythonProcess outside of the endpoint handler

// Start the child process on app start
startPythonProcess();

function startPythonProcess() {
  pythonProcess = spawn("python", ["model.py"]); // Modify this as needed

  pythonProcess.stdout.on("data", (data) => {
    console.log("stdout data:", data.toString());
    console.log(`Python process output: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.log("stderr data:", data.toString());
    console.error(`Python process error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
  });
}

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
*/
"""