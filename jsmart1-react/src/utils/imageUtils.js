/**
 * Utility functions for handling images
 */

// Get the base API URL from the environment or use the same origin
const getBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

    // In production, use the same origin as the frontend
    if (!isLocalhost) {
      return '';  // Empty string means use the same origin
    }

    // In development, use localhost with the correct port (5002)
    return 'http://localhost:5002';
  }

  // Fallback (should rarely happen)
  return '';
};

/**
 * Get the proper image URL for display
 * @param {string} imagePath - The image path from the database
 * @param {string} fallbackImage - The fallback image to use if the path is invalid
 * @returns {string} - The proper image URL
 */
export const getImageUrl = (imagePath, fallbackImage = '') => {
  // If the image path is empty or null, return the fallback image
  if (!imagePath) {
    return fallbackImage;
  }

  // If the image path is a full URL, return it as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If the image path starts with /uploads, it's a user-uploaded image
  if (imagePath.startsWith('/uploads')) {
    // Determine if we're in production or development
    const isProduction = typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1';

    if (isProduction) {
      // CRITICAL FIX: In production, always use a direct path with a unique timestamp
      // This forces the browser to make a new request every time
      const uniqueId = Date.now() + Math.random().toString(36).substring(2, 10);
      return `${imagePath}?nocache=${uniqueId}`;
    } else {
      // In development, use the full URL with the base URL
      const baseUrl = getBaseUrl();
      return `${baseUrl}${imagePath}`;
    }
  }

  // For other static images (not in uploads), use as is
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Otherwise, return the fallback image
  return fallbackImage;
};

/**
 * Handle image loading errors by replacing with a fallback image
 * @param {Event} event - The error event
 * @param {string} fallbackImage - The fallback image to use
 * @param {string} componentName - Optional name of the component for debugging
 */
export const handleImageError = (event, fallbackImage = '', componentName = '') => {
  // Get the original source that failed
  const originalSrc = event.target.src;

  // Track how many attempts we've made
  const attempts = parseInt(event.target.getAttribute('data-retry-attempts') || '0');

  // If we've tried too many times or this is the fallback image, use the final fallback
  if (attempts >= 3 || originalSrc === fallbackImage || originalSrc.includes(fallbackImage)) {
    // Prevent infinite loop
    event.target.onerror = null;

    // Set the fallback image
    event.target.src = fallbackImage;

    // Log the error for debugging
    console.warn(`Image load error${componentName ? ` in ${componentName}` : ''} - using final fallback after ${attempts} attempts:`, {
      originalSrc,
      fallbackUsed: fallbackImage
    });

    // Add data attributes for debugging
    event.target.setAttribute('data-using-fallback', 'true');
    event.target.setAttribute('data-original-src', originalSrc);
    return;
  }

  // Increment the attempt counter
  event.target.setAttribute('data-retry-attempts', (attempts + 1).toString());

  // Get the original path without query parameters
  const pathWithoutQuery = originalSrc.split('?')[0];

  // Extract the filename from the path
  const filename = pathWithoutQuery.split('/').pop();

  // CRITICAL FIX: Try multiple alternative paths
  let newSrc;

  // Determine which alternative to try based on the attempt number
  switch (attempts) {
    case 0:
      // First attempt: Try with a unique cache-busting parameter
      const uniqueId = Date.now() + Math.random().toString(36).substring(2, 10);
      newSrc = `${pathWithoutQuery}?nocache=${uniqueId}`;
      console.log(`First retry attempt: ${newSrc}`);
      break;

    case 1:
      // Second attempt: Try the direct /uploads path
      newSrc = `/uploads/${filename}?nocache=${Date.now()}`;
      console.log(`Second retry attempt (direct uploads path): ${newSrc}`);
      break;

    case 2:
      // Third attempt: Try with a different path structure
      // This handles cases where the image might be in a different location
      if (pathWithoutQuery.includes('/uploads')) {
        // If it's already an uploads path, try without the /uploads prefix
        newSrc = `/${filename}?nocache=${Date.now()}`;
      } else {
        // If it's not an uploads path, try with the /uploads prefix
        newSrc = `/uploads/${filename}?nocache=${Date.now()}`;
      }
      console.log(`Third retry attempt (alternative path structure): ${newSrc}`);
      break;

    default:
      // Fallback to the default image
      newSrc = fallbackImage;
  }

  // Set the new source
  event.target.src = newSrc;
};

/**
 * Debug function to log image information
 * @param {string} imagePath - The image path from the database
 * @param {string} componentName - The name of the component using the image
 * @param {boolean} forceLog - Whether to force logging even in production
 */
export const debugImage = (imagePath, componentName = 'Unknown', forceLog = false) => {
  // Only log in development or if forced
  if (process.env.NODE_ENV !== 'production' || forceLog) {
    const baseUrl = getBaseUrl();
    const processedUrl = getImageUrl(imagePath);

    console.log(`[${componentName}] Image Debug:`, {
      originalPath: imagePath,
      processedPath: processedUrl,
      baseUrl: baseUrl,
      isValid: !!imagePath,
      isUpload: imagePath?.startsWith('/uploads'),
      isUrl: imagePath?.startsWith('http'),
      hostname: window.location.hostname,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });

    // Test if the image is accessible
    if (typeof window !== 'undefined' && imagePath) {
      const img = new Image();
      img.onload = () => console.log(`[${componentName}] Image loaded successfully:`, processedUrl);
      img.onerror = () => console.warn(`[${componentName}] Image failed to load:`, processedUrl);
      img.src = processedUrl;
    }
  }
};

/**
 * Utility to check if all images in the document are loading correctly
 * Call this function in the browser console to diagnose image issues
 */
export const checkAllImages = () => {
  if (typeof document === 'undefined') return;

  const images = document.querySelectorAll('img');
  console.log(`Checking ${images.length} images on the page...`);

  let failedCount = 0;
  let successCount = 0;

  images.forEach((img, index) => {
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt') || 'No alt text';
    const usingFallback = img.getAttribute('data-using-fallback') === 'true';
    const originalSrc = img.getAttribute('data-original-src');

    if (img.complete) {
      if (img.naturalWidth === 0) {
        failedCount++;
        console.warn(`Image #${index} failed to load:`, { src, alt, usingFallback, originalSrc });
      } else {
        successCount++;
      }
    } else {
      img.addEventListener('load', () => {
        successCount++;
      });
      img.addEventListener('error', () => {
        failedCount++;
        console.warn(`Image #${index} failed to load:`, { src, alt });
      });
    }
  });

  console.log(`Image check summary: ${successCount} loaded, ${failedCount} failed, ${images.length - successCount - failedCount} pending`);

  return {
    total: images.length,
    loaded: successCount,
    failed: failedCount,
    pending: images.length - successCount - failedCount
  };
};

export default {
  getImageUrl,
  handleImageError,
  debugImage,
  checkAllImages
};
