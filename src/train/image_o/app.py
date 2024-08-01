# app.py
from flask import Flask, jsonify
import os
import subprocess

app = Flask(__name__) 

# https://karpathic-test.hf.space/

for key, value in [
    ("PROJECT_NAME", 'my_autotrain_llm'),
    ("MODEL_NAME", 'abhishek/llama-2-7b-hf-small-shards'),
    ("PUSH_TO_HUB", False), 
    ("LEARNING_RATE", 2e-4),
    ("NUM_EPOCHS", 1),
    ("BATCH_SIZE", 1),
    ("BLOCK_SIZE", 1024),
    ("WARMUP_RATIO", 0.1),
    ("WEIGHT_DECAY", 0.01),
    ("GRADIENT_ACCUMULATION", 4),
    ("MIXED_PRECISION", 'fp16'),
    ("PEFT", True),
    ("QUANTIZATION", 'int4'),
    ("LORA_R", 16),
    ("LORA_ALPHA", 32),
    ("LORA_DROPOUT", 0.05)
    ]:
        if not os.environ.get(key):
            os.environ[key] = str(value)

@app.route('/')
def hello_world():
    print('start')
    return 'Hello, World!'

@app.route('/test')
def test():
    return 'Hello, test!'

@app.route('/train')
def train():
    try:
        print('start1')
        command = [
            "autotrain", "llm", "--train",
            "--model", os.environ.get("MODEL_NAME"),
            "--project-name", os.environ.get("PROJECT_NAME"),
            "--data-path", "./",
            "--text-column", "text",
            "--lr", os.environ.get("LEARNING_RATE"),
            "--batch-size", os.environ.get("BATCH_SIZE"),
            "--epochs", os.environ.get("NUM_EPOCHS"),
            "--block-size", os.environ.get("BLOCK_SIZE"),
            "--warmup-ratio", os.environ.get("WARMUP_RATIO"),
            "--lora-r", os.environ.get("LORA_R"),
            "--lora-alpha", os.environ.get("LORA_ALPHA"),
            "--lora-dropout", os.environ.get("LORA_DROPOUT"),
            "--weight-decay", os.environ.get("WEIGHT_DECAY"),
            "--gradient-accumulation", os.environ.get("GRADIENT_ACCUMULATION"),
            "--quantization", os.environ.get("QUANTIZATION"),
            "--mixed-precision", os.environ.get("MIXED_PRECISION"),
        ]

        # Conditional flags
        if os.environ.get("PEFT") == "True": command.append("--PEFT")
        if os.environ.get("PUSH_TO_HUB") == "True": command.append("--push-to-hub --token ${HF_TOKEN} --repo-id ${REPO_ID}") 

        # Execute the command
        print("Command: ")
        print(command)
        result = subprocess.run(command, capture_output=True, text=True)
        return jsonify({"output": result.stdout, "error": result.stderr})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860)

 

# docker build -t my-flask-app .
# docker images
# docker run -p 4000:80 my-flask-app
# docker ps
# docker stop [id]
    