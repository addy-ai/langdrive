# You would need to use hugging face hub library by runnin 'pip install huggingface_hub'

from huggingface_hub import HfApi, HfFolder, Repository

class HuggingFaceModelUploader:
    def __init__(self, model_name, model_directory):
        self.model_name = model_name
        self.model_directory = model_directory
        self.api = HfApi()
        self.endpoint_url = None

    def login(self, token=None):
        if token:
            HfFolder.save_token(token)
        else:
            print("Please visit https://huggingface.co/settings/tokens to retrieve your Hugging Face API token.")
            token = input("Enter your Hugging Face API token: ")
            HfFolder.save_token(token)

    def upload_model(self):
        # Ensure the user is logged in
        user = self.api.whoami(token=HfFolder.get_token())
        username = user['name']

        # Create a repository on the Hugging Face Model Hub
        repo_url = self.api.create_repo(token=HfFolder.get_token(), name=self.model_name)

        # Clone the repository and copy the model files
        repo = Repository(local_dir=self.model_directory, clone_from=repo_url)
        repo.git_add()
        repo.git_commit("Initial commit with model")
        repo.git_push()

        # Construct the endpoint URL
        self.endpoint_url = f"https://huggingface.co/{username}/{self.model_name}"

        return self.endpoint_url

"""
# Usage
model_uploader = HuggingFaceModelUploader(model_name='your_model_name', model_directory='path_to_your_model_directory')
model_uploader.login(token='your_huggingface_token')  # Optional: If you don't pass a token, you will be prompted to enter one
model_endpoint = model_uploader.upload_model()
print(f"Model endpoint: {model_endpoint}")

"""

