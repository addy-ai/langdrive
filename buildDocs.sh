#!/bin/bash

# Function to build and replace 'docs'
build_and_replace_docs() {
  # Create the documenation using chatGPT
  # node mkdocs.js
  mkdocs build
  # Backup current 'docs' and move built site to 'docs'
  mv "./docs" "./docs_backup"
  mv "./site" "./docs"
}

# Check if '/docs' directory exists and has '.md' files
if [ -d "$docs_dir" ] && [ "$(find "$docs_dir" -name '*.md' | wc -l)" -gt 0 ]; then
  # Swap 'docs' and 'documentation' directories
  mv "./docs" "./temp_swap_dir"
  mv "./documentation" "./docs"
  mv "./temp_swap_dir" "./documentation"
  echo "Swapped "./docs" and "./documentation" directories."
fi

# Build and replace 'docs' regardless of whether a swap happened or not
build_and_replace_docs