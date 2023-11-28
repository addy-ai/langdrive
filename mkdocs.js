const fs = require('fs');
const path = require('path');
require('dotenv').config();

// import openai
const OpenAIApi = require('openai');

async function llmMd(prompt) {
  const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [{ "role": "system", "content": prompt.systemPrompt }, { "role": "user", "content": prompt.userPrompt }],
    temperature: 1,
    max_tokens: 4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  console.log('CHATGPT RETURNED :\n\n', response.choices[0], '\n\n : END CHATGPT RESPONSE')
  return response.choices[0]
}

function generateDocumentation(filePath, outputDirectory) {
  const gettingStarted = fs.readFileSync('./docs/gettingStarted.md', 'utf8');
  const index = fs.readFileSync('./docs/index.md', 'utf8');

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsFileName = path.basename(filePath, '.js');
  const markdownFileName = `${jsFileName}.md`;
  const outputFilePath = path.join(outputDirectory, markdownFileName);

  const prompt = {
    systemPrompt: `You are a developer working on a project that uses a JavaScript library. 
    You have been provided with a Markdown file that contains introductory documentation for the library. 
    You have been asked to generate documentation for a JavaScript class and its methods using the following Markdown file as a template:  \n\n
    # ClassName Documentation\n\n
    **Description**: A clear and concise description of the class and its purpose.\n\n 

    For each method follow this structure:\n\n
    ### Method: \`methodName()\`\n
    **Returns**: A description of what the method returns.\n
    **Description**:\n
      - A detailed description of what the method does.\n
      - Any error handling or exceptional cases.\n
    **Example**: A brief explanation of how to use the method within a larger project.\n\n
          Example code
    \n\n
    **Parameters**: This should include a markdown rendered table with columns for Parameter Name, Description, and Accepted Values/Data Types.\n
    \n\n
    | Parameter Name | Description | Accepted Values/Data Types |
    | -------------- | ----------- | --------------------------- |
    | paramName1    |             |                             |
    | paramName2    |             |                             |
    | ...           |             |                             | \n\n

    Please ensure the markdown table is formatted correctly and will render when passed through a markdown renderer with two empty lines above and below it.\n\n

    Here is the index page of the documentation for reference:\n\n
      ${index}\n\n
    Here is the getting started page of the documentation for reference:\n\n
      ${gettingStarted}\n\n
      Please ensure the final markdown is clear, well-structured, and follows the format outlined above.\n
      What you return is the finished markdown file.
    `,
    userPrompt: `Please give me only the finished markdown, this is the Javascript Class Code:\n\n${fileContent}\n`
  };

  return llmMd(prompt)
    .then(documentation => { 
      // Extract and format the relevant content from the response
      const content = documentation.message.content;
      fs.writeFileSync(outputFilePath, content);
      console.log(`Documentation for ${jsFileName} has been saved to ${outputFilePath}`);
    })
    .catch(error => console.error('Error:', error));
}

const files = ['huggingFace.js', 'gdrive.js', 'email.js', 'firestore.js', 'heroku.js', 'train.js'];
const folderDirectory = './src/';
const outputDirectory = './docs/api'; // Change this to the desired output directory
files.map( (jsFile, i) => { 
  const filePath = path.join(folderDirectory, jsFile);
  setTimeout(function(){ generateDocumentation(filePath, outputDirectory); }, i * 2000);
});