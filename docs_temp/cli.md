## Command Line Interface

Simply:

1. Install Langdrive: `npm isntall langdrive`
2. Train a model: ``` `langdrive deploy` + [...Args]` ```

Here are your Args:

 
- --path -  Path to a YAML file.
- --csv - Path to a CSV to train on.
- --model - Name of model to use.
- --hfkey - API key of Huggingface
- --deploy - Boolean: True/False.


CLI args are parsed as YAML when running commands.

this is a non-exhaustive list of  valid operations

    langdrive deploy 
    langdrive deploy yaml=../pathToYaml.yaml
    langdrive deploy hfAPIKey=1234 path=../shared.csv
    langdrive deploy hfAPIKey=1234 path=../shared.csv inputValue=colname outputValue=colname 
    langdrive deploy hfAPIKey=1234 inputPath=../input.csv inputValue=colname outputPath=../output.csv outputValue=colname 