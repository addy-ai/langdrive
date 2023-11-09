import argparse

parser = argparse.ArgumentParser(description='Ollama Model Script')
parser.add_argument('--model', type=str, help='Model name or path')
args = parser.parse_args()

model = "meta-llama/Llama-2-7b" 
if args.model:
    print(f"Model value is: {args.model}")
    model = args.model
else:
    print("No model value provided.")

from transformers import pipeline
pipe = pipeline("text2text-generation", model=model)

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