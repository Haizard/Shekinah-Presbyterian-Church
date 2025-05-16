/**
 * Script to check for case-sensitive file imports that might cause issues in production
 * This script scans all JavaScript and JSX files for import statements and checks if the imported files exist
 */
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

// Function to recursively get all files in a directory
async function getFiles(dir, fileList = []) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);
    
    if (stats.isDirectory()) {
      fileList = await getFiles(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Function to extract import statements from a file
async function extractImports(filePath) {
  const content = await readFile(filePath, 'utf8');
  const importRegex = /import\s+(?:(?:{[^}]*}|\*\s+as\s+[^;]+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
  
  const imports = [];
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.push({
      path: match[1],
      statement: match[0],
      line: content.substring(0, match.index).split('\n').length
    });
  }
  
  return imports;
}

// Function to check if an imported file exists
function checkImportExists(importPath, filePath) {
  // Skip node_modules and external imports
  if (importPath.startsWith('@') || 
      !importPath.startsWith('.') || 
      importPath.includes('node_modules')) {
    return { exists: true, importPath };
  }
  
  // Resolve the import path relative to the file
  const fileDir = path.dirname(filePath);
  let resolvedPath = path.resolve(fileDir, importPath);
  
  // If the import doesn't have an extension, try common extensions
  if (!path.extname(resolvedPath)) {
    const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css'];
    
    for (const ext of extensions) {
      if (fs.existsSync(resolvedPath + ext)) {
        return { exists: true, importPath, resolvedPath: resolvedPath + ext };
      }
    }
    
    // Try with /index.js and similar
    for (const ext of extensions) {
      if (fs.existsSync(path.join(resolvedPath, 'index' + ext))) {
        return { exists: true, importPath, resolvedPath: path.join(resolvedPath, 'index' + ext) };
      }
    }
  } else if (fs.existsSync(resolvedPath)) {
    return { exists: true, importPath, resolvedPath };
  }
  
  // Check if there's a case-sensitivity issue
  const dir = path.dirname(resolvedPath);
  const basename = path.basename(resolvedPath);
  
  if (fs.existsSync(dir)) {
    try {
      const files = fs.readdirSync(dir);
      const matchingFile = files.find(file => file.toLowerCase() === basename.toLowerCase());
      
      if (matchingFile && matchingFile !== basename) {
        return { 
          exists: false, 
          importPath, 
          resolvedPath,
          caseSensitivityIssue: true,
          correctCase: matchingFile
        };
      }
    } catch (error) {
      // Ignore errors reading directory
    }
  }
  
  return { exists: false, importPath, resolvedPath };
}

// Main function
async function main() {
  try {
    console.log('Checking for case-sensitive imports...');
    
    // Get all JS and JSX files in the project
    const reactDir = path.join(__dirname, 'jsmart1-react', 'src');
    const files = await getFiles(reactDir);
    
    console.log(`Found ${files.length} JavaScript/JSX files to check`);
    
    let issues = 0;
    
    // Check each file for imports
    for (const file of files) {
      const imports = await extractImports(file);
      
      for (const importItem of imports) {
        const result = checkImportExists(importItem.path, file);
        
        if (!result.exists) {
          issues++;
          
          if (result.caseSensitivityIssue) {
            console.log(`\nCase sensitivity issue in ${file.replace(__dirname, '')}`);
            console.log(`Line ${importItem.line}: ${importItem.statement}`);
            console.log(`Import path: ${importItem.path}`);
            console.log(`Resolved path: ${result.resolvedPath}`);
            console.log(`Correct case: ${result.correctCase}`);
            console.log(`Suggestion: Change import to '${importItem.path.replace(path.basename(importItem.path), result.correctCase)}'`);
          } else {
            console.log(`\nMissing import in ${file.replace(__dirname, '')}`);
            console.log(`Line ${importItem.line}: ${importItem.statement}`);
            console.log(`Import path: ${importItem.path}`);
            console.log(`Resolved path: ${result.resolvedPath}`);
          }
        }
      }
    }
    
    if (issues === 0) {
      console.log('No case sensitivity issues found!');
    } else {
      console.log(`\nFound ${issues} import issues that might cause problems in production.`);
    }
  } catch (error) {
    console.error('Error checking imports:', error);
  }
}

main();
