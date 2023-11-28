#!/bin/bash

docs_dir="./docs"
docs_temp_dir="./documentation"
swap_dir="./temp_swap_dir"

# Function to build and replace 'docs'
build_and_replace_docs() {
  # Create the documenation using chatGPT
  # node mkdocs.js
  mkdocs build
  rm -r "$docs_dir"
  mv "site" "$docs_dir"
}

# Check if '/docs' directory exists and has '.md' files
if [ -d "$docs_dir" ] && [ "$(find "$docs_dir" -name '*.md' | wc -l)" -gt 0 ]; then
  # Swap 'docs' and 'docs_temp' directories
  mv "$docs_dir" "$swap_dir"
  mv "$docs_temp_dir" "$docs_dir"
  mv "$swap_dir" "$docs_temp_dir"
  echo "Swapped '$docs_dir' and '$docs_temp_dir' directories."
fi

# Build and replace 'docs' regardless of whether a swap happened or not
build_and_replace_docs
