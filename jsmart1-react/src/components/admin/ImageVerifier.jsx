import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faSync, faSearch, faList, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';
import '../../styles/admin/ImageVerifier.css';

/**
 * Component for verifying and diagnosing image issues in production
 */
const ImageVerifier = () => {
  const [imagePath, setImagePath] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadsList, setUploadsList] = useState(null);
  const [uploadsLoading, setUploadsLoading] = useState(false);
  const [recentPaths, setRecentPaths] = useState([]);

  // Load recent paths from localStorage on component mount
  useEffect(() => {
    const savedPaths = localStorage.getItem('recentImagePaths');
    if (savedPaths) {
      try {
        setRecentPaths(JSON.parse(savedPaths));
      } catch (err) {
        console.error('Error parsing saved paths:', err);
        localStorage.removeItem('recentImagePaths');
      }
    }
  }, []);

  // Save a path to recent paths
  const saveToRecentPaths = (path) => {
    const updatedPaths = [path, ...recentPaths.filter(p => p !== path)].slice(0, 10);
    setRecentPaths(updatedPaths);
    localStorage.setItem('recentImagePaths', JSON.stringify(updatedPaths));
  };

  // Verify an image path
  const verifyImage = async () => {
    if (!imagePath) {
      setError('Please enter an image path');
      return;
    }

    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const response = await api.imageVerify.verifyImage(imagePath);
      setVerificationResult(response);
      saveToRecentPaths(imagePath);
    } catch (err) {
      console.error('Error verifying image:', err);
      setError(err.message || 'Error verifying image');
    } finally {
      setLoading(false);
    }
  };

  // List all uploads
  const listUploads = async () => {
    setUploadsLoading(true);
    setError(null);

    try {
      const response = await api.imageVerify.listUploads();
      setUploadsList(response);
    } catch (err) {
      console.error('Error listing uploads:', err);
      setError(err.message || 'Error listing uploads');
    } finally {
      setUploadsLoading(false);
    }
  };

  // Set a path from the uploads list
  const setPathFromUploads = (path) => {
    setImagePath(path);
    setVerificationResult(null);
  };

  return (
    <div className="image-verifier">
      <h2>Image Verifier</h2>
      <p className="description">
        Use this tool to verify image paths and diagnose image loading issues in production.
      </p>

      <div className="verification-form">
        <div className="input-group">
          <input
            type="text"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            placeholder="Enter image path (e.g., /uploads/file-123456.jpg)"
            className="image-path-input"
          />
          <button
            className="verify-button"
            onClick={verifyImage}
            disabled={loading || !imagePath}
          >
            {loading ? <FontAwesomeIcon icon={faSync} spin /> : <FontAwesomeIcon icon={faSearch} />}
            {loading ? 'Verifying...' : 'Verify Image'}
          </button>
        </div>

        {recentPaths.length > 0 && (
          <div className="recent-paths">
            <h4>Recent Paths:</h4>
            <div className="recent-paths-list">
              {recentPaths.map((path, index) => (
                <button
                  key={index}
                  className="recent-path-button"
                  onClick={() => setImagePath(path)}
                >
                  {path}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </div>
        )}

        {verificationResult && (
          <div className="verification-result">
            <h3>Verification Result</h3>
            <div className="result-summary">
              <div className={`result-status ${verificationResult.exists ? 'success' : 'error'}`}>
                <FontAwesomeIcon icon={verificationResult.exists ? faCheck : faTimes} />
                {verificationResult.exists ? 'Image exists' : 'Image not found'}
              </div>
              <div className="result-path">
                <strong>Path:</strong> {verificationResult.imagePath}
              </div>
              <div className="result-environment">
                <strong>Environment:</strong> {verificationResult.serverInfo.environment}
              </div>
            </div>

            <div className="result-locations">
              <h4>Checked Locations:</h4>
              <ul>
                {verificationResult.locations.map((location, index) => (
                  <li key={index} className={location.exists ? 'exists' : 'not-exists'}>
                    <FontAwesomeIcon icon={location.exists ? faCheck : faTimes} />
                    <span className="location-path">{location.path}</span>
                    {location.exists && (
                      <span className="location-details">
                        ({location.size} bytes, {location.isDirectory ? 'directory' : 'file'})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="image-preview">
              <h4>Image Preview:</h4>
              <div className="preview-container">
                <img
                  src={getImageUrl(verificationResult.imagePath)}
                  alt="Verification preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/SPCT/CHURCH.jpg';
                    e.target.classList.add('error');
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="uploads-section">
        <h3>Uploads Directory</h3>
        <button
          className="list-uploads-button"
          onClick={listUploads}
          disabled={uploadsLoading}
        >
          {uploadsLoading ? <FontAwesomeIcon icon={faSync} spin /> : <FontAwesomeIcon icon={faList} />}
          {uploadsLoading ? 'Loading...' : 'List All Uploads'}
        </button>

        {uploadsList && (
          <div className="uploads-result">
            <div className="uploads-summary">
              <div className="summary-item">
                <strong>Public uploads:</strong> {uploadsList.publicFiles}
              </div>
              <div className="summary-item">
                <strong>Dist uploads:</strong> {uploadsList.distFiles}
              </div>
              <div className="summary-item">
                <strong>Only in public:</strong> {uploadsList.onlyInPublic}
              </div>
              <div className="summary-item">
                <strong>Only in dist:</strong> {uploadsList.onlyInDist}
              </div>
              <div className="summary-item">
                <strong>In both:</strong> {uploadsList.inBoth}
              </div>
            </div>

            <div className="uploads-files">
              <h4>Files in Public Uploads:</h4>
              <div className="files-list">
                {uploadsList.files.public.map((file, index) => (
                  <div key={index} className="file-item">
                    <button
                      className="file-path-button"
                      onClick={() => setPathFromUploads(file.path)}
                    >
                      {file.name}
                    </button>
                    <span className="file-details">
                      ({Math.round(file.size / 1024)} KB, {new Date(file.modified).toLocaleString()})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageVerifier;
