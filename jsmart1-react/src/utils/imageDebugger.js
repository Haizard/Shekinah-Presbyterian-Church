/**
 * Image Debugger Utility
 * 
 * This utility provides functions to help diagnose and fix image loading issues,
 * especially in production environments.
 * 
 * Usage:
 * 1. Import this file in your component: import ImageDebugger from '../utils/imageDebugger';
 * 2. Call ImageDebugger.diagnose() to check all images on the page
 * 3. Call ImageDebugger.fixImages() to attempt to fix broken images
 */

import { getImageUrl, handleImageError, checkAllImages } from './imageUtils';

/**
 * Diagnose image loading issues on the current page
 * @returns {Object} Statistics about images on the page
 */
export const diagnose = () => {
  console.log('🔍 Running image diagnostics...');
  
  // Check all images on the page
  const stats = checkAllImages();
  
  // Log environment information
  console.log('Environment:', {
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    protocol: window.location.protocol,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });
  
  return stats;
};

/**
 * Attempt to fix broken images by reloading them with cache-busting
 * @returns {number} Number of images fixed
 */
export const fixImages = () => {
  if (typeof document === 'undefined') return 0;
  
  console.log('🔧 Attempting to fix broken images...');
  
  const images = document.querySelectorAll('img');
  let fixedCount = 0;
  
  images.forEach((img) => {
    // Check if the image failed to load
    if (img.complete && img.naturalWidth === 0) {
      const originalSrc = img.getAttribute('data-original-src') || img.src;
      
      // Try to fix the image by adding a cache-busting parameter
      const timestamp = new Date().getTime();
      const newSrc = originalSrc.includes('?') 
        ? `${originalSrc}&t=${timestamp}` 
        : `${originalSrc}?t=${timestamp}`;
      
      console.log(`Fixing image: ${originalSrc} -> ${newSrc}`);
      
      // Set the new source
      img.src = newSrc;
      fixedCount++;
    }
  });
  
  console.log(`Fixed ${fixedCount} images`);
  return fixedCount;
};

/**
 * Force reload all images with cache-busting parameters
 * @returns {number} Number of images reloaded
 */
export const forceReloadAllImages = () => {
  if (typeof document === 'undefined') return 0;
  
  console.log('🔄 Force reloading all images...');
  
  const images = document.querySelectorAll('img');
  let reloadedCount = 0;
  
  images.forEach((img) => {
    const originalSrc = img.src;
    
    // Skip images that are already using cache-busting
    if (originalSrc.includes('t=') && originalSrc.includes('?')) {
      return;
    }
    
    // Add a cache-busting parameter
    const timestamp = new Date().getTime();
    const newSrc = originalSrc.includes('?') 
      ? `${originalSrc}&t=${timestamp}` 
      : `${originalSrc}?t=${timestamp}`;
    
    // Set the new source
    img.src = newSrc;
    reloadedCount++;
  });
  
  console.log(`Reloaded ${reloadedCount} images`);
  return reloadedCount;
};

/**
 * Check if an image URL is accessible
 * @param {string} url - The image URL to check
 * @returns {Promise<boolean>} Whether the image is accessible
 */
export const isImageAccessible = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// Export all functions
export default {
  diagnose,
  fixImages,
  forceReloadAllImages,
  isImageAccessible
};
