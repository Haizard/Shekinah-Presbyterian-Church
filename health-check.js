/**
 * Health check script for Render deployment
 * This script checks if the application is running correctly
 */
const fs = require('fs');
const path = require('path');

console.log('=== HEALTH CHECK ===');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);

// Check if critical directories exist
const criticalPaths = [
  { path: path.join(__dirname, 'jsmart1-react'), name: 'jsmart1-react directory' },
  { path: path.join(__dirname, 'jsmart1-react', 'dist'), name: 'dist directory' },
  { path: path.join(__dirname, 'jsmart1-react', 'dist', 'index.html'), name: 'index.html file' },
  { path: path.join(__dirname, 'public'), name: 'public directory' },
  { path: path.join(__dirname, 'public', 'uploads'), name: 'uploads directory' },
];

let allPathsExist = true;

for (const { path: pathToCheck, name } of criticalPaths) {
  const exists = fs.existsSync(pathToCheck);
  console.log(`${name} exists: ${exists}`);
  
  if (!exists) {
    allPathsExist = false;
  }
}

if (allPathsExist) {
  console.log('All critical paths exist. Health check passed.');
  process.exit(0); // Success
} else {
  console.error('Some critical paths are missing. Health check failed.');
  process.exit(1); // Failure
}
