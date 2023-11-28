# HuggingFace Documentation

**Description**: The `HuggingFace` class serves as a wrapper for interacting with the Hugging Face APIs for operations such as model inference, repository creation, file management, and validity checks for API tokens and Hugging Face hubs.

---

### Method: `tokenIsValid()`

**Returns**: A boolean indicating whether the provided API token is valid.

**Description**:
  - This method checks the validity of the Hugging Face API token by attempting to list the available models.
  - If the token is valid, the method returns `true`, otherwise it returns `false`.
  - Catches and logs any errors during the validation process.

**Example**: Verify the Hugging Face API token is valid before proceeding with further API interactions.

```javascript
const hf = new HuggingFace('your-token');
const isValid = await hf.tokenIsValid();
if (isValid) {
  console.log('Token is valid.');
} else {
  console.log('Invalid token, please check your credentials.');
}
```

**Parameters**: None.

---

### Method: `hubExists()`

**Returns**: A boolean indicating whether the target Hugging Face hub exists.

**Description**:
  - This method verifies the existence of a Hugging Face hub by listing models.
  - If the hub exists, it returns `true`, otherwise it returns `false`.
  - Similar in functionality to `tokenIsValid()` and may be subject to change to better reflect its intended purpose.

**Example**: Check if the Hugging Face hub exists.

```javascript
const hf = new HuggingFace('your-token');
const exists = await hf.hubExists();
if (exists) {
  console.log('Hub exists.');
} else {
  console.log('Hub does not exist.');
}
```

**Parameters**: None.

---

### Method: `questionAnswering(model, inputs)`

**Returns**: The method returns the result of a question answering model hosted on the Hugging Face platform.

**Description**:
  - Calls upon a pre-trained question answering model, specified by the user, to process the provided inputs.

**Example**: Use a question answering model to obtain answers based on provided input.

```javascript
const hf = new HuggingFace('your-token');
const model = "bert-base-uncased";
const inputs = {
  question: "What is Hugging Face?",
  context: "Hugging Face is a social AI company and platform for ML models."
};
const result = await hf.questionAnswering(model, inputs);
console.log(result);
```

**Parameters**: 

| Parameter Name | Description                                                     | Accepted Values/Data Types    |
| -------------- | --------------------------------------------------------------- | ----------------------------- |
| model          | The identifier for the Hugging Face question answering model.    | String                        |
| inputs         | The inputs containing the question and context for the model.    | Object { question, context }  |

---

### Method: `createRepo(repoPath, type)`

**Returns**: The response from the Hugging Face API upon the creation of a new repository.

**Description**:
  - Creates a new repository or a folder in the Hugging Face hub to store models or datasets.
  - Accepts a repository path and a type to specifically create a 'model' type repository if specified.

**Example**: Create a new model repository at the specified path.

```javascript
const hf = new HuggingFace('your-token');
const repoPath = "your-username/your-new-model";
const repoType = "model";
const response = await hf.createRepo(repoPath, repoType);
console.log(response);
```

**Parameters**: 

| Parameter Name | Description                                                  | Accepted Values/Data Types |
| -------------- | ------------------------------------------------------------ | -------------------------- |
| repoPath       | The path where the new repository will reside on the hub.    | String                     |
| type           | The type of repository to create (optionally specify 'model'). | String                     |

---

### Method: `uploadFile(repoPath, filePath, blob)`

**Returns**: The response from the Hugging Face API upon successful file upload.

**Description**: 
  - Uploads a file (e.g., a model file) to a specific repository on the Hugging Face hub.

**Example**: Upload a model file to a specified repository.

```javascript
const hf = new HuggingFace('your-token');
const repoPath = "your-username/your-model";
const filePath = "pytorch_model.bin";
const blob = new Blob([...]); // blob containing file data
const response = await hf.uploadFile(repoPath, filePath, blob);
console.log(response);
```

**Parameters**: 

| Parameter Name | Description                                | Accepted Values/Data Types |
| -------------- | ------------------------------------------ | -------------------------- |
| repoPath       | The repository path to upload the file to. | String                     |
| filePath       | The destination file path on the hub.      | String                     |
| blob           | The file content to be uploaded.           | Blob                       |

---

### Method: `deleteFiles(type, name, paths)`

**Returns**: The response from the Hugging Face API after attempting to delete the specified files.

**Description**: 
  - Deletes one or more files within a repository or space on the Hugging Face hub.

**Example**: Delete specific files in a model repository.

```javascript
const hf = new HuggingFace('your-token');
const type = "model";
const name = "your-username/your-model";
const paths = ["file1.bin", "file2.bin"];
const response = await hf.deleteFiles(type, name, paths);
console.log(response);
```

**Parameters**: 

| Parameter Name | Description                                              | Accepted Values/Data Types |
| -------------- | -------------------------------------------------------- | -------------------------- |
| type           | The type of the target to delete files from.             | String                     |
| name           | The path to the repo or space where the files are located. | String                     |
| paths          | An array of strings representing the file paths to delete. | Array of String            |

---