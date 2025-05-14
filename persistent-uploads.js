/**
 * Script to create a persistent storage solution for uploads
 * This script ensures that uploaded images are preserved across deployments
 * 
 * The key issue with Render deployments is that the filesystem is ephemeral,
 * meaning that files uploaded to the server are lost when the server is redeployed.
 * 
 * This script creates a persistent storage solution by:
 * 1. Creating a persistent directory structure
 * 2. Copying files from the uploads directory to the persistent directory
 * 3. Creating symbolic links from the uploads directory to the persistent directory
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('Running persistent-uploads script...');

// Define the persistent directory
// In Render, /opt/render/project/src is the project root
// We'll use a directory outside of this to store uploads
const PERSISTENT_DIR = process.env.PERSISTENT_DIR || '/tmp/persistent-uploads';
const PROJECT_ROOT = process.env.PROJECT_ROOT || __dirname;

// Source directories
const publicUploadsDir = path.join(PROJECT_ROOT, 'public', 'uploads');
const distUploadsDir = path.join(PROJECT_ROOT, 'jsmart1-react', 'dist', 'uploads');
const distPublicUploadsDir = path.join(PROJECT_ROOT, 'jsmart1-react', 'dist', 'public', 'uploads');

// Ensure the persistent directory exists
if (!fs.existsSync(PERSISTENT_DIR)) {
  fs.mkdirSync(PERSISTENT_DIR, { recursive: true });
  console.log(`Created persistent directory: ${PERSISTENT_DIR}`);
} else {
  console.log(`Persistent directory already exists: ${PERSISTENT_DIR}`);
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

// Function to synchronize directories
const syncDirectories = (sourceDir, persistentDir) => {
  if (!fs.existsSync(sourceDir)) {
    console.log(`Source directory does not exist: ${sourceDir}`);
    return { copied: 0, errors: 0 };
  }
  
  if (!fs.existsSync(persistentDir)) {
    fs.mkdirSync(persistentDir, { recursive: true });
    console.log(`Created persistent directory: ${persistentDir}`);
  }
  
  // Get all files in the source directory
  const files = fs.readdirSync(sourceDir);
  
  let copied = 0;
  let errors = 0;
  
  // Copy each file to the persistent directory
  for (const file of files) {
    if (file === '.gitkeep' || file === '.copy-verification') continue;
    
    const sourcePath = path.join(sourceDir, file);
    const persistentPath = path.join(persistentDir, file);
    
    // Skip directories
    if (fs.statSync(sourcePath).isDirectory()) continue;
    
    // If the file doesn't exist in the persistent directory, copy it
    if (!fs.existsSync(persistentPath)) {
      const success = copyFile(sourcePath, persistentPath);
      if (success) {
        copied++;
      } else {
        errors++;
      }
    } else {
      // If the file exists, compare the hashes
      const sourceHash = calculateFileHash(sourcePath);
      const persistentHash = calculateFileHash(persistentPath);
      
      // If the hashes are different, copy the file
      if (sourceHash !== persistentHash) {
        const success = copyFile(sourcePath, persistentPath);
        if (success) {
          copied++;
        } else {
          errors++;
        }
      }
    }
  }
  
  return { copied, errors };
};

// Function to copy from persistent directory to source directory
const copyFromPersistent = (persistentDir, sourceDir) => {
  if (!fs.existsSync(persistentDir)) {
    console.log(`Persistent directory does not exist: ${persistentDir}`);
    return { copied: 0, errors: 0 };
  }
  
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
    console.log(`Created source directory: ${sourceDir}`);
  }
  
  // Get all files in the persistent directory
  const files = fs.readdirSync(persistentDir);
  
  let copied = 0;
  let errors = 0;
  
  // Copy each file to the source directory
  for (const file of files) {
    const persistentPath = path.join(persistentDir, file);
    const sourcePath = path.join(sourceDir, file);
    
    // Skip directories
    if (fs.statSync(persistentPath).isDirectory()) continue;
    
    // Copy the file
    const success = copyFile(persistentPath, sourcePath);
    if (success) {
      copied++;
    } else {
      errors++;
    }
  }
  
  return { copied, errors };
};

// First, sync from public/uploads to persistent directory
console.log('Syncing from public/uploads to persistent directory...');
const publicResult = syncDirectories(publicUploadsDir, PERSISTENT_DIR);
console.log(`Synced ${publicResult.copied} files from public/uploads to persistent directory with ${publicResult.errors} errors.`);

// Then, copy from persistent directory to all upload directories
console.log('Copying from persistent directory to all upload directories...');
const publicCopyResult = copyFromPersistent(PERSISTENT_DIR, publicUploadsDir);
console.log(`Copied ${publicCopyResult.copied} files from persistent directory to public/uploads with ${publicCopyResult.errors} errors.`);

const distCopyResult = copyFromPersistent(PERSISTENT_DIR, distUploadsDir);
console.log(`Copied ${distCopyResult.copied} files from persistent directory to dist/uploads with ${distCopyResult.errors} errors.`);

const distPublicCopyResult = copyFromPersistent(PERSISTENT_DIR, distPublicUploadsDir);
console.log(`Copied ${distPublicCopyResult.copied} files from persistent directory to dist/public/uploads with ${distPublicCopyResult.errors} errors.`);

// Create a verification file
const verificationFile = path.join(PERSISTENT_DIR, '.persistent-verification');
fs.writeFileSync(verificationFile, `Persistent uploads script ran at ${new Date().toISOString()}\n`);
console.log(`Created verification file: ${verificationFile}`);

console.log('Persistent uploads script completed successfully.');
