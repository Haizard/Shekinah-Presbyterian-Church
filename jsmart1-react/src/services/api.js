// API service for making requests to the backend

// Determine the API base URL based on the environment
let API_BASE_URL;

// Check if we're in production (deployed) or development environment
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Development - use localhost with the specific port
  // This is the port where your backend server is running locally
  API_BASE_URL = 'http://localhost:5002';
} else {
  // Production - since backend and frontend are deployed together on Render,
  // we can use a relative URL to the current domain
  // This will make requests to the same domain where the app is hosted
  API_BASE_URL = '';
}

// Log the API base URL for debugging
console.log('Environment:', process.env.NODE_ENV);
console.log('Hostname:', window.location.hostname);

console.log('API Base URL:', API_BASE_URL);

// Get the user from localStorage
const getUser = () => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};

// Request cache to prevent duplicate in-flight requests
const requestCache = new Map();
// Error cache to prevent hammering endpoints that are failing
const errorCache = new Map();
// Response cache for quick access to previously fetched data
const responseCache = new Map();

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;
// Error cache TTL (30 seconds)
const ERROR_CACHE_TTL = 30 * 1000;

// Function to generate a cache key from URL and options
const getCacheKey = (url, options) => {
  const method = options.method || 'GET';
  return `${method}:${url}:${options.body || ''}`;
};

// Base API request function with deduplication and caching
const apiRequest = async (url, options = {}) => {
  // Get the user token if available
  const user = getUser();

  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization header if user is logged in
  if (user?.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }

  // Merge options
  const requestOptions = {
    ...options,
    headers,
  };

  // Prepend the API base URL to the provided URL if it's not empty
  const fullUrl = API_BASE_URL ? `${API_BASE_URL}${url}` : url;

  // Generate cache key
  const cacheKey = getCacheKey(url, requestOptions);

  // Check if this is a GET request that can be cached
  const isGetRequest = !options.method || options.method === 'GET';

  // Check if we have a cached error for this request
  if (errorCache.has(cacheKey)) {
    const { error, timestamp } = errorCache.get(cacheKey);
    const age = Date.now() - timestamp;

    // If the error is still fresh, don't retry yet
    if (age < ERROR_CACHE_TTL) {
      console.log(`API Request to ${fullUrl} skipped due to recent error (${age}ms ago)`);
      throw error;
    }

    // Error cache expired, remove it
    errorCache.delete(cacheKey);
  }

  // For GET requests, check if we have a cached response
  if (isGetRequest && responseCache.has(cacheKey)) {
    const { data, timestamp } = responseCache.get(cacheKey);
    const age = Date.now() - timestamp;

    // If the cache is still fresh, return the cached data
    if (age < CACHE_TTL) {
      console.log(`API Request to ${fullUrl} served from cache (${age}ms old)`);
      return data;
    }
  }

  // Check if we already have an in-flight request for this URL
  if (requestCache.has(cacheKey)) {
    console.log(`API Request to ${fullUrl} already in progress, reusing promise`);
    return requestCache.get(cacheKey);
  }

  // Create a new request promise
  const requestPromise = (async () => {
    try {
      console.log(`API Request to: ${fullUrl}`, { method: requestOptions.method || 'GET' });

      const response = await fetch(fullUrl, requestOptions);
      console.log(`API Response status: ${response.status} ${response.statusText}`);

      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error(`API Error (${fullUrl}):`, errorData);
          const error = new Error(errorData.message || `Server responded with status: ${response.status}`);

          // Cache the error
          errorCache.set(cacheKey, { error, timestamp: Date.now() });

          throw error;
        } catch (jsonError) {
          // If we can't parse JSON from the error response
          console.error(`API Error (${fullUrl}): Could not parse error response`, jsonError);
          const error = new Error(`Server responded with status: ${response.status}`);

          // Cache the error
          errorCache.set(cacheKey, { error, timestamp: Date.now() });

          throw error;
        }
      }

      // Parse JSON response
      try {
        const data = await response.json();
        console.log('API Response data:', data);

        // Cache the response for GET requests
        if (isGetRequest) {
          responseCache.set(cacheKey, { data, timestamp: Date.now() });
        }

        return data;
      } catch (jsonError) {
        console.error(`API Error (${fullUrl}): Could not parse JSON response`, jsonError);
        const error = new Error('Invalid response format from server');

        // Cache the error
        errorCache.set(cacheKey, { error, timestamp: Date.now() });

        throw error;
      }
    } catch (error) {
      console.error(`API Error (${fullUrl}):`, error);
      console.error('Request options:', JSON.stringify(requestOptions, null, 2));

      // Cache the error if it's a network error
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        errorCache.set(cacheKey, { error, timestamp: Date.now() });
      }

      throw error;
    } finally {
      // Remove this request from the cache when it completes
      requestCache.delete(cacheKey);
    }
  })();

  // Store the promise in the request cache
  requestCache.set(cacheKey, requestPromise);

  return requestPromise;
};

