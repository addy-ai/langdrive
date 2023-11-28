#!/bin/bash

docs_dir="./docs"
docs_temp_dir="./documentation"
swap_dir="./swap_dir"

# Function to start 'mkdocs serve'
start_mkdocs_serve() {
  mkdocs serve
}

# Check if '/docs' directory exists and has '.md' files, then start 'mkdocs serve'
if [ -d "$docs_dir" ] && [ "$(find "$docs_dir" -name '*.md' | wc -l)" -gt 0 ]; then
  start_mkdocs_serve
elif [ -d "$docs_temp_dir" ] && [ "$(find "$docs_temp_dir" -name '*.md' | wc -l)" -gt 0 ]; then
  # Swap '/docs' and '/temp_swap_dir'
  mv "$docs_dir" "$swap_dir"
  mv "$docs_temp_dir" "$docs_dir"
  mv "$swap_dir" "$docs_temp_dir"
  echo "Swapped '$docs_dir' and '$docs_temp_dir' directories."
  
  # Start 'mkdocs serve' since we know there are '.md' files in the newly assigned 'docs' directory
  start_mkdocs_serve
else
  echo "Directory '$docs_dir' and '$docs_temp_dir' either do not exist or have no '.md' files."
fi
