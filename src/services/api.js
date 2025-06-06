// API service for making requests to the backend

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

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${url}):`, error);
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
    uploadFile: (formData) => {
      const user = getUser();
      return fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData, // Don't stringify FormData
      }).then(response => response.json());
    },
  },
};

export default api;
