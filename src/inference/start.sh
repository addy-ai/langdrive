#!/bin/sh

# Activate the virtual environment
. .venv/bin/activate 

# Start the inference server
nohup python3 -m app &