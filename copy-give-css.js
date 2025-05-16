/**
 * Script to copy the Give.css file to the correct location during the build process
 */
const fs = require('fs');
const path = require('path');

console.log('Copying Give.css file...');

// Paths to the CSS files
const giveCssPath = path.join(__dirname, 'jsmart1-react', 'src', 'styles', 'Give.css');
const lowerCaseGiveCssPath = path.join(__dirname, 'jsmart1-react', 'src', 'styles', 'give.css');

// Check if the Give.css file exists
if (fs.existsSync(giveCssPath)) {
  console.log('Give.css file exists with correct case');
} else if (fs.existsSync(lowerCaseGiveCssPath)) {
  console.log('Found lowercase give.css, creating a copy with correct case...');
  
  // Copy the file with the correct case
  const content = fs.readFileSync(lowerCaseGiveCssPath, 'utf8');
  fs.writeFileSync(giveCssPath, content);
  console.log('Successfully created Give.css with correct case');
} else {
  console.log('Neither Give.css nor give.css found in styles directory');
  
  // Create a basic Give.css file
  console.log('Creating a basic Give.css file...');
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

// Also create a copy of the file with lowercase name for backward compatibility
if (fs.existsSync(giveCssPath) && !fs.existsSync(lowerCaseGiveCssPath)) {
  console.log('Creating lowercase give.css for backward compatibility...');
  const content = fs.readFileSync(giveCssPath, 'utf8');
  fs.writeFileSync(lowerCaseGiveCssPath, content);
  console.log('Successfully created lowercase give.css');
}

console.log('Copy completed successfully');
