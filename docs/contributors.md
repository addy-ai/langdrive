# Contributing

Thank you for the interest! We would love to see a PR!

At the moment the CLI only supports the `deploy` command:

main.js
```
#!/usr/bin/env node
if (process.argv.length >= 3 && process.argv[2] === 'deploy') {
  console.log('test');
}
```

To help with your development, these command may help:

- `npm link --loglevel verbose` - Uses loads the current repo and a npm module. 
- `npm unlink langdrive` - Unlink for good measure
- `npm unlink langdrive, npm link --loglevel verbose` - Do both
- `langdrive deploy --path "../../path/to/file.yaml"` - Test path

### Docs 

Two bash scripts exist to help with the development of our docs.

- `pip install mkdocs` - Installs mkdocs
- `npm run serveDocs` - Serves .md files from ./docs using mkdocs' dev server
- `npm run buildDocs` - Builds the site using ./docs' for use in github pages