/**
 * Script to copy the uploads directory to the deployment directory
 * This helps preserve uploaded images during deployment
 *
 * Enhanced version with better error handling and verification
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('Running enhanced copy-uploads script...');

// Source and destination directories
const sourceDir = path.join(__dirname, 'public', 'uploads');
const jsmart1ReactDir = path.join(__dirname, 'jsmart1-react');
const distDir = path.join(jsmart1ReactDir, 'dist');
const destDir = path.join(distDir, 'uploads');

// Also copy to the public directory in the dist folder to ensure images are accessible
const publicDir = path.join(distDir, 'public');
const publicDestDir = path.join(publicDir, 'uploads');

// Ensure the jsmart1-react directory exists
if (!fs.existsSync(jsmart1ReactDir)) {
  console.error('ERROR: jsmart1-react directory does not exist:', jsmart1ReactDir);
  console.log('Creating jsmart1-react directory');
  fs.mkdirSync(jsmart1ReactDir, { recursive: true });
}

// Ensure the dist directory exists
if (!fs.existsSync(distDir)) {
  console.log('Creating dist directory:', distDir);
  fs.mkdirSync(distDir, { recursive: true });
} else {
  console.log('Dist directory exists:', distDir);
}

// Ensure the public directory in dist exists
if (!fs.existsSync(publicDir)) {
  console.log('Creating public directory in dist:', publicDir);
  fs.mkdirSync(publicDir, { recursive: true });
}

// Ensure the source directory exists
if (!fs.existsSync(sourceDir)) {
  fs.mkdirSync(sourceDir, { recursive: true });
  console.log('Created source uploads directory:', sourceDir);
} else {
  console.log('Source uploads directory exists:', sourceDir);
}

// Ensure the destination directories exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('Created destination uploads directory:', destDir);
} else {
  console.log('Destination uploads directory exists:', destDir);
}

// Ensure the public destination directory exists
if (!fs.existsSync(publicDestDir)) {
  fs.mkdirSync(publicDestDir, { recursive: true });
  console.log('Created public destination uploads directory:', publicDestDir);
} else {
  console.log('Public destination uploads directory exists:', publicDestDir);
}

// Function to calculate file hash for verification
const calculateFileHash = (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    console.error(`Error calculating hash for ${filePath}:`, error);
    return null;
  }
};

// Function to copy a file with verification
const copyFile = (source, destination) => {
  try {
    // Calculate source file hash before copying
    const sourceHash = calculateFileHash(source);

    // Copy the file
    fs.copyFileSync(source, destination);

    // Verify the copy was successful by comparing file hashes
    const destHash = calculateFileHash(destination);

    if (sourceHash && destHash && sourceHash === destHash) {
      console.log(`Copied and verified: ${source} -> ${destination}`);
      return true;
    } else {
      console.error(`File verification failed for ${destination}. Hash mismatch.`);
      return false;
    }
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

// Copy the uploads directory to both destinations
try {
  // Copy to the main destination directory
  const result1 = copyDirectory(sourceDir, destDir);
  console.log(`Copy to ${destDir} completed: ${result1.copiedFiles} files copied, ${result1.errors} errors`);

  // Copy to the public destination directory
  const result2 = copyDirectory(sourceDir, publicDestDir);
  console.log(`Copy to ${publicDestDir} completed: ${result2.copiedFiles} files copied, ${result2.errors} errors`);

  // Verify all files were copied correctly
  const totalFiles = result1.copiedFiles + result2.copiedFiles;
  const totalErrors = result1.errors + result2.errors;

  if (totalErrors > 0) {
    console.warn(`WARNING: ${totalErrors} errors occurred during the copy process. Some images may not be available in production.`);
  } else {
    console.log(`SUCCESS: All ${totalFiles} files were copied successfully to both destinations.`);
  }

  // Create a verification file to confirm the script ran successfully
  const verificationFile = path.join(destDir, '.copy-verification');
  fs.writeFileSync(verificationFile, `Copy completed at ${new Date().toISOString()}\nFiles copied: ${totalFiles}\nErrors: ${totalErrors}`);
  console.log(`Created verification file: ${verificationFile}`);

} catch (error) {
  console.error('Error copying uploads directory:', error);
  process.exit(1); // Exit with error code to signal failure
}

console.log('Enhanced copy-uploads script completed successfully');
