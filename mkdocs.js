const fs = require('fs');
const path = require('path');
require('dotenv').config();

// import openai
const OpenAIApi = require('openai');

async function llmMd(prompt) {
  const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ "role": "user", "content": prompt }],
    temperature: 1,
    max_tokens: 4056,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  console.log(response.choices[0])
  return response.choices[0]
}

function generateDocumentation(filePath, outputDirectory) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsFileName = path.basename(filePath, '.js');
  const markdownFileName = `${jsFileName}.md`;
  const outputFilePath = path.join(outputDirectory, markdownFileName);

  const prompt = `
  Generate Markdown documentation for a JavaScript class defined in the code below. The Markdown should include the following information:\n\n
  - **Header**: ClassName Documentation\n\n
  - **Description**: A clear and concise description of the class and its purpose.\n\n 
  
  The documentation should follow this structure for each method:

  ### Method: \`methodName()\`
  - **Returns**: A description of what the method returns.
  - **Description**:
    - A detailed description of what the method does.
    - Any error handling or exceptional cases.
  - **Examples**: Provide practical usage examples of how to use the class within a larger project. Each example should be accompanied by a code snippet and a brief explanation.\n\n
    Please ensure that the resulting documentation is clear, well-structured, and follows this format for each method.
  - **Parameters**: A table with columns for Parameter Name, Description, and Accepted Values/Data Types.
    | Parameter Name | Description | Accepted Values/Data Types |
    | -------------- | ----------- | --------------------------- |
    | paramName1    |             |                             |
    | paramName2    |             |                             |
    | ...           |             |                             |
  
  ${fileContent}
  `;
  return llmMd(prompt)
    .then(documentation => {
      // Extract and format the relevant content from the response
      const content = documentation.message.content.strip();
      fs.writeFileSync(outputFilePath, content);
      console.log(`Documentation for ${jsFileName} has been saved to ${outputFilePath}`);
    })
    .catch(error => console.error('Error:', error));
}


const jsFile = 'huggingFace.js';
const folderDirectory = './src/';
const outputDirectory = './docs/api'; // Change this to the desired output directory
const filePath = path.join(folderDirectory, jsFile);

generateDocumentation(filePath, outputDirectory);
