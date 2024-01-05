# Use a Python base image
FROM python:3.8-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y libpq-dev && \
    apt-get install -y --no-install-recommends libjpeg-dev libpng-dev && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy files and install Python dependencies
COPY . .
RUN pip install -r requirements.txt

# Make port 7860 available to the world outside this container
EXPOSE 7860 

# Run the script when the container starts
CMD ["python", "app.py"]
