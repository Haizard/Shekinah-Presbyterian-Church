// API service for making requests to the backend

// Determine the API base URL based on the environment
let API_BASE_URL;

// Get the current hostname
const hostname = window.location.hostname;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

// Check if we're in production (deployed) or development environment
// Force empty base URL for any non-localhost domain to ensure it works in production
if (!isLocalhost) {
  // Production - since backend and frontend are deployed together on Render,
  // we use a relative URL to the current domain
  API_BASE_URL = '';
  console.log('Production mode: API_BASE_URL set to empty string (relative URLs)');
} else {
  // Development - use localhost with the specific port
  // Try port 5002 since the error logs show connection refused on 5001
  API_BASE_URL = 'http://localhost:5002';
  console.log('Development mode: API_BASE_URL set to:', API_BASE_URL);

  // Set up a function to test the API connection and switch ports if needed
  const testApiConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      if (response.ok) {
        console.log('API connection successful on port 5002');
      } else {
        console.warn('API health check failed on port 5002, will try fallback ports');
        // Try port 5001 as fallback
        try {
          const fallbackResponse = await fetch('http://localhost:5001/api/health');
          if (fallbackResponse.ok) {
            API_BASE_URL = 'http://localhost:5001';
            console.log('Switched to fallback API_BASE_URL:', API_BASE_URL);
          } else {
            // Try port 3001 as second fallback (common Node.js API port)
            const secondFallbackResponse = await fetch('http://localhost:3001/api/health');
            if (secondFallbackResponse.ok) {
              API_BASE_URL = 'http://localhost:3001';
              console.log('Switched to second fallback API_BASE_URL:', API_BASE_URL);
            }
          }
        } catch (fallbackError) {
          console.error('All API connection attempts failed');
        }
      }
    } catch (error) {
      console.warn('API connection test failed, will try fallback ports');
      // Try port 5001 as fallback
      try {
        const fallbackResponse = await fetch('http://localhost:5001/api/health');
        if (fallbackResponse.ok) {
          API_BASE_URL = 'http://localhost:5001';
          console.log('Switched to fallback API_BASE_URL:', API_BASE_URL);
        } else {
          // Try empty base URL as last resort (for same-origin API)
          API_BASE_URL = '';
          console.log('Using empty API_BASE_URL as last resort');
        }
      } catch (fallbackError) {
        // As a last resort, try with empty base URL (same-origin)
        API_BASE_URL = '';
        console.log('All connection attempts failed. Using empty API_BASE_URL as last resort');
      }
    }
  };

  // Run the test immediately
  testApiConnection();
}

