/*
// Source Data is either provided as {data}, retrieved via {path} , or using a service object { classInstance, query }
// The data provided is expected to be an array. {value} is optional and points to the  location of our data from the source Data
//
// ARGS:
// 
// input - {path, data, classInstance, query: {} } - Required for Service info, Optional way to specify Path/Data attributes
// inputData - [data] - Actaul Final Data - no Value use Needed
// inputPath - "path to csv" - Required if 'input' service object nor 'inputData' is provided  
// inputValue - csvColumnName or QueryObjProperty - Optional, specified a column or attribute from the dataset provided to use as the inputData.
//
*/
// import Papa from 'papaparse'; // CSV Parser

class Train {
  constructor(props) {
    const { verbose, ...train } = props;
    this.verbose = verbose || false;

    // Set Inputs
    const i = props.input || {};
    this.inputData = props.inputData || i.data || props.data || false
    this.inputPath = props.inputPath || i.path || props.path || false
    this.inputService = props.inputService || i.service || props.service || false // Config
    this.inputQuery = props.inputQuery || i.query || props.query || false
    this.inputValue = props.inputValue || i.value || false

    // Set Output
    const o = props.output || {};
    this.outputData = props.outputData || o.data || props.data || false
    this.outputPath = props.outputPath || o.path || props.path || false  // !data & !service user input 
    this.outputService = props.outputService || o.service || props.service || false // !data & !path user input 
    this.outputQuery = props.outputQuery || o.query || props.query || false //
    this.outputValue = props.outputValue || o.value || false
  }

  // Initialize the class
  static async init(config) {
    if (config.verbose) console.log('DriveTrain init()');
    if (typeof (config) !== 'object') { return }
    let trainer = new Train(config);
    let { inp, out } = await trainer.prepareData();
    return trainer
  }

  async trainModel(huggingfaceInfo) {
    if (this.verbose) { console.log('DriveTrain:trainModel()'); }
    /*
    X - Format ingested data from emails & firestore into JSON of {input,output}
    X - Grab all required params from YAML
    ? - Make API call to python repo in GCP to fine tune 		-> using req params  ->  Our private one... unless they deploy the build themselves.
    ? - In python repo, convert the JSON training data to CSV 	-> 
    ? - Save the CSV in DEV-120 to a folder in the repo path	-> This is funny.
    ? - Reference the CSV file in training
    ? - Delete the training CSV after training is complete, 
    ? - do this in the fask api method
    */
    // data = inp || this.data
    let sendThis = {
      "baseModel": huggingfaceInfo.baseModel,
      "trainingData": this.data,
      "hfToken": huggingfaceInfo.hfToken,
      "deployToHf": huggingfaceInfo.deployToHf,
      "hfModelPath": huggingfaceInfo.trainedModel,                             // where to save the fine tuned model
    }
    console.log('DriveTrain:trainModel:sendThis', sendThis)
    let model = await fetch('https://api.langdrive.ai/train', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sendThis)
    })

    return model
  }

  // Retrieve the data needed
  async prepareData() {
    if (this.verbose) console.log('DriveTrain:PrepareData()');
    let inp = this.input = await this.getData('input');
    let out = this.output = await this.getData('output');

    console.log('DriveTrain:PrepareData:inp', inp, out)

    // create a new array of objects with the input and output data
    let data = this.data = inp.map((input, i) => { return { input, output: out[i] } })

    // this.verbose && console.log(`DriveTrain:PrepareData:FIN`,this.input, this.output)
    return data
  }

  // Source type 1
  getDataFromUrl(url) {
    return new Promise((resolve, reject) => {
      Papa.parse(url, {
        download: true,
        header: true,
        complete: function (results) {
          resolve(results.data || results.text || results.error)
        }
      })
    })
  }

  // Source type 2
  async getDataFromService(classInstance, query) {
    this.verbose && console.log('DriveTrain:prepareData:getDataFromService')
    let classMethodName = Object.keys(query)[0]
    let fn = classInstance[classMethodName]
    let getOrderedFnArgNames = (func) => { // Returns Class Method Parameters in Order of Declaration
      const fnStr = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
      const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
      return result === null ? [] : result;
    } 
    let args = getOrderedFnArgNames(fn).map((paramName) => query[classMethodName][paramName])
    args = args[0] != undefined && args || [query[classMethodName]] 
    let data = await Promise.resolve(classInstance[classMethodName](...args)) // Preserve 'this'   
    return data
  }
  // Handle the optional 'value' parameter from Source Data
  getValuesFromData(data, value) {
    if (!value) { return data }
    if (value === '*') { return data }
    else {
      // Iterate through each row and retrieve the value
      return data.map((row) => {
        if (value.includes('.')) {
          return value.split('.').reduce((obj, key) => obj ? obj[isNaN(key) ? key : parseInt(key)] : undefined, row);
        }
        return row[value]
      })
    }
  }

  // Retrieves data and handles the optional 'value' parameter
  async getData(lbl) { 
    this.verbose && console.log(`DriveTrain:getData: ${lbl}`)

    let path = this[`${lbl}Path`]
    let service = this[`${lbl}Service`]
    let query = this[`${lbl}Query`]
    let data = this[`${lbl}Data`]
    let value = this[`${lbl}Value`]

    
    // console.log('getData: ', {path, service, query, data, value})

    // Get raw Data from URL 
    if (!data && path) { data = await this.getDataFromUrl(path); }
    // Get raw Data from Service   
    else if (!data && service && query) { data = await this.getDataFromService(service, query) }
    console.log('RAW DATA WE WILL PULL VALUES FROM', data)
    // Retrieve Data from raw Data  
    let fin = this.getValuesFromData(data, value)
    return fin
  }
}
module.exports = Train;