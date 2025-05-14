# Deployment Guide

This document provides instructions for deploying the Shekinah Presbyterian Church Tanzania website to Render.

## Image Handling in Deployment

The website uses images uploaded by administrators through the admin panel. These images are stored in the `public/uploads` directory. To ensure these images are preserved during deployment, we've implemented several mechanisms:

1. The `preserve-uploads.js` script ensures the uploads directory exists in the deployment environment
2. The `copy-uploads.js` script copies the uploads directory to the React build directory
3. The server is configured to serve static files from both the `public` directory and the React build directory

## Deployment Steps

1. Commit your changes to the repository
2. Push the changes to the main branch
3. Render will automatically deploy the changes

## Troubleshooting Image Issues

If you encounter issues with images not displaying correctly after deployment, try the following:

1. Check the Image Debugger in the admin panel (Admin > Image Debugger)
2. Verify that the uploads directory exists in the deployment environment
3. Try re-uploading the images through the admin panel

## Manual Deployment

If you need to deploy manually, follow these steps:

1. Clone the repository
2. Install dependencies: `npm install && cd jsmart1-react && npm install`
3. Build the React app: `cd jsmart1-react && npm run build`
4. Run the preserve-uploads script: `node preserve-uploads.js`
5. Run the copy-uploads script: `node copy-uploads.js`
6. Start the server: `npm start`

## Render Deployment Configuration

The Render deployment is configured in the `render.yaml` file. The key parts of the configuration are:

```yaml
services:
  - type: web
    name: shekinah-church-website
    env: node
    buildCommand: >
      cd jsmart1-react && npm install && npm run build && cd .. && 
      npm install && 
      node preserve-uploads.js && node copy-uploads.js
    startCommand: node server.js
```

This configuration ensures that the uploads directory is preserved during deployment.

## Important Notes

- The `public/uploads` directory is tracked in git to ensure it exists in the deployment environment
- The `.gitkeep` file in the `public/uploads` directory ensures the directory is tracked even if it's empty
- The server is configured to serve static files from both the `public` directory and the React build directory
