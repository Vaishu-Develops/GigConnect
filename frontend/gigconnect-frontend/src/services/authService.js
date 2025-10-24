import api from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/users/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, newPassword) {
    const response = await api.post('/users/reset-password', { token, newPassword });
    return response.data;
  },
};