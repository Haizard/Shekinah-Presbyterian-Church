// API service for making requests to the backend

// Always use the explicit backend URL for development
const API_BASE_URL = 'http://localhost:5002';

console.log('API Base URL:', API_BASE_URL);

// Get the user from localStorage
const getUser = () => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};

// Base API request function
const apiRequest = async (url, options = {}) => {
  // Get the user token if available
  const user = getUser();

  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization header if user is logged in
  if (user && user.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }

  // Merge options
  const requestOptions = {
    ...options,
    headers,
  };

  // Prepend the API base URL to the provided URL
  const fullUrl = `${API_BASE_URL}${url}`;

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
        throw new Error(errorData.message || `Server responded with status: ${response.status}`);
      } catch (jsonError) {
        // If we can't parse JSON from the error response
        console.error(`API Error (${fullUrl}): Could not parse error response`, jsonError);
        throw new Error(`Server responded with status: ${response.status}`);
      }
    }

    // Parse JSON response
    try {
      const data = await response.json();
      console.log('API Response data:', data);
      return data;
    } catch (jsonError) {
      console.error(`API Error (${fullUrl}): Could not parse JSON response`, jsonError);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error(`API Error (${fullUrl}):`, error);
    console.error('Request options:', JSON.stringify(requestOptions, null, 2));
    throw error;
  }
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

        console.log('Uploading file to:', `${API_BASE_URL}/api/upload`);

        const response = await fetch(`${API_BASE_URL}/api/upload`, {
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
