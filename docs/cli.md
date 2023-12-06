## Command Line Interface

Simply:

1. Install Langdrive: `npm isntall langdrive`
2. Train a model: ``` `langdrive train` + [...Args]` ```

Here are your Args: 

- `yaml`: Path to optional YAML config doc, default Value: './langdrive.yaml'. This will load up any class and query for records and their values for both inputs and ouputs.
- `csv`: Path to training data. The training data should be a two-column CSV of input and output pairs.
- `hfToken`: An API key provided by Hugging Face with `write` permissions. Get one [here](https://huggingface.co/docs/hub/security-tokens).
- `baseModel`: The original model to train. This can be one of the models in our supported models shown at the bottom of this page
- `deploy`: Weather training weights should be hosted in a hosting service. Default False. 
- `deployToHf`: Whether traiing weights should be stored in huggingface specifically. Either true | false
- `hfModelPath`: The full path to your hugging face model repo where the model should be deployed. Format: hugging face username/model 
- `inputValue`: The input value to extract from the data retrieved, default: 'input'
- `outputValue`: The output value to extract from the data retrieved, default: 'output'


CLI args are parsed as YAML when running commands.

this is a non-exhaustive list of  valid operations

    langdrive train 
    langdrive train --yaml "../pathToYaml.yaml"
    langdrive train --hfToken 1234 --csv "../shared.csv"
    langdrive train --hfToken 1234 --csv ../shared.csv --inputValue "inputColname" --outputValue "colname" 
    langdrive train --csv "./tests/midjourney_prompt.csv" --deploy

