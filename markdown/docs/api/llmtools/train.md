# Training

**Description**: The `Train` class is designed for training language models using various data sources, including CSV files, service responses, and structured data. It handles the preparation of training data and interacts with a training API to finetune models on the Hugging Face platform.

### Method: `init`

**Returns**: An instance of the `Train` class after it has been initialized with the provided configuration.

**Description**:
  - This static method initializes the `Train` class with the given configuration object.
  - It returns a new instance of the class once it has prepared the necessary training data.
  - It prints the 'DriveTrain init()' message if the verbose option is set to true.

**Example**: To initialize a `Train` instance using a configuration object.

```javascript
const config = { verbose: true, /*...otherProps*/ };
const trainInstance = await Train.init(config);
```

**Parameters**:

| Parameter Name | Description                                            | Accepted Values/Data Types        |
| -------------- | ------------------------------------------------------ | --------------------------------- |
| config         | An object containing configuration properties for the class instance. | Object                            |


### Method: `trainModel`

**Returns**: A promise that resolves with the model training response.

**Description**:
  - Trains a model with the prepared data and Hugging Face API information.
  - Communicates with a training server API to initiate the finetuning process.
  - Handles verbose logs if enabled.

**Example**: To train a model with the prepared data and provided Hugging Face information.

```javascript
const huggingfaceInfo = {
  baseModel: 'model-name',
  hfToken: 'your-huggingface-token',
  deployToHf: true,
  trainedModel: 'username/finetuned-model-name'
};
const trainingResponse = await trainInstance.trainModel(huggingfaceInfo);
```

**Parameters**:

| Parameter Name   | Description                                                          | Accepted Values/Data Types        |
| ---------------- | -------------------------------------------------------------------- | --------------------------------- |
| huggingfaceInfo  | An object containing information required for the Hugging Face API. | Object                            |


### Method: `prepareData`

**Returns**: A promise that resolves with an array of training data objects.

**Description**:
  - Prepares training data by retrieving input and output data from various sources.
  - Maps input data to corresponding output data to form training pairs.
  - Logs the preparation process if verbose mode is enabled.

**Example**: To prepare the training data internally within the instance.

```javascript
const trainingData = await trainInstance.prepareData();
```

**Parameters**: This method does not require external parameters as it utilizes the instance properties.





### Method: `getData`

**Returns**: A promise that resolves with the data retrieved from the specified label (input or output).

**Description**:
  - Retrieves data based on the label, which indicates whether it's input or output data.
  - Manages retrieval from a URL, service, or directly from provided data.
  - Can log the process if verbose option is set to true.

**Example**: To get data from the specified label within the class instance.

```javascript
const inputData = await trainInstance.getData('input');
```

**Parameters**:

| Parameter Name | Description                                        | Accepted Values/Data Types |
| -------------- | -------------------------------------------------- | -------------------------- |
| lbl            | A label indicating what data to retrieve ('input' or 'output'). | String                     |

```
