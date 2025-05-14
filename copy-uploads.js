/**
 * Script to copy the uploads directory to the deployment directory
 * This helps preserve uploaded images during deployment
 */
const fs = require('fs');
const path = require('path');

console.log('Running copy-uploads script...');

// Source and destination directories
const sourceDir = path.join(__dirname, 'public', 'uploads');
const destDir = path.join(__dirname, 'jsmart1-react', 'dist', 'uploads');

// Ensure the source directory exists
if (!fs.existsSync(sourceDir)) {
  fs.mkdirSync(sourceDir, { recursive: true });
  console.log('Created source uploads directory:', sourceDir);
} else {
  console.log('Source uploads directory exists:', sourceDir);
}

// Ensure the destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('Created destination uploads directory:', destDir);
} else {
  console.log('Destination uploads directory exists:', destDir);
}

// Function to copy a file
const copyFile = (source, destination) => {
  try {
    fs.copyFileSync(source, destination);
    console.log(`Copied: ${source} -> ${destination}`);
    return true;
  } catch (error) {
    console.error(`Error copying file ${source}:`, error);
    return false;
  }
};

// Function to copy a directory recursively
const copyDirectory = (source, destination) => {
  // Get all files and directories in the source directory
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  let copiedFiles = 0;
  let errors = 0;
  
  // Process each entry
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    
    if (entry.isDirectory()) {
      // Create the directory if it doesn't exist
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
        console.log(`Created directory: ${destPath}`);
      }
      
      // Recursively copy the directory
      const result = copyDirectory(sourcePath, destPath);
      copiedFiles += result.copiedFiles;
      errors += result.errors;
    } else {
      // Copy the file
      const success = copyFile(sourcePath, destPath);
      if (success) {
        copiedFiles++;
      } else {
        errors++;
      }
    }
  }
  
  return { copiedFiles, errors };
};

// Copy the uploads directory
try {
  const result = copyDirectory(sourceDir, destDir);
  console.log(`Copy completed: ${result.copiedFiles} files copied, ${result.errors} errors`);
} catch (error) {
  console.error('Error copying uploads directory:', error);
}

console.log('copy-uploads script completed');
