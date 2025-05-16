/**
 * Script to check for case-sensitivity issues in the project
 * This script scans all files for potential case-sensitivity issues
 */
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

console.log('Checking for case-sensitivity issues...');

// Function to recursively get all files in a directory
async function getFiles(dir, fileList = []) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        fileList = await getFiles(filePath, fileList);
      }
    } else {
      fileList.push({ path: filePath, name: file });
    }
  }

  return fileList;
}

// Function to check for case-sensitivity issues
async function checkCaseSensitivity() {
  try {
    // Get all files in the project
    const files = await getFiles(__dirname);
    console.log(`Found ${files.length} files to check`);

    // Create a map of lowercase filenames to their actual paths
    const fileMap = new Map();
    const issues = [];

    for (const file of files) {
      const lowerName = file.name.toLowerCase();
      const dirName = path.dirname(file.path);

      // Skip common patterns that are intentionally different case
      // For example, models/User.js and routes/user.js are common patterns
      if (
        (dirName.includes('models') && file.name.charAt(0) === file.name.charAt(0).toUpperCase()) ||
        (dirName.includes('routes') && file.name.charAt(0) === file.name.charAt(0).toLowerCase()) ||
        (dirName.includes('controllers') && file.name.includes('Controller'))
      ) {
        continue;
      }

      // Skip CSS files that are intentionally different case
      // For example, Component.css and component.css
      if (file.name.endsWith('.css') && dirName.includes('styles')) {
        continue;
      }

      if (fileMap.has(lowerName)) {
        // Found a potential case-sensitivity issue
        const existingFile = fileMap.get(lowerName);

        // Skip if one file is in models and the other is in routes
        if (
          (existingFile.path.includes('models') && file.path.includes('routes')) ||
          (existingFile.path.includes('routes') && file.path.includes('models'))
        ) {
          continue;
        }

        if (existingFile.name !== file.name) {
          issues.push({
            file1: existingFile,
            file2: file
          });
        }
      } else {
        fileMap.set(lowerName, file);
      }
    }

    // Report issues
    if (issues.length > 0) {
      console.log(`Found ${issues.length} case-sensitivity issues:`);

      for (const issue of issues) {
        console.log(`\nCase-sensitivity issue detected:`);
        console.log(`File 1: ${issue.file1.path}`);
        console.log(`File 2: ${issue.file2.path}`);
        console.log('These files have the same name but different case, which can cause issues in case-sensitive file systems.');
      }

      return issues;
    } else {
      console.log('No case-sensitivity issues found!');
      return [];
    }
  } catch (error) {
    console.error('Error checking case-sensitivity:', error);
    return [];
  }
}

// Main function
async function main() {
  const issues = await checkCaseSensitivity();

  if (issues.length > 0) {
    console.log('\nRecommendations:');
    console.log('1. Rename one of the files to have a completely different name');
    console.log('2. Update all imports to use the correct case');
    console.log('3. Consider using a tool like "git mv" to rename files while preserving history');

    // Exit with error code
    process.exit(1);
  } else {
    // Exit with success code
    process.exit(0);
  }
}

main();
