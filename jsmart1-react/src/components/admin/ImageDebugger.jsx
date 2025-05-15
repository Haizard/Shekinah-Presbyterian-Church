import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl } from '../../utils/imageUtils';
import ImageDebugger from '../../utils/imageDebugger';
import '../../styles/admin/ImageDebugger.css';

/**
 * Image Debugger Component for Admin Panel
 * This component helps diagnose and fix image loading issues
 */
const AdminImageDebugger = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testImage, setTestImage] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [fixedCount, setFixedCount] = useState(0);
  const [recentImages, setRecentImages] = useState([]);

  // Run diagnostics on mount
  useEffect(() => {
    runDiagnostics();
    
    // Get recent images from localStorage if available
    const savedImages = localStorage.getItem('recentImagePaths');
    if (savedImages) {
      try {
        setRecentImages(JSON.parse(savedImages));
      } catch (e) {
        console.error('Failed to parse saved images:', e);
      }
    }
  }, []);

  // Run image diagnostics
  const runDiagnostics = () => {
    setLoading(true);
    
    // Small delay to ensure UI updates
    setTimeout(() => {
      const results = ImageDebugger.diagnose();
      setStats(results);
      setLoading(false);
    }, 500);
  };

  // Fix broken images
  const fixImages = () => {
    setLoading(true);
    
    // Small delay to ensure UI updates
    setTimeout(() => {
      const fixed = ImageDebugger.fixImages();
      setFixedCount(fixed);
      
      // Re-run diagnostics after fixing
      runDiagnostics();
    }, 500);
  };

  // Force reload all images
  const forceReloadAllImages = () => {
    setLoading(true);
    
    // Small delay to ensure UI updates
    setTimeout(() => {
      const reloaded = ImageDebugger.forceReloadAllImages();
      setFixedCount(reloaded);
      
      // Re-run diagnostics after reloading
      runDiagnostics();
    }, 500);
  };

  // Test a specific image URL
  const testImageUrl = async () => {
    if (!testImage) return;
    
    setLoading(true);
    setTestResult(null);
    
    try {
      // Process the image URL
      const processedUrl = getImageUrl(testImage);
      
      // Test if the image is accessible
      const isAccessible = await ImageDebugger.isImageAccessible(processedUrl);
      
      // Save to recent images if not already there
      if (!recentImages.includes(testImage)) {
        const updatedImages = [testImage, ...recentImages.slice(0, 4)];
        setRecentImages(updatedImages);
        localStorage.setItem('recentImagePaths', JSON.stringify(updatedImages));
      }
      
      setTestResult({
        originalUrl: testImage,
        processedUrl,
        isAccessible,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setTestResult({
        originalUrl: testImage,
        error: error.message,
        isAccessible: false,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-debugger-container">
      <h2>Image Debugger</h2>
      <p className="description">
        This tool helps diagnose and fix image loading issues in the application.
      </p>
      
      <div className="debugger-actions">
        <button 
          className="btn btn-primary" 
          onClick={runDiagnostics}
          disabled={loading}
        >
          <FontAwesomeIcon icon="search" /> Run Diagnostics
        </button>
        
        <button 
          className="btn btn-success" 
          onClick={fixImages}
          disabled={loading || !stats}
        >
          <FontAwesomeIcon icon="wrench" /> Fix Broken Images
        </button>
        
        <button 
          className="btn btn-warning" 
          onClick={forceReloadAllImages}
          disabled={loading}
        >
          <FontAwesomeIcon icon="sync" /> Force Reload All Images
        </button>
      </div>
      
      {loading && (
        <div className="loading-indicator">
          <FontAwesomeIcon icon="spinner" spin /> Running...
        </div>
      )}
      
      {stats && (
        <div className="stats-container">
          <h3>Diagnostic Results</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Images:</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item success">
              <span className="stat-label">Loaded:</span>
              <span className="stat-value">{stats.loaded}</span>
            </div>
            <div className="stat-item error">
              <span className="stat-label">Failed:</span>
              <span className="stat-value">{stats.failed}</span>
            </div>
            <div className="stat-item warning">
              <span className="stat-label">Pending:</span>
              <span className="stat-value">{stats.pending}</span>
            </div>
          </div>
          
          {fixedCount > 0 && (
            <div className="fixed-message">
              <FontAwesomeIcon icon="check-circle" /> Fixed {fixedCount} images
            </div>
          )}
        </div>
      )}
      
      <div className="image-tester">
        <h3>Test Specific Image</h3>
        <div className="test-input-container">
          <input
            type="text"
            value={testImage}
            onChange={(e) => setTestImage(e.target.value)}
            placeholder="Enter image path (e.g., /uploads/file-123.jpg)"
            className="test-input"
          />
          <button 
            className="btn btn-primary" 
            onClick={testImageUrl}
            disabled={loading || !testImage}
          >
            Test Image
          </button>
        </div>
        
        {recentImages.length > 0 && (
          <div className="recent-images">
            <h4>Recent Images:</h4>
            <div className="recent-images-list">
              {recentImages.map((img, index) => (
                <button
                  key={index}
                  className="recent-image-btn"
                  onClick={() => setTestImage(img)}
                >
                  {img}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {testResult && (
          <div className="test-result">
            <h4>Test Result:</h4>
            <div className="result-details">
              <div className="result-item">
                <span className="result-label">Original URL:</span>
                <span className="result-value">{testResult.originalUrl}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Processed URL:</span>
                <span className="result-value">{testResult.processedUrl}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Status:</span>
                <span className={`result-value ${testResult.isAccessible ? 'success' : 'error'}`}>
                  {testResult.isAccessible ? 'Accessible' : 'Not Accessible'}
                </span>
              </div>
              {testResult.error && (
                <div className="result-item">
                  <span className="result-label">Error:</span>
                  <span className="result-value error">{testResult.error}</span>
                </div>
              )}
            </div>
            
            {testResult.processedUrl && (
              <div className="image-preview">
                <h4>Image Preview:</h4>
                <img
                  src={testResult.processedUrl}
                  alt="Test"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/SPCT/CHURCH.jpg';
                    e.target.classList.add('error');
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImageDebugger;
