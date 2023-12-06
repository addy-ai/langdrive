# LLM Tools

Welcome to the LLM Overview! Here, we delve into the intricacies and unique features of several Node.js classes. Our goal is to offer you an engaging and informative guide through their functionalities and capabilities, making your development journey both efficient and enjoyable.

## HuggingFace Class Overview

### Class: `HuggingFace`
The `HuggingFace` class is your gateway to interacting with the innovative Hugging Face API. From validating tokens and managing repositories to uploading files and performing model inference, this class is equipped to handle it all with ease.

#### Constructor
- **Parameters**:
  - `accessToken` (String): Your key to access the diverse features of the Hugging Face API.
  - `defaultOptions` (Object): Customize the class behavior to suit your needs.

#### Key Methods
> - **`tokenIsValid()`:** Wondering about your token's validity? This method swiftly confirms it for you.
> - **`hubExists()`:** Check if your desired hub is up and running with a simple call.
> - **`questionAnswering(model, inputs)`:** Dive into AI-driven question answering with your chosen model.
> - **`createRepo(repoPath, type)`:** Setting up a new repository is just a few parameters away.
> - **`uploadFile(repoPath, filePath, blob)`:** Easily upload files to your repository in the Hugging Face hub.
> - **`deleteFiles(type, name, paths)`:** Need to clear some space? Delete files seamlessly with this method.


---

## HerokuHandler Class Overview

### Class: `HerokuHandler`
Embark on a smooth journey with Heroku using the `HerokuHandler` class. It simplifies interactions with the Heroku API, ensuring you can check installation and login statuses effortlessly.

#### Constructor
- **Parameters**:
  - `props` (Object): All you need to connect - Heroku API key, username, and password.

#### Key Methods
> - **`checkInstall()`:** Quickly verify if Heroku CLI is part of your toolkit.
> - **`checkLogin()`:** Log in hassles? This method ensures you're connected to Heroku.
> - **`handleHeroku(args)`:** Manage your Heroku setup and status with this comprehensive function.

---

## NPM: Langdrive: DriveChatbot Class Overview

### Chatbot
Primarily for demonstration and testing purposes. Engage with the `DriveChatbot`, where Async Promises bring your chatbot interactions to life.

---

## Train Class Overview

### Class: `Train`
The `Train` class is your companion in the realm of machine learning. It's designed to streamline the training process of your models and manage data sources efficiently.

#### Constructor
- **Parameters**: `props` (Object): Fine-tune your training experience with verbose and train options.

#### Key Methods
- **`init(config)`:** Initializes the class and prepares data.
- **`trainModel(huggingfaceInfo)`:** Manages the model training process.
- **`prepareData()`:** Prepares training data.
- **`getDataFromUrl(url)`:** Fetches data from a URL.
- **`getDataFromService(classInstance, query)`:** Retrieves data using a service class.
- **`getValuesFromData(data, value)`:** Extracts specific values from data.
- **`getData(lbl)`:** General method for data retrieval.

---

## Utils Script Overview

### Script: `utils`
This Node.js script is essential for deploying machine learning models. It utilizes key libraries like `fs`, `path`, `js-yaml`, and `dotenv` for various file operations, path resolution, YAML processing, and environment variable management.

#### Main Functions
- **`cli_deploy(args)`**: Entry point for deploying the model. Manages deployment initiation and configuration retrieval.
- **`deploy(config)`**: Handles the core deployment process of the machine learning model.
- **`getConfig(args)`**: Retrieves deployment configurations from a YAML file.

#### Modules
- **`fs`**: Handles file system operations.
- **`path`**: Manages file paths.
- **`js-yaml`**: Processes YAML files.
- **`dotenv`**: Loads environment variables.