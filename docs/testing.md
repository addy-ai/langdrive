# NPM TESTING

Package.json
```
  "main": "main.js",
  "bin": {
    "langdrive": "./main.js"
  },
```

The bin section ensures you can use the main.js script as a CLI command after deploying it to npm.

main.js
```
#!/usr/bin/env node
if (process.argv.length >= 3 && process.argv[2] === 'deploy') {
  console.log('test');
}
```

`npm link --loglevel verbose` - Uses loads the current repo and a npm module. 
`npm unlink langdrive` - Unlink for good measure
`npm unlink langdrive, npm link --loglevel verbose` - Do both

`langdrive deploy --path "../../path/to/file.yaml"` - Test path