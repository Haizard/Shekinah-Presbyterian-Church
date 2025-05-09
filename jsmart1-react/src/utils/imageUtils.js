/**
 * Utility functions for handling images
 */

// Get the base API URL from the environment or use the same origin
const getBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // In production, use the same origin as the frontend
    if (window.location.hostname !== 'localhost') {
      return '';  // Empty string means use the same origin
    }
  }
  // In development, use localhost with the correct port (5002)
  return 'http://localhost:5002';
};

/**
 * Get the proper image URL for display
 * @param {string} imagePath - The image path from the database
 * @param {string} fallbackImage - The fallback image to use if the path is invalid
 * @returns {string} - The proper image URL
 */
export const getImageUrl = (imagePath, fallbackImage = '/images/SPCT/CHURCH.jpg') => {
  // If the image path is empty or null, return the fallback image
  if (!imagePath) {
    return fallbackImage;
  }

  // If the image path starts with /uploads, it's a user-uploaded image
  if (imagePath.startsWith('/uploads')) {
    // In development, prepend the API base URL
    if (window.location.hostname === 'localhost') {
      console.log('Using API base URL for image:', `${getBaseUrl()}${imagePath}`);
      return `${getBaseUrl()}${imagePath}`;
    }
    return imagePath;
  }

  // If the image path is a full URL, return it as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Otherwise, return the fallback image
  return fallbackImage;
};

/**
 * Handle image loading errors by replacing with a fallback image
 * @param {Event} event - The error event
 * @param {string} fallbackImage - The fallback image to use
 */
export const handleImageError = (event, fallbackImage = '/images/SPCT/CHURCH.jpg') => {
  event.target.onerror = null; // Prevent infinite loop
  event.target.src = fallbackImage;
};

/**
 * Debug function to log image information
 * @param {string} imagePath - The image path from the database
 * @param {string} componentName - The name of the component using the image
 */
export const debugImage = (imagePath, componentName = 'Unknown') => {
  console.log(`[${componentName}] Image Debug:`, {
    originalPath: imagePath,
    processedPath: getImageUrl(imagePath),
    isValid: !!imagePath,
    isUpload: imagePath?.startsWith('/uploads'),
    isUrl: imagePath?.startsWith('http'),
    hostname: window.location.hostname
  });
};

export default {
  getImageUrl,
  handleImageError,
  debugImage
};