// Removed environment logging to prevent browser overload

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
      // Removed console log to prevent browser overload
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
      // Removed console log to prevent browser overload
      return data;
    }
  }

  // Check if we already have an in-flight request for this URL
  if (requestCache.has(cacheKey)) {
    // Removed console log to prevent browser overload
    return requestCache.get(cacheKey);
  }

  // Create a new request promise
  const requestPromise = (async () => {
    try {
      // Removed console log to prevent browser overload

      const response = await fetch(fullUrl, requestOptions);
      // Removed console log to prevent browser overload

      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          // Removed console error to prevent browser overload
          const error = new Error(errorData.message || `Server responded with status: ${response.status}`);

          // Cache the error
          errorCache.set(cacheKey, { error, timestamp: Date.now() });

          throw error;
        } catch (jsonError) {
          // If we can't parse JSON from the error response
          // Removed console error to prevent browser overload
          const error = new Error(`Server responded with status: ${response.status}`);

          // Cache the error
          errorCache.set(cacheKey, { error, timestamp: Date.now() });

          throw error;
        }
      }

      // Parse JSON response
      try {
        const data = await response.json();
        // Removed console log to prevent browser overload

        // Cache the response for GET requests
        if (isGetRequest) {
          responseCache.set(cacheKey, { data, timestamp: Date.now() });
        }

        return data;
      } catch (jsonError) {
        // Removed console error to prevent browser overload
        const error = new Error('Invalid response format from server');

        // Cache the error
        errorCache.set(cacheKey, { error, timestamp: Date.now() });

        throw error;
      }
    } catch (error) {
      // Removed console errors to prevent browser overload

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
    getAll: () => {
      console.log('API: Getting all content');
      return apiRequest('/api/content');
    },
    getBySection: async (section) => {
      console.log(`API: Getting content for section "${section}"`);
      try {
        // Use a custom implementation to handle 404 errors silently
        const fullUrl = API_BASE_URL ? `${API_BASE_URL}/api/content/${section}` : `/api/content/${section}`;
        console.log(`API: Full URL for section "${section}": ${fullUrl}`);

        // Check if we have a cached response
        const cacheKey = `GET:${fullUrl}:`;
        if (responseCache.has(cacheKey)) {
          const { data, timestamp } = responseCache.get(cacheKey);
          const age = Date.now() - timestamp;

          // If the cache is still fresh, return the cached data
          if (age < CACHE_TTL) {
            console.log(`API: Returning cached data for section "${section}"`);
            return data;
          }
        }

        // Make the request
        console.log(`API: Making fetch request for section "${section}"`);
        const response = await fetch(fullUrl, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log(`API: Response status for section "${section}": ${response.status}`);

        // If it's a 404, return null instead of throwing an error
        if (response.status === 404) {
          console.log(`API: Section "${section}" not found (404)`);
          return null;
        }

        // For other errors, handle normally
        if (!response.ok) {
          console.error(`API: Error fetching section "${section}": ${response.status}`);
          throw new Error(`Server responded with status: ${response.status}`);
        }

        // Parse the response
        const data = await response.json();
        console.log(`API: Successfully fetched data for section "${section}":`, data);

        // Cache the response
        responseCache.set(cacheKey, { data, timestamp: Date.now() });

        return data;
      } catch (error) {
        // Log the error but return null
        console.error(`API: Error in getBySection for "${section}":`, error);
        return null;
      }
    },
    createOrUpdate: (contentData) => {
      console.log('API: Creating or updating content:', contentData);
      return apiRequest('/api/content', {
        method: 'POST',
        body: JSON.stringify(contentData),
      });
    },
    delete: (section) => {
      console.log(`API: Deleting content section "${section}"`);
      return apiRequest(`/api/content/${section}`, {
        method: 'DELETE',
      });
    },
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

  // Branch endpoints
  branches: {
    getAll: () => apiRequest('/api/branches'),
    getById: (id) => apiRequest(`/api/branches/${id}`),
    create: (branchData) => apiRequest('/api/branches', {
      method: 'POST',
      body: JSON.stringify(branchData),
    }),
    update: (id, branchData) => apiRequest(`/api/branches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(branchData),
    }),
    delete: (id) => apiRequest(`/api/branches/${id}`, {
      method: 'DELETE',
    }),
  },

  // Finance endpoints
  finances: {
    getAll: () => apiRequest('/api/finances'),
    getSummary: () => apiRequest('/api/finances/summary'),
    getByBranch: (branchId) => apiRequest(`/api/finances/branch/${branchId}`),
    getById: (id) => apiRequest(`/api/finances/${id}`),
    create: (financeData) => apiRequest('/api/finances', {
      method: 'POST',
      body: JSON.stringify(financeData),
    }),
    update: (id, financeData) => apiRequest(`/api/finances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(financeData),
    }),
    delete: (id) => apiRequest(`/api/finances/${id}`, {
      method: 'DELETE',
    }),
  },

  // Budget endpoints
  budgets: {
    getAll: () => apiRequest('/api/budgets'),
    getByYearAndBranch: (year, branchId) => apiRequest(`/api/budgets/year/${year}/branch/${branchId || 'null'}`),
    getById: (id) => apiRequest(`/api/budgets/${id}`),
    create: (budgetData) => apiRequest('/api/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    }),
    update: (id, budgetData) => apiRequest(`/api/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budgetData),
    }),
    delete: (id) => apiRequest(`/api/budgets/${id}`, {
      method: 'DELETE',
    }),
    updateActuals: (year, branchId) => apiRequest(`/api/budgets/update-actuals/${year}/${branchId || 'null'}`),
  },

  // Member endpoints
  members: {
    getAll: () => apiRequest('/api/members'),
    getStats: () => apiRequest('/api/members/stats'),
    getByBranch: (branchId) => apiRequest(`/api/members/branch/${branchId}`),
    getById: (id) => apiRequest(`/api/members/${id}`),
    create: (memberData) => apiRequest('/api/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    }),
    update: (id, memberData) => apiRequest(`/api/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    }),
    delete: (id) => apiRequest(`/api/members/${id}`, {
      method: 'DELETE',
    }),
  },

  // Group endpoints
  groups: {
    getAll: () => apiRequest('/api/groups'),
    getByBranch: (branchId) => apiRequest(`/api/groups/branch/${branchId}`),
    getById: (id) => apiRequest(`/api/groups/${id}`),
    create: (groupData) => apiRequest('/api/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    }),
    update: (id, groupData) => apiRequest(`/api/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(groupData),
    }),
    delete: (id) => apiRequest(`/api/groups/${id}`, {
      method: 'DELETE',
    }),
    getMembers: (id) => apiRequest(`/api/groups/${id}/members`),
    addMember: (id, memberData) => apiRequest(`/api/groups/${id}/members`, {
      method: 'POST',
      body: JSON.stringify(memberData),
    }),
    updateMember: (id, memberData) => apiRequest(`/api/groups/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    }),
    removeMember: (id) => apiRequest(`/api/groups/members/${id}`, {
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
        // Removed console log to prevent browser overload

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
        console.error('Upload failed:', error.message);
        throw new Error(`Upload failed: ${error.message}`);
      }
    },
  },



  // Image verification endpoints
  imageVerify: {
    verifyImage: async (imagePath) => {
      try {
        const user = getUser();
        if (!user || !user.token) {
          throw new Error('Authentication required');
        }

        const verifyUrl = API_BASE_URL
          ? `${API_BASE_URL}/api/image-verify/verify?path=${encodeURIComponent(imagePath)}`
          : `/api/image-verify/verify?path=${encodeURIComponent(imagePath)}`;

        const response = await fetch(verifyUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Image verification failed');
        }

        return response.json();
      } catch (error) {
        console.error('Image verification failed:', error.message);
        throw new Error(`Image verification failed: ${error.message}`);
      }
    },

    listUploads: async () => {
      try {
        const user = getUser();
        if (!user || !user.token) {
          throw new Error('Authentication required');
        }

        const listUrl = API_BASE_URL
          ? `${API_BASE_URL}/api/image-verify/list-uploads`
          : `/api/image-verify/list-uploads`;

        const response = await fetch(listUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to list uploads');
        }

        return response.json();
      } catch (error) {
        console.error('Failed to list uploads:', error.message);
        throw new Error(`Failed to list uploads: ${error.message}`);
      }
    },
  },

  // Payment Configuration endpoints
  paymentConfig: {
    getAll: () => apiRequest('/api/payment-config'),
    getActive: () => apiRequest('/api/payment-config/active'),
    getById: (id) => apiRequest(`/api/payment-config/${id}`),
    getByType: (gatewayType) => apiRequest(`/api/payment-config/type/${gatewayType}`),
    create: (configData) => apiRequest('/api/payment-config', {
      method: 'POST',
      body: JSON.stringify(configData),
    }),
    update: (id, configData) => apiRequest(`/api/payment-config/${id}`, {
      method: 'PUT',
      body: JSON.stringify(configData),
    }),
    delete: (id) => apiRequest(`/api/payment-config/${id}`, {
      method: 'DELETE',
    }),
  },

  // Donation endpoints
  donations: {
    getAll: () => apiRequest('/api/donations'),
    getStats: () => apiRequest('/api/donations/stats'),
    getByStatus: (status) => apiRequest(`/api/donations/status/${status}`),
    getByBranch: (branchId) => apiRequest(`/api/donations/branch/${branchId}`),
    getById: (id) => apiRequest(`/api/donations/${id}`),
    create: (donationData) => apiRequest('/api/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    }),
    update: (id, donationData) => apiRequest(`/api/donations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(donationData),
    }),
    updateStatus: (id, statusData) => apiRequest(`/api/donations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    }),
    delete: (id) => apiRequest(`/api/donations/${id}`, {
      method: 'DELETE',
    }),
  },

  // Payment endpoints
  payments: {
    processMpesa: (paymentData) => apiRequest('/api/payments/mpesa', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),
    processTigoPesa: (paymentData) => apiRequest('/api/payments/tigopesa', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),
    processAirtelMoney: (paymentData) => apiRequest('/api/payments/airtel', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),
    verifyPayment: (method, id) => apiRequest(`/api/payments/verify/${method}/${id}`),
    getBankDetails: () => apiRequest('/api/payments/bank-details'),
  },
};

export default api;
