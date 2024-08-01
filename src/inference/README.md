# Inference

## Setup Instructions

1. Set up a virtual environment called `.venv` in your project, follow these steps:

    - Open a terminal or command prompt.
    - Navigate to the root directory of your project.
    - Check if a virtual environment named `.venv` already exists by running the following command:

        ```shell
        ls .venv
        ```

        If the command returns a result, it means the virtual environment already exists.

    - If the virtual environment doesn't exist, create it by running the following command:

        ```shell
        python3 -m venv .venv
        ```

    - Activate the virtual environment by running the appropriate command based on your operating system:

        - For macOS/Linux:

        ```shell
        source .venv/bin/activate
        ```

        - For Windows:

        ```shell
        .venv\Scripts\activate
        ```

        Once activated, you should see the name of the virtual environment (`(.venv)`) in your terminal prompt.

    - You can now install any required dependencies or packages within the virtual environment.
        - pip install llmware
        - pip install -r requirements.txt

2. Run the Flask Server
    Run `python3 -m app` in this directory

Remember to activate the virtual environment every time you work on your project to ensure that you are using the correct Python environment.
