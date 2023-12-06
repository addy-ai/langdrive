# FAQ
**Question**: How can I use secret .env variables within my YAML? <br/>
**Answer**: Put `env:` + `WhatverYourEnvVariableNameIs` in the YAML instead of your secret and it should just work.
<hr/>
**Question**: Where can I find sample docs?<br/>
**Answer**: Right [Here](./samples)
<hr/>
**Question**: Can the CLI and or API be used without the YAML?<br/>
**Answer**: Yes. YAML files are entirely optional.
<hr/>
**Question**: Do YAML settings get overwritten if I pass CLI args or a config in through the API?<br/>
**Answer**: Yes. This is an ideal way to share credentials for multiple models.