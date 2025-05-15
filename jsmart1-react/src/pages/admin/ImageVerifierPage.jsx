import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageVerifier from '../../components/admin/ImageVerifier';
import '../../styles/admin/ImageVerifierPage.css';

const ImageVerifierPage = () => {
  return (
    <AdminLayout>
      <div className="image-verifier-page">
        <div className="page-header">
          <h1>Image Verifier</h1>
          <p className="description">
            Use this tool to verify image paths and diagnose image loading issues in production.
            This can help identify why images might be reverting to default images after deployment.
          </p>
        </div>
        
        <div className="image-verifier-container">
          <ImageVerifier />
        </div>
        
        <div className="troubleshooting-guide">
          <h2>Troubleshooting Guide</h2>
          
          <div className="guide-section">
            <h3>Common Issues</h3>
            <ul>
              <li>
                <strong>Images revert to default after deployment:</strong> This can happen if the uploaded images 
                aren't being properly copied to the deployment directory. Use this tool to verify if the images 
                exist in both the source and destination directories.
              </li>
              <li>
                <strong>Images work locally but not in production:</strong> This could be due to path differences 
                between development and production environments. Check if the image paths are being correctly 
                resolved in production.
              </li>
              <li>
                <strong>Some images work, others don't:</strong> This might indicate issues with specific file 
                formats or naming conventions. Verify that all image files are being properly copied and served.
              </li>
            </ul>
          </div>
          
          <div className="guide-section">
            <h3>How to Use This Tool</h3>
            <ol>
              <li>
                <strong>Verify Image Path:</strong> Enter the path of an image that's not displaying correctly 
                (e.g., /uploads/file-123456.jpg) and click "Verify Image" to check if the file exists on the server.
              </li>
              <li>
                <strong>List All Uploads:</strong> Click "List All Uploads" to see all files in the uploads directory. 
                This can help identify if files are missing or if there are discrepancies between directories.
              </li>
              <li>
                <strong>Check Image Preview:</strong> After verifying an image path, check the image preview to see 
                if the image loads correctly. If it doesn't, this indicates a problem with the file or its path.
              </li>
            </ol>
          </div>
          
          <div className="guide-section">
            <h3>Solutions</h3>
            <ul>
              <li>
                <strong>Re-upload the image:</strong> If an image is missing from the server, try re-uploading it 
                through the admin panel.
              </li>
              <li>
                <strong>Check deployment scripts:</strong> Ensure that the preserve-uploads.js and copy-uploads.js 
                scripts are running correctly during deployment.
              </li>
              <li>
                <strong>Verify server configuration:</strong> Make sure the server is correctly configured to serve 
                static files from both the public directory and the React build directory.
              </li>
              <li>
                <strong>Clear browser cache:</strong> Sometimes browser caching can cause issues with image loading. 
                Try clearing your browser cache or using incognito mode.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ImageVerifierPage;
