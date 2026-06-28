import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Auto-detect production hostname and fallback to Render API
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return 'https://resumify-6uio.onrender.com/api';
  }
  return 'http://127.0.0.1:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Automatically inject JWT token into header if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('resumify_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
