There are many ways to configure your YAML doc to support maximal flexibility.

The basis of your YAML doc will most typically have a `train` object along with any other classes you want to configure

The Classes being configured like:

    firestore: 
      clientJson: "secrets/firebase_service_client.json"
      databaseURL: "env:FIREBASE_DATABASE_URL"

    drive:
      clientJson: "secrets/drive_service_client.json" 

    email:
      password: env:GMAIL_PASSWORD
      email: env:GMAIL_EMAIL

    huggingface:
      token: env:HUGGINGFACE_API_KEY 


**note**: CLI based commands will retrieve the YAML doc and merge any args into the root of the yaml doc and processed accordingly. 

Example 0: Bespoke example with many settings

    ```
    verbose: true
    firestore: 
      clientJson: "secrets/firebase_service_client.json"
      databaseURL: "env:FIREBASE_DATABASE_URL"

    drive:
      appType: "desktop"
      clientJson: "secrets/drive_service_client.json" 
      scopes: 
        - "https://www.googleapis.com/auth/drive"
        - "https://www.googleapis.com/auth/drive.metadata.readonly"

    email:
      password: env:GMAIL_PASSWORD
      email: env:GMAIL_EMAIL

    huggingface:
      hfToken: env:HUGGINGFACE_API_KEY
      baseModel: vilsonrodrigues/falcon-7b-instruct-sharded
      trainedModel: karpathic/falcon-7b-instruct-tuned
      deployToHf: true 

    train:
      service: firestore
      query: 
        filterCollectionWithMultipleWhereClauseWithLimit:
          collection: "chat-state"
          filterKey: ["type"]
          filterData: ["customer-inquiry-bot"]
          operation: ["=="]
          limit: 5
      input:
        value: "chat.0.content"
      output:
        value: "chat.1.content"
    ```


Example 1: Training on a CSV with two columns  (or an `input` and `output` column).

    train:
      path: ../shared.csv

Example 2: Specify Input and Output values in a CSV

    train:
      path: ../shared.csv               - Default Path for Input and Output 
      inputValue: input                 - Attribute to extract from path
      outpuValue: output 

Example 3: Attribute to extract from path

    train: 
      inputPath: ../input.csv
      outputPath: ../output.csv
      inputValue: input
      outpuValue: output 

Example 4: Attribute to extraxt path using input and output objects

    train:
      input: 
        path: ../input.csv 
        value: colname
      output:
        path: ../output.csv
        value: colname

Example 5: Specifying default path for Input and Output

    train:
      path: ../shared.csv
      input:              
        value: colname
      output:
        value: colname


Querying for data from a `service` is denoted by the `query` attribute placed.

This may be placed as a base object, or nested within a 'input' or 'output' object.

The `query` value follows the schema

    train:
      service: 'serviceName'
      query: serviceMethodName : {methodParameters}

Here's an example:

    train:
      service: 'firestore' 
      query:
        filterCollectionWithMultipleWhereClauseWithLimit:
          collection: "chat-state"
          filterKey: []
          filterData: []
          operation: []
          limit: 5
      input:
        value: "chat.0.content"
      output:
        value: "chat.1.content"

    train:
      service: 'gdrive' 
      query:
        getFileByName:
          filename: 'test123'
          mimeType: 'application/msword'
          directory: false
          directoryId: false
      input:
        value: "input"
      output:
        value: "output"

To specify the model you want to train and where to host it:

```
    huggingface:
      hfToken: env:HUGGINGFACE_API_KEY
      baseModel: vilsonrodrigues/falcon-7b-instruct-sharded
      trainedModel: karpathic/falcon-7b-instruct-tuned
      deployToHf: true 
```

 