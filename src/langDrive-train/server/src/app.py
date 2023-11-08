from flask import Flask, jsonify, request
from request_controller import RequestController
from train import LLMTrain
from flask_cors import CORS

import os

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    try:
        response = {"response": True}
        return jsonify(response), 200
    
    except Exception as e:
        error = str(e)
        app.logger.error(str(e))
        return jsonify({"error": "Internal server error", "message": error}), 500
    

@app.route('/train', methods=['POST'])
def completion():
    try:
        # Check if the required attributes are present in the request body
        required_fields = ["model_name", "training_data",
                           "hf_token", "deploy_to_hugging_face",
                           "model_path"]
        is_valid = RequestController.validate_request(request.json, required_fields)
    
        if not is_valid:
            # Return error response
            return jsonify({"error": "Missing required params"}), 400
        
        # Get the required attributes from the request body
        model_name = request.json["model"]
        training_data = request.json["training_data"]
        hf_token = request.json["hf_token"]
        deploy_to_hugging_face = request.json["deploy_to_hugging_face"]
        model_path = request.json["model_path"]

        dataset_path = "" #TODO: Make CSV from json received in training data
        # Save that CSV locally

        llm_train = LLMTrain(model_name, dataset_path)
        # Call make completion which calls LiteLLM which calls Vertex AI
        endpont = ""
        if not endpont:
            raise ValueError("ResponseUndefined")

        # Return response
        return jsonify({"response": response,
                        "success": True}), 200
    except Exception as e:
        app.logger.error(str(e))
        return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
