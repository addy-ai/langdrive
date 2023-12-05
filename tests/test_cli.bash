#!/bin/bash

echo "Testing langdrive CLI CSV1"

# Execute additional langdrive train commands
langdrive train --yaml false --csv ./tests//midjourney_prompt.csv --hfToken env:HUGGINGFACE_API_KEY --deploy --hfModelPath karpathic/falcon-7b-instruct-tuned

echo "Testing langdrive CLI CSV2"
langdrive train --yaml false --csv ./tests//midjourney_prompt.csv --hfToken env:HUGGINGFACE_API_KEY --deploy --hfModelPath karpathic/falcon-7b-instruct-tuned --inputValue input --outputValue output

echo "Testing langdrive CLI CSV3"
langdrive train --yaml false --inputPath ./tests//midjourney_prompt.csv --outputPath ./tests//midjourney_prompt.csv --hfToken env:HUGGINGFACE_API_KEY --deploy --hfModelPath karpathic/falcon-7b-instruct-tuned --inputValue input --outputValue output

# Define an array of YAML files
yamls=(test1.yaml test2.yaml test3.yaml test4.yaml test5.yaml)

# Iterate over YAML files and execute the langdrive train command
for yaml in "${yamls[@]}"; do
    echo "${yaml[@]}"
    langdrive train --yaml ./tests/yamls/"$yaml"
done