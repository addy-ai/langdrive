# A flask web server that serves as an API to inference LLMWare models
from flask import Flask, jsonify, request
from request_controller import RequestController
from flask_cors import CORS

from integrations.llmware import LLMWare

import ssl
ssl._create_default_https_context = ssl.create_default_context()

app = Flask(__name__)
CORS(app)

PORT = 8082

llmware_extractor_config = {
    "model_name": "slim-extract-tool",
    "temperature": 0.0,
    "sample": False,
    "get_logits": False
}
extractor_model = LLMWare(**llmware_extractor_config)

@app.route("/")
def index():
    try:
        response = {"success": True}
        return jsonify(response), 200

    except Exception as e:
        error = str(e)
        app.logger.error(str(e))
        return jsonify({"error": "Internal server error", "message": error}), 500
    
@app.route("/extract", methods=["POST"])
def extract():
    try:
        request_json = request.json
        required_fields = ["text", "attribute"]
        is_valid_request = RequestController.validate_request(request.json, required_fields)
        if not is_valid_request:
            return jsonify({"error": "Invalid request", "message": "Missing required fields"}), 400

        text = request_json["text"]
        attribute = request_json["attribute"]

        response = extractor_model.extract(text, attribute)
        return jsonify({"success": True, "response": response}), 200

    except Exception as e:
        error = str(e)
        app.logger.error(str(e))
        return jsonify({"error": "Internal server error", "message": error}), 500
    

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=PORT)