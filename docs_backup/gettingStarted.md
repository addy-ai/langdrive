# Getting Started

Thank you for taking interest in LangDrive!

Langdrive's set of connectors and services makes training LLMs easy, and you can get started with just a CSV file! By providing a Hugging Face API key you can even train models and host them directly in the cloud 😉  

Import Langdrive in your project or configure and execute Langdrive directly from the CLI. The remainder of this article will explore using both approaches for training and deploy models with langdrive. Along the way we will explore the use of a YAML doc to help with the connecting to data and services.


## Using the CLI

Node developers can train and deploy a model in 2 simple steps. 

1. `npm install langdrive`
2. `langdrive train --csv ./path/to/csvFileName.csv --hftoken apikey123 --deploy`

In this case, Langdrive will retrieve the data, train a model, host it's weights on Hugging Face, and return an inference endpoint you may use to query the LLM.  
	
The command `langdrive train` is used to train the LLM, please see how to configure the command below.

**CLI Arguements**:

- `yaml`: Path to optional YAML config doc, default Value: './langdrive.yaml'. This will load up any class and query for records and their values for both inputs and ouputs.
- `csv`: Path to training data. The training data should be a two-column CSV of input and output pairs.
- `hfToken`: An API key provided by Hugging Face with `write` permissions. Get one [here](https://huggingface.co/docs/hub/security-tokens).
- `baseModel`: The original model to train. This can be one of the models in our supported models shown at the bottom of this page
- `deploy`: Weather training weights should be hosted in a hosting service. Default False. 
- `deployToHf`: Whether traiing weights should be stored in huggingface specifically. Either true | false
- `hfModelPath`: The full path to your hugging face model repo where the model should be deployed. Format: hugging face username/model

It is assumed you do not want to deploy your model if you run `langdrive train`. In such a case a link to where you can download the weights will be provided. Adding `--deployToHf` will return a link to the inferencing endpoint.

More information on how to ingest simple data using the CLI can be found in the [CLI](./cli.md) docs. For more complex examples, read on...


## Getting Started with YAML

Getting the data and services you need shouldn't be the hardest part about training your models! Using YAML, you can configure more advanced data retrieval, processing, and training/ deployment strategies. Once configured, these settings are available for the standalone API and also from the CLI.

Refer to the [Yaml](./yaml.md) docs for more information.

### Step 1: Configure Your Data Connectors

Our growing list of data-connectors allow anyone to retrieve data through a simple config doc. As LangDrive grows, our set of Open-Source integrations will grow. At the moment, you can connect to your data using our `email`, `firestore`, and `gdrive` classes.  

In essense, config of these data-connectors is as straight forward as:

    firestore: 
      clientJson: "secrets/firebase_service_client.json"
      databaseURL: "env:FIREBASE_DATABASE_URL"

    drive:
      appType: "desktop"
      clientJson: "secrets/drive_service_client.json" 
      scopes: 
        - "https://www.googleapis.com/auth/drive"
        - "https://www.googleapis.com/auth/drive.metadata.readonly"

    email:
      password: env:GMAIL_PASSWORD
      email: env:GMAIL_EMAIL

You may specify .env variables using `env:` as a prefix for your secret information.

In our example above, the `clientJson` attribute is a [Firebase service account file](https://firebase.google.com/support/guides/service-accounts).

Once this information is provided, the entire __OAuth Process__ will automatically be handled on your behalf when using any associated library, regardless if it's used in the CLI or API. Please refer to our notes on [security](./security/authentication.md) for more information on the Outh2 process when using google. 

### Step 2: Configure Your LLM Tools

Once you have your data-connectors set up, config your training and deployment information. The last step will be to connect the two.

Training on Hugging Face and hosting the weights on Hugging Face hubs:
```
    huggingface:
        hfToken: env:HUGGINGFACE_API_KEY 
        deployToHf: false 
```

<b>NOTE</b>: To specify the model you want to train and where to host it:
```
  huggingface: 
    hfToken: env:HUGGINGFACE_API_KEY
    baseModel: vilsonrodrigues/falcon-7b-instruct-sharded
    trainedModel: karpathic/falcon-7b-instruct-tuned
    deployToHf: true 
```

Simple enough, huh? Here comes the final step.

### Step 3: Connecting Your Data to Your LLM

To connect data to your LLM tool, we will need to create a new YAML entry `train:`. 

Here we specify specific the specific data we want to train on. In the case of a CSV, a most simple example, we can use the `path` value to specify it's location. 

langdrive.yaml
```
    train:
      path: ../shared.csv               - Default Path for Input and Output 
      inputValue: input                 - Attribute to extract from path
      outpuValue: output 
```

Now lets show how to query data from one of those third-party services we configured earlier.

Setting a `service` and `query` within the `train` entry will do this. To begin, set the name of a data-connector as the `service` and one of its methods (and its args) as the `query` value. Users are encouraged to explore the service documentation to find available methods and the parameters they take. Once the service, method, and parameters are known - you may set them like so:

langdrive.yaml
```
    train:
        service: 'firestore' 
        query:
          filterCollectionWithMultipleWhereClauseWithLimit:
              collection: "chat-state"                
              filterKey: []
              filterData: []
              operation: []
              limit: 5
```

In the example above we use the `filterCollectionWithMultipleWhereClauseWithLimit` method from Langdrive's Firestore class, passing arguements as specified in the Langdrive [Firestore](./api/firestore.md) docs. `collection` is the firestore collection name to retrieve data from, (limited to the first 5 entries). `filterKey` and `filterData` are not specified in this example but contain the field name/key to filter. The `operation` value specifies the firebstore query operator to use (For example, '==', '>=', '<=' ).


**Note**:

> If the retrieved data has two columns (or attributes) they are assumed to be in the order [input, output]. If more columns exist, langdrive grabs the first two columns after first looking for an 'inputValue' and 'outpuValue' column. The same logic applies for information retrieved from a query and works similarly for nested Json Objects (ala: `att1.attr2`)

## Gettings Started with API:

Our classes can be exposed in the typical manner. For more information on any one class, please refer to it's corresponding documentation.

Coming Soon: Deploy self-hosted cloud based training infrastructure on AWS, Google Cloud Platform, Heroku, or Hugging Face. Code is currently being used internally and is under development prior to general release - code avaialbe in-repo under `/src/train`.

If you would like to interact directly directly with our training endpoint you can call our hosted training image directly via the langdrive API. 

Endpoint: `POST https://api.langdrive.ai/train`

You can test the quality of one of these models by visit the Langdrive [Playground](https://addy-ai.com/products/langdrive#playground)

### Request Body

The request accepts the following data in JSON format.
```
{
   "baseModel": "string",
   "hfToken": "string",
   "deployToHf": "Boolean",
  "trainingData": "Array",
   "hfModelPath": "string",
}
```

`baseModel`: The original model to train. This can be one of our supported models, listed below, or a Hugging Face model

- Type: String
- Required: Yes

`hfToken`: Your Hugging Face token with write permissions. Learn how to create a Hugging Face token [here](https://huggingface.co/docs/hub/security-tokens).

- Type: String
- Required: Yes


`deployToHf`: A boolean representing whether or not to deploy the model to Hugging Face after training

- Type: Boolean
- Required: Yes

`trainingData`: This is an array of objects. Each object must have two attributes: input and output. The input attribute represents the user’s input and output attribute represents the model’s output.

- Type: Array
- Required: Yes

`hfModelPath`: The hugging face model repository to deploy the model to after training is complete. This path must exist before being used

- Type: String
- Required: No


### Response Body

The request returns the following data in JSON format.

```
HTTP/1.1 200
Content-type: application/json
{
   "success": "true",
}
```

## Model Training

We plan to expand the number of available models for training. at the moment only sharded models work as using PEFT is how these models are trained.

### Models Support Matrix

#### Causal Language Modeling
| Model        | Supported | 
|--------------| ---- | 
| Falcon-7b-sharded | ✅    |
| GPT-2        | Comming Soon  |
| Bloom        | Comming Soon  | 
| OPT          | Comming Soon  | 
| LLaMA        | Comming Soon  |  
| ChatGLM      | Comming Soon  | 

#### Model Type Support 
| Model Type       | Support | 
|--------------| ---- | 
|Conditional Generation  |  ✅  | 
|Conditional Generation  |  ✅  | 
|Sequence Classification|  ✅  | 
|Token Classification  |  ✅  | 
|Text-to-Image Generation|    | 
|Image Classification  |    | 
|Image to text (Multi-modal models)   |    | 
|Semantic Segmentation   |    | 
