# Getting Started

Langdrive's set of connectors and services makes training LLMs easy for downstream applications. You can get started with just a CSV file! By providing a huggingface API key  you can train models and even host them in the cloud!  

Node developers can train and deploy a model in 2 simple steps. 

1. `npm install langDrive` to access our classes then 
2. `langdrive deploy --csv ./path/to/csv.csv --hftoken apikey123` to deploy it.

## Data Connectors

Getting the data you need shouldn't be the hardest part about training your models! With Langdrive data-connectors data ingest is a breeze. Read more how to ingest simple data using the CLI from the [CLI](./cli) docs. You can configure more advanced data retrievals using the YAML doc. Here we specify specific columns from a CSV we want to train on. 

langdrive.yaml
```
    train:
      path: ../shared.csv               - Default Path for Input and Output 
      inputValue: input                 - Attribute to extract from path
      outpuValue: output 
```

More complete YAML examples can be found in the [yaml](./yaml) docs. The ability to retrieve data is not limited to just simple csv's though, and the YAML config can tap into any class LangDrive supporst. `langdrive deploy` will load up any class and query for records and their values for both inputs and ouputs. Simply locate a method from a select class (aka, `service`) and its arguements and supply it as an object for your `query` value

langdrive.yaml
```
    train:
        service: 'firebase' 
        query:
        filterCollectionWithMultipleWhereClauseWithLimit:
            collection: "chat-state"
            filterKey: []
            filterData: []
            operation: []
            limit: 5
```

## Model Training

We plan to expand the number of available models for training. at the mopemnt only sharded models work as using PEFT is how these models are trained.

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

## Deploying your Model

It is assumed you want to deploy your model if you run `langdrive deploy` but you may want to toggle that off. In any other circumstance if the attribute is NA then it is evaluates to false at which points a link to where you can download the weights will be provided.

Example Training on hugginface and hosting the weights on hugginface hubs:
```
    huggingface:
        token: env:HUGGINGFACE_API_KEY 
        deployTrainedModel: false 
```

To specify the model you want to train and where to host it:

```
  huggingface:
    token: env:HUGGINGFACE_API_KEY
    baseModel: 
      name: "vilsonrodrigues/falcon-7b-instruct-sharded"
    trainedModel: 
      name: "karpathic/falcon-7b-instruct-tuned"
    deployTrainedModel: true 
```