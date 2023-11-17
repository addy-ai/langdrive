    // langdrive deploy 
    // langdrive deploy yaml=../pathToYaml.yaml
    // langdrive deploy hfAPIKey=1234 path=../shared.csv
    // langdrive deploy hfAPIKey=1234 path=../shared.csv inputValue=colname outputValue=colname 
    // langdrive deploy hfAPIKey=1234 inputPath=../input.csv inputValue=colname outputPath=../output.csv outputValue=colname 


    filterCollectionWithMultipleWhereClauseWithLimit:
      collection: "chat-state"
      filterKey: []
      filterData: []
      operation: []
      limit: 5

      

    /* yaml Example 1
    train:
      path: ../shared.csv
    */
    /* yaml Example 1
    train:
      path: ../shared.csv               - Default Path for Input and Output 
      inputValue: input                 - Attribute to extract from path
      outpuValue: output 
    */
    /* yaml Example 1
    train: 
      inputPath: ../input.csv
      outputPath: ../output.csv
      inputValue: input                 - Attribute to extract from path
      outpuValue: output 
    */
    /* yaml Example 1
    train:
      input: 
        path: ../input.csv              - 
        value: colname
      output:
        path: ../output.csv
        value: colname
    */
    /* yaml Example 1
    train:
      path: ../shared.csv               - Default Path for Input and Output
      input:             - 
        value: colname
      output:
        value: colname
    */