# Vertex AI Microservice
Simply calls vertex AI


# Running locally
- Create a python environment
    `python3 -m venv .venv`
    I call it `.venv` folder which is gitignored
- Activate the environment
    `source .venv/bin/activate`


# Build Server to Google Cloud Run
- Make sure you have a Dockerfile
- cd into the server folder and run the following command
``
gcloud builds submit --tag gcr.io/<project-id>/<cloud_run_app_name>
gcloud run deploy --image gcr.io/<project-id>/<cloud_run_app_name>
```
- The following step will ask you for the region to deploy. Choose us-central1
To make us-central1 the default region, Run:
```
gcloud config set run/region us-central1
```