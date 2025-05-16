/**
 * Script to check the build environment on Render
 * This script will output information about the environment to help debug deployment issues
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== BUILD ENVIRONMENT CHECK ===');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  PROJECT_ROOT: process.env.PROJECT_ROOT,
  PERSISTENT_DIR: process.env.PERSISTENT_DIR,
});

// Check if we're on Render
const isRender = process.env.RENDER === 'true';
console.log('Running on Render:', isRender);

// Check directory structure
console.log('\n=== DIRECTORY STRUCTURE ===');
try {
  const rootContents = fs.readdirSync(process.cwd());
  console.log('Root directory contents:', rootContents);

  // Check jsmart1-react directory
  const reactDir = path.join(process.cwd(), 'jsmart1-react');
  if (fs.existsSync(reactDir)) {
    console.log('jsmart1-react directory exists');
    const reactContents = fs.readdirSync(reactDir);
    console.log('jsmart1-react contents:', reactContents);

    // Check dist directory
    const distDir = path.join(reactDir, 'dist');
    if (fs.existsSync(distDir)) {
      console.log('dist directory exists');
      const distContents = fs.readdirSync(distDir);
      console.log('dist contents:', distContents);

      // Check index.html
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        console.log('index.html exists');
        const stats = fs.statSync(indexPath);
        console.log('index.html size:', stats.size, 'bytes');
      } else {
        console.error('ERROR: index.html does not exist');
      }
    } else {
      console.error('ERROR: dist directory does not exist');
    }
  } else {
    console.error('ERROR: jsmart1-react directory does not exist');
  }
} catch (error) {
  console.error('Error checking directory structure:', error);
}

// Check package.json files
console.log('\n=== PACKAGE.JSON FILES ===');
try {
  // Root package.json
  const rootPackageJson = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(rootPackageJson)) {
    const rootPackage = require(rootPackageJson);
    console.log('Root package.json name:', rootPackage.name);
    console.log('Root package.json scripts:', Object.keys(rootPackage.scripts));
  } else {
    console.error('ERROR: Root package.json does not exist');
  }

  // React package.json
  const reactPackageJson = path.join(process.cwd(), 'jsmart1-react', 'package.json');
  if (fs.existsSync(reactPackageJson)) {
    const reactPackage = require(reactPackageJson);
    console.log('React package.json name:', reactPackage.name);
    console.log('React package.json scripts:', Object.keys(reactPackage.scripts));
  } else {
    console.error('ERROR: React package.json does not exist');
  }
} catch (error) {
  console.error('Error checking package.json files:', error);
}

// Try to create the dist directory and index.html if they don't exist
console.log('\n=== ATTEMPTING FIXES ===');
try {
  const distDir = path.join(process.cwd(), 'jsmart1-react', 'dist');
  if (!fs.existsSync(distDir)) {
    console.log('Creating missing dist directory');
    fs.mkdirSync(distDir, { recursive: true });
  }

  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log('Creating missing index.html');
    fs.writeFileSync(indexPath, `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shekinah Presbyterian Church Tanzania</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <h1>Shekinah Presbyterian Church Tanzania</h1>
        <p>This is a temporary page. The React app build was not found.</p>
        <p>Please check the build process in the deployment configuration.</p>
      </body>
      </html>
    `);
  }

  // Create uploads directory in dist
  const distUploadsDir = path.join(distDir, 'uploads');
  if (!fs.existsSync(distUploadsDir)) {
    console.log('Creating missing dist/uploads directory');
    fs.mkdirSync(distUploadsDir, { recursive: true });
  }
} catch (error) {
  console.error('Error attempting fixes:', error);
}

console.log('\n=== BUILD ENVIRONMENT CHECK COMPLETE ===');