// API functions for different endpoints
const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    register: (userData) => apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    getProfile: () => apiRequest('/api/auth/profile'),
    updateProfile: (userData) => apiRequest('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  },

  // Ministries endpoints
  ministries: {
    getAll: () => apiRequest('/api/ministries'),
    getById: (id) => apiRequest(`/api/ministries/${id}`),
    create: (ministryData) => apiRequest('/api/ministries', {
      method: 'POST',
      body: JSON.stringify(ministryData),
    }),
    update: (id, ministryData) => apiRequest(`/api/ministries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ministryData),
    }),
    delete: (id) => apiRequest(`/api/ministries/${id}`, {
      method: 'DELETE',
    }),
  },

  // Sermons endpoints
  sermons: {
    getAll: () => apiRequest('/api/sermons'),
    getById: (id) => apiRequest(`/api/sermons/${id}`),
    create: (sermonData) => apiRequest('/api/sermons', {
      method: 'POST',
      body: JSON.stringify(sermonData),
    }),
    update: (id, sermonData) => apiRequest(`/api/sermons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sermonData),
    }),
    delete: (id) => apiRequest(`/api/sermons/${id}`, {
      method: 'DELETE',
    }),
  },

  // Events endpoints
  events: {
    getAll: () => apiRequest('/api/events'),
    getById: (id) => apiRequest(`/api/events/${id}`),
    create: (eventData) => apiRequest('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
    update: (id, eventData) => apiRequest(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),
    delete: (id) => apiRequest(`/api/events/${id}`, {
      method: 'DELETE',
    }),
  },

  // Gallery endpoints
  gallery: {
    getAll: () => apiRequest('/api/gallery'),
    getById: (id) => apiRequest(`/api/gallery/${id}`),
    create: (galleryData) => apiRequest('/api/gallery', {
      method: 'POST',
      body: JSON.stringify(galleryData),
    }),
    update: (id, galleryData) => apiRequest(`/api/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(galleryData),
    }),
    delete: (id) => apiRequest(`/api/gallery/${id}`, {
      method: 'DELETE',
    }),
  },

  // Content endpoints
  content: {
    getAll: () => apiRequest('/api/content'),
    getBySection: (section) => apiRequest(`/api/content/${section}`),
    createOrUpdate: (contentData) => apiRequest('/api/content', {
      method: 'POST',
      body: JSON.stringify(contentData),
    }),
    delete: (section) => apiRequest(`/api/content/${section}`, {
      method: 'DELETE',
    }),
  },

  // Contact endpoints
  contact: {
    submit: (contactData) => apiRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    }),
    getAll: () => apiRequest('/api/contact'),
    getById: (id) => apiRequest(`/api/contact/${id}`),
    updateStatus: (id, statusData) => apiRequest(`/api/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    }),
    delete: (id) => apiRequest(`/api/contact/${id}`, {
      method: 'DELETE',
    }),
  },

  // Upload endpoint
  upload: {
    uploadFile: async (formData) => {
      try {
        const user = getUser();
        if (!user || !user.token) {
          throw new Error('Authentication required');
        }

        const uploadUrl = API_BASE_URL ? `${API_BASE_URL}/api/upload` : '/api/upload';
        console.log('Uploading file to:', uploadUrl);

        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData, // Don't stringify FormData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed');
        }

        return response.json();
      } catch (error) {
        console.error('Upload API error:', error);
        throw error;
      }
    },
  },
};

export default api;
