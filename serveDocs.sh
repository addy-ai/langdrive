# Function to start 'mkdocs serve'
start_mkdocs_serve() {
  mkdocs serve
}

# Check if '/docs' directory exists and has '.md' files, then start 'mkdocs serve'
if [ -d "./docs" ] && [ "$(find "./docs" -name '*.md' | wc -l)" -gt 0 ]; then
  start_mkdocs_serve
elif [ -d "./docs_backup" ] && [ "$(find "./docs_backup" -name '*.md' | wc -l)" -gt 0 ]; then
  # remove current 'docs' directory and copy the backup into 'docs'
  if [ -d "./docs" ]; then
    rm -rf "./docs"
  fi
  cp -r ./docs_backup ./docs
  echo "copied './docs' and './docs_backup' directories."
  
  # Start 'mkdocs serve' since we know there are '.md' files in the newly assigned 'docs' directory
  start_mkdocs_serve
else
  echo "Directory './docs' and './docs_backup' either do not exist or have no '.md' files."
fi
