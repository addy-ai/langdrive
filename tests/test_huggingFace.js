require('dotenv').config();
const path = require('path');
const HuggingFace = require('../src/huggingFace');
const isPrivate = false; 

const ownerUsername = 'karpathic';
const spaceName = 'test'; 
const fullName = ownerUsername+'/'+spaceName;

// From this directory.
const folderPath = path.join(__dirname, '../src/train/image/'); 

console.log(folderPath)

async function main() { 
    const hf = new HuggingFace(process.env.HUGGINGFACE_API_KEY);

    try {
        await hf.createOrUpdateSpace(fullName, folderPath, isPrivate); 

        let endpoint = `https://${ownerUsername}-${spaceName}.hf.space`;

        // console.log('\nListing available spaces...');
        // const spaces = await hf.listSpaces({});
        // console.log('Available spaces:', spaces.map(space => space.id)); 
    
    } catch (error) {
        console.error('\nAn error occurred:', error);
    }
}

main();
