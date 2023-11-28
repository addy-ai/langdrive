<div align="center">

# LangDrive

### Train, deploy and query open source LLMs using your private data, all from one library.

<p>
<img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/addy-ai/langdrive" />
<img alt="GitHub Last Commit" src="https://img.shields.io/github/last-commit/addy-ai/langdrive" />
<img alt="GitHub Repo Size" src="https://img.shields.io/github/repo-size/addy-ai/langdrive" />
<img alt="GitHub Issues" src="https://img.shields.io/github/issues/addy-ai/langdrive" />
<img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/addy-ai/langdrive" />
<img alt="Github License" src="https://img.shields.io/badge/License-Apache-yellow.svg" />
<img alt="Discord" src="https://img.shields.io/discord/1057844886243643532?label=Discord&logo=discord&logoColor=white&style=plastic&color=d7b023)](https://discord.gg/G8eYmcaTTd" />
</p>

</div>

-----
<p align="center">
  <a href="#-use-cases">Use cases</a> •
  <a href="#-features">Features</a> •
  <a href="https://docs.langdrive.ai" target="_blank">Docs</a> •
  <a href="#-getting-started">Getting started</a> •
  <!-- <a href="#-tutorials" target="_blank">Tutorials</a> •
  <a href="#-tutorials" target="_blank">Blog</a> • -->
  <a href="#-contributions" target="_blank">Contributions</a>
</p>

-----

LangDrive is an open-source AI library that simplifies training, deploying, and querying open-source large language models (LLMs) using private data. It supports data ingestion, fine-tuning, and deployment via a command-line interface, YAML file, or API, with a quick, easy setup.

Read the [docs](https://docs.LangDrive.ai) for more.

-----

## Use cases

LangDrive lets you builds amazing AI apps like:

- Question/Answering over internal documents
- Chatbots
- AI agents
- Content generation

-----

## Features:

- Data ingestion
    LangDrive comes with the following built in data connectors to simplify data ingestion:
    - Firebase Firestore
    - Email Ingestion via SMTP
    - Google Drive
    - CSV
    - Website URL
    - (more coming soon, or you can build yours - LangDrive is open source)

- Fine tuning
    - Fine tune open source LLMs easily by formating your data into input:output completion pairs

- Deployment
    - Add your Hugging Face access token to deploy your model directly to hugging face hub after fine tuning

- Inference
    - Query our supported open source models

- Data Utils
    - LangDrive comes built-in with data utils for CRUD operations for the different data connectors

- API
    - Call our support open source models from a single API
    - Completions API: https://api.langdrive.ai/v1/chat/completions
    - Fine tuning API: https://api.langdrive.ai/train
    - Read the [docs](https://docs.LangDrive.ai) for more.

-----

## Docs
To see full Documentation and examples, go to [docs](https://docs.LangDrive.ai)

-----

## Getting started

The simplest way to get started with LangDrive is through your CLI. For a more detailed overview on getting started using the YAML config and API, please visit the [docs](https://docs.LangDrive.ai).


#### Using the CLI

Node developers can train and deploy a model in 2 simple steps. 

1. `npm install langdrive`
2. `langdrive train --csv ./path/to/csvFileName.csv --hftoken apikey123 --deploy`

In this case, LangDrive will retrieve the data, train a model, host it's weights on Hugging Face, and return an inference endpoint you may use to query the LLM.  
	
The command `langdrive train` is used to train the LLM, please see how to configure the command below.

args:

- `yaml`: Path to optional YAML config doc, default Value: './LangDrive.yaml'. This will load up any class and query for records and their values for both inputs and ouputs.
- `csv`: Path to training dataCSV*The training data should be a two-column CSV of input and output pairs.
- `hfToken`: An API key provided by Hugging Face with `write` permissions. Get one [here](https://huggingface.co/docs/hub/security-tokens).
- `baseModel`: The original model to train: This can be one of the models in our supported models shown at the bottom of this page
- `deployToHf`: true | false
- `hfModelPath`: The full path to your hugging face model repo where the model should be deployed. Format: hugging face username/model

It is assumed you do not want to deploy your model if you run `langdrive train`. In such a case a link to where you can download the weights will be provided. Adding `--deploy` will return a link to the inferencing endpoint.

More information on how to ingest simple data using the CLI can be found in the [docs](https://docs.LangDrive.ai).

-----

## Contributions

LangDrive is open source and we welcome contributions from the community. To contribute, please make a PR through the ["fork and pull request"](https://docs.github.com/en/get-started/quickstart/contributing-to-projects) process.

Join our [Discord](https://discord.gg/G8eYmcaTTd) to keep up to date with the community and roadmap. 

