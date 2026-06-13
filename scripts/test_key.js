import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../.env');

// Load API Key
if (!fs.existsSync(envPath)) {
  console.error('.env not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
let apiKey = '';
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^\s*VITE_GEMINI_API_KEY\s*=\s*(.*)$/);
  if (match) {
    apiKey = match[1].trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
  }
});

if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY not found in .env');
  process.exit(1);
}

console.log(`🔑 Using API Key: ${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`);

async function checkModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.error) {
      console.error('❌ Google API Error:', JSON.stringify(data.error, null, 2));
      return;
    }
    
    console.log('\n====================================================');
    console.log('✅ Success! Your API Key is working perfectly.');
    console.log('====================================================');
    console.log('\nHere are the models you can access on this project:');
    
    if (data.models && data.models.length > 0) {
      data.models.forEach(model => {
        // filter down to relevant generation models to keep it readable
        if (model.supportedGenerationMethods.includes('generateContent')) {
          console.log(`• ${model.name.replace('models/', '')} (${model.displayName})`);
        }
      });
    } else {
      console.log('No models found?');
    }
    console.log('====================================================');
  } catch (err) {
    console.error('Network Error:', err);
  }
}

checkModels();
