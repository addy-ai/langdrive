#!/bin/bash
# This script assumes you have git installed and have cloned the LangDrive git repo from here
# https://github.com/addy-ai/langdrive.git and are in the langdrive directory
# If you haven't done that yet
# please run "sudo apt-get install git && git clone https://github.com/addy-ai/langdrive.git && cd langdrive"


# Auto configure Python environment for LLM training

# Update system
echo "LangDrive - Updating system"
sudo apt-get update

# Finished system udpate
echo "LangDrive - Finished system update"

# Install python
echo "LangDrive - Installing Python3"
sudo apt-get install python3

# Install pip
echo "LangDrive - Installing Pip3"
sudo apt-get install python3-pip

# Changing into the src/train directory
echo "LangDrive - Changing into src/train directory"
cd src/train

# Install venv 
echo "LangDrive - Installing venv"
sudo apt-get install python3-venv

# Create virtual environment
echo "LangDrive - Creating virtual environment"
python3 -m venv .venv

# Activating the virtual enviroment
echo "Activating the virtual environment"
source .venv/bin/activate

# Changing into server/src directory
echo "Changing into server/src directory"
cd server/src

# Confirming Virtual Environment is active
if [[ "$VIRTUAL_ENV" != "" ]]; then
    echo "Virtual Environment is active"
    
    # If requirements.txt exists in the directory
    if [ -e requirements.txt ]; then

        # Pip Install 
        echo "Installing requirements from requirements.txt"
        pip install -r requirements.txt
    
        # If app.py exists in the directory, run it
        if [ -e app.py ]; then
            echo "Running app.py"
            python app.py

        else
            echo "app.py file does not exist in the current directory"
        fi

    else
        echo "requirements.txt file does not exist in the current directory"
    fi
else 
    echo "Virtual Environment is not active. Please activate it."
fi




