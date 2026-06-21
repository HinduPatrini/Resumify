import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('resumify_token') || null,
  loading: true,

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // Server returns flat object: { _id, name, email, token }
      const { token, ...user } = response.data;
      localStorage.setItem('resumify_token', token);
      set({ token, user, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      // Server returns flat object: { _id, name, email, token }
      const { token, ...user } = response.data;
      localStorage.setItem('resumify_token', token);
      set({ token, user, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('resumify_token');
    set({ token: null, user: null, loading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('resumify_token');
    if (!token) {
      set({ user: null, token: null, loading: false });
      return;
    }
    try {
      const response = await api.get('/auth/me');
      // /auth/me returns the user object directly (no token)
      set({ user: response.data, token, loading: false });
    } catch (error) {
      console.error('Session restore failed:', error);
      localStorage.removeItem('resumify_token');
      set({ user: null, token: null, loading: false });
    }
  },
}));
