import api from './api';

export const authService = {
  // Register user - matches your backend endpoint
  async register(userData) {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Login user - matches your backend endpoint  
  async login(credentials) {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  // Get user profile - matches your backend endpoint
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update profile - matches your backend endpoint
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  }
};