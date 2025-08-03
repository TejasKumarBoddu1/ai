import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source and destination directories
const srcDir = path.join(__dirname, 'src', 'Face-api');
const publicDir = path.join(__dirname, 'public', 'face-api');

// Create destination directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`Created directory: ${publicDir}`);
}

// Create models directory in public
const publicModelsDir = path.join(publicDir, 'models');
if (!fs.existsSync(publicModelsDir)) {
  fs.mkdirSync(publicModelsDir, { recursive: true });
  console.log(`Created directory: ${publicModelsDir}`);
}

// Copy Face-API JavaScript files
const jsFiles = ['face-api.js', 'face-api.min.js', 'face-api.js.map', 'script.js'];
jsFiles.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(publicDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${file}`);
  } else {
    console.warn(`Warning: Source file not found: ${srcPath}`);
  }
});

// Copy model files
const srcModelsDir = path.join(srcDir, 'models');
if (fs.existsSync(srcModelsDir)) {
  const modelFiles = fs.readdirSync(srcModelsDir);
  
  modelFiles.forEach(file => {
    const srcPath = path.join(srcModelsDir, file);
    const destPath = path.join(publicModelsDir, file);
    
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied model: ${file}`);
  });
  
  console.log('All model files copied successfully!');
} else {
  console.error('Error: Models directory not found:', srcModelsDir);
}

console.log('Face-API files copied to public directory successfully!'); 