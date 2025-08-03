import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source and destination directories
const sourceDir = path.join(__dirname, 'src', 'Face-api', 'models');
const destDir = path.join(__dirname, 'public', 'models');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created directory: ${destDir}`);
}

// Copy all files from source to destination
try {
  const files = fs.readdirSync(sourceDir);
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied: ${file}`);
  });
  
  console.log('All model files copied successfully!');
} catch (err) {
  console.error('Error copying files:', err);
} 