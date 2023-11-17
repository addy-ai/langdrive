
// Run multiple tests to check the Nodejs HuggingFace Class

// Import the huggingFace class
const HuggingFace = require('../src/huggingFace.js')

// Create the HuggingFace Class
const huggingFace = new HuggingFace()

// Test the tokenIsValid function
let tokenIsValid = huggingFace.tokenIsValid()

// Test the hubExists function
let hubExists = huggingFace.hubExists()

// Test the questionAnswering function
