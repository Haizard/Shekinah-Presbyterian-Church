#!/bin/bash

# Clean up any existing node_modules
echo "Cleaning up node_modules..."
rm -rf node_modules
rm -rf jsmart1-react/node_modules

# Install dependencies for the main project
echo "Installing main project dependencies..."
npm install

# Install dependencies for the React app
echo "Installing React app dependencies..."
cd jsmart1-react
npm install --include=dev

# Build the React app
echo "Building React app..."
npm run build

# Return to the root directory
cd ..

# Initialize admin user if needed
echo "Initializing admin user..."
node initAdmin.js || true

# Ensure uploads directory exists
echo "Preserving uploads directory..."
node preserve-uploads.js

# Copy uploads to the dist directory
echo "Copying uploads to dist directory..."
node copy-uploads.js

# Migrate images to MongoDB
echo "Migrating images to MongoDB..."
node migrate-images-to-mongodb.js

# Restore images from MongoDB
echo "Restoring images from MongoDB..."
node restore-images.js

echo "Build completed successfully!"
