#!/bin/bash

# Function to build and replace 'docs'
build_and_replace_docs() {
  # Create the documenation using chatGPT
  # node mkdocs.js
  mkdocs build
  # Backup current 'docs' and move built site to 'docs'
  rm -rf "./docs_backup"
  cp -rf "./docs" "./docs_backup"
  rm -rf "./docs"
  mv "./site" "./docs"
  echo " ./docs directories has html files now."
}

# Check if '/docs' directory exists but doesn't have '.md' files
if [ -d "$docs_dir" ] && [ "$(find "$docs_dir" -name '*.md' | wc -l)" -eq 0 ]; then
  # Copy the backup into docs.
  rm -rf "./docs"
  cp -rf "./docs_backup" "./docs"
  echo " ./docs directories has md files now for mkdocs compiling."
fi

# Build and replace 'docs' regardless of whether a swap happened or not
build_and_replace_docs