import axios from 'axios';

// Use relative URL for localhost (proxy), absolute URL for network/mobile access
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL;
  }
  // For network access (mobile), use the server's network IP
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:5000/api`;
  }
  // For localhost, use proxy
  return '/api';
};

const API_URL = getApiUrl();

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Services API
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  addReview: (id, data) => api.post(`/services/${id}/reviews`, data),
};

// Bookings API
export const bookingsAPI = {
  getMyBookings: (type) => api.get('/bookings/my-bookings', { params: { type } }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
};

// Marketplace API
export const marketplaceAPI = {
  getAll: (params) => api.get('/marketplace', { params }),
  getById: (id) => api.get(`/marketplace/${id}`),
  create: (data) => api.post('/marketplace', data),
};

// Rentals API
export const rentalsAPI = {
  getAll: (params) => api.get('/rentals', { params }),
  getById: (id) => api.get(`/rentals/${id}`),
  create: (data) => api.post('/rentals', data),
};

// Rides API
export const ridesAPI = {
  getAll: (params) => api.get('/rides', { params }),
  getById: (id) => api.get(`/rides/${id}`),
  create: (data) => api.post('/rides', data),
  join: (id) => api.post(`/rides/${id}/join`),
};

// Users API
export const usersAPI = {
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Profiles API (College Zone)
export const profilesAPI = {
  getAll: (params) => api.get('/profiles', { params }),
  getById: (id) => api.get(`/profiles/${id}`),
  getMyProfile: () => api.get('/profiles/me/profile'),
  create: (data) => api.post('/profiles', data),
  update: (id, data) => api.put(`/profiles/${id}`, data),
  connect: (id) => api.post(`/profiles/${id}/connect`),
};

export default api;
