---
title: Langdrive Docker Setup
emoji: 🐳
colorFrom: purple
colorTo: gray
sdk: docker
app_port: 7860
suggested_hardware: 't4-medium'
---

# Training Abstraction
Calls a Python process to run the training process

# Quick Startup Training Image
- Running the run.sh script
    - Make sure you're in the train folder
    - From the train directory run `chmod +x run.sh && ./run.sh`

# Running locally
- CD into the /train root dir
- Create a python virtual environment
    `python3 -m venv .venv`
- Activate the environment
    For Mac OS, run: `source .venv/bin/activate`


# Build Server to Google Cloud Run
- Make sure you have a Dockerfile in the `/server` directory 
- cd into the server folder and run the following command
```
gcloud builds submit --tag gcr.io/<project-id>/<cloud_run_app_name>
gcloud run deploy --image gcr.io/<project-id>/<cloud_run_app_name>
```
- The following step will ask you for the region to deploy. Choose us-central1
To make us-central1 the default region, Run:
```
gcloud config set run/region us-central1
```

https://huggingface.co/docs/hub/spaces-config-reference

suggested_hardware : string :  (e.g. "cpu-upgrade", "t4-small", "t4-medium", "a10g-small", "a10g-large", "a10g-largex2", "a10g-largex4" or "a100-large").

