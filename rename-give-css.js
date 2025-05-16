/**
 * Script to rename give.css to Give.css
 * This is necessary because Git doesn't track case changes by default
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Renaming give.css to Give.css...');

// Paths to the CSS files
const stylesDir = path.join(__dirname, 'jsmart1-react', 'src', 'styles');
const giveCssPath = path.join(stylesDir, 'Give.css');
const lowerCaseGiveCssPath = path.join(stylesDir, 'give.css');

// Check if the files exist
const lowerCaseExists = fs.existsSync(lowerCaseGiveCssPath);
const upperCaseExists = fs.existsSync(giveCssPath);

console.log(`Lowercase give.css exists: ${lowerCaseExists}`);
console.log(`Uppercase Give.css exists: ${upperCaseExists}`);

if (lowerCaseExists && !upperCaseExists) {
  console.log('Renaming give.css to Give.css...');
  
  try {
    // On case-insensitive file systems (like Windows), we need to use a temporary name
    const tempPath = path.join(stylesDir, 'give.css.temp');
    
    // First, rename to a temporary file
    fs.renameSync(lowerCaseGiveCssPath, tempPath);
    console.log('Renamed to temporary file');
    
    // Then rename to the final name with correct case
    fs.renameSync(tempPath, giveCssPath);
    console.log('Successfully renamed give.css to Give.css');
  } catch (error) {
    console.error('Error renaming file:', error);
    
    // Fallback: copy the content instead
    console.log('Falling back to copying content...');
    const content = fs.readFileSync(lowerCaseGiveCssPath, 'utf8');
    fs.writeFileSync(giveCssPath, content);
    console.log('Successfully copied content from give.css to Give.css');
  }
} else if (lowerCaseExists && upperCaseExists) {
  console.log('Both files exist. Ensuring they have the same content...');
  
  const lowerCaseContent = fs.readFileSync(lowerCaseGiveCssPath, 'utf8');
  const upperCaseContent = fs.readFileSync(giveCssPath, 'utf8');
  
  if (lowerCaseContent !== upperCaseContent) {
    console.log('Files have different content. Updating Give.css with content from give.css...');
    fs.writeFileSync(giveCssPath, lowerCaseContent);
    console.log('Successfully updated Give.css');
  } else {
    console.log('Files have the same content. No action needed.');
  }
} else if (!lowerCaseExists && upperCaseExists) {
  console.log('Only Give.css exists with correct case. No action needed.');
} else {
  console.log('Neither file exists. Creating Give.css...');
  
  // Create a basic Give.css file
  fs.writeFileSync(giveCssPath, `/* Give Page Styles */
.give-page {
  min-height: 100vh;
}

/* Page Banner */
.page-banner {
  background-color: var(--primary);
  color: white;
  padding: 3rem 0;
  text-align: center;
}

.page-banner h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

/* Giving Intro */
.giving-intro {
  max-width: 800px;
  margin: 0 auto 3rem;
  text-align: center;
  font-size: 1.1rem;
}

/* Giving Options */
.giving-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

@media (min-width: 992px) {
  .giving-options {
    grid-template-columns: 3fr 2fr;
  }
}
`);
  console.log('Created basic Give.css file');
}

console.log('Rename operation completed');
