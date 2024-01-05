print('starting1')
from flask import Flask, jsonify, request
from request_controller import RequestController
print('starting2')
from train import LLMTrain
print('starting3')
from flask_cors import CORS
print('starting4')
import sys
import os

print('starting5')
app = Flask(__name__)
CORS(app)

defin = """
    This is a Flask web application with two endpoints:

    - / (root): A simple endpoint that returns a success response.
    - /train (POST method): This endpoint is designed to handle training requests. It checks if the necessary information is provided, 
                            trains a language model using the LLMTrain class (defined in train.py).
"""
@app.route("/")
def index():
    
    print('starting7')
    return 'Hello, World!'
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
        required_fields = ["baseModel", "trainingData",
                           "hfToken", "deployToHf",
                           "hfModelPath"]
        is_valid = RequestController.validate_request(request.json, required_fields)
    
        if not is_valid:
            # Return error response
            return jsonify({"error": "Missing required params"}), 400
        
        # Get the required attributes from the request body
        model_name = request.json["baseModel"]
        training_data = request.json["trainingData"]
        hf_token = request.json["hfToken"]
        deploy_to_hugging_face = request.json["deployToHf"]
        model_path = request.json["hfModelPath"]

        print(model_name, deploy_to_hugging_face, model_path)

        llm_train = LLMTrain(model_name, training_data, hf_token)
        train = llm_train.run_train(model_name, training_data, deploy_to_hugging_face, hf_token, model_path)

        if not train:
            raise ValueError("ResponseUndefined")

        # Return response
        return jsonify({"success": True,
                        "model_path": model_path}), 200

    except Exception as e:
        exc_type, exc_value, tb = sys.exc_info()
        filename = tb.tb_frame.f_code.co_filename
        func_name = tb.tb_frame.f_code.co_name
        error_msg = f"{exc_type.__name__}: {exc_value}"
        app.logger.error(
            f"Error: {error_msg}, File: {filename}, Function: {func_name}, Line: {tb.tb_lineno}, Error(e): {e}")
        return jsonify({"error": "Internal server error", "message": error_msg}), 500
    


##
#
#  Downloading the model
#  Endpoint generated using Train.generate_download_url
#
##

def zip_folder(folder_path, output_filename):
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                relative_path = os.path.relpath(os.path.join(root, file), folder_path)
                zipf.write(os.path.join(root, file), arcname=relative_path)


@app.route('/download/<path:folder_path>')
def download_folder(folder_path):
    token = request.args.get('token')
    if token != 'expected_token':       return jsonify({'error': 'Invalid token'}),     401
    if not os.path.exists(folder_path): return jsonify({'error': 'Folder not found'}),  404
    output_filename = 'output.zip'
    zip_folder(folder_path, output_filename)
    response = send_file(output_filename, as_attachment=True)
    os.remove(output_filename)

    return response


print('starting5')
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))

print('starting6')