/**
 * Script to ensure the uploads directory exists during deployment
 * This helps preserve the uploads directory structure even when deploying to Render
 */
const fs = require('fs');
const path = require('path');

console.log('Running preserve-uploads script...');

// Ensure uploads directory exists in the deployment
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory for deployment:', uploadsDir);
} else {
  console.log('Uploads directory already exists:', uploadsDir);
}

// Create a .gitkeep file in the uploads directory to ensure it's tracked by git
const gitkeepFile = path.join(uploadsDir, '.gitkeep');
if (!fs.existsSync(gitkeepFile)) {
  fs.writeFileSync(gitkeepFile, '# This file ensures the uploads directory is preserved in git\n');
  console.log('Created .gitkeep file in uploads directory');
}

// Ensure the public/images directory exists
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('Created images directory:', imagesDir);
} else {
  console.log('Images directory already exists:', imagesDir);
}

// Ensure the SPCT directory exists
const spctDir = path.join(imagesDir, 'SPCT');
if (!fs.existsSync(spctDir)) {
  fs.mkdirSync(spctDir, { recursive: true });
  console.log('Created SPCT directory:', spctDir);
} else {
  console.log('SPCT directory already exists:', spctDir);
}

console.log('preserve-uploads script completed successfully');
