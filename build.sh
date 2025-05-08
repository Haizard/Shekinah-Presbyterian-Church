#!/bin/bash

# Install dependencies for the main project
npm install

# Install dependencies for the React app
cd jsmart1-react
npm install --include=dev

# Build the React app
npm run build

# Return to the root directory
cd ..

# Initialize admin user if needed
node initAdmin.js || true

echo "Build completed successfully!"
