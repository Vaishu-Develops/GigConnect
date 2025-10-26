import api from './api';

export const userService = {
  async getUsers(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await api.get(`/users?${params}`);
    return response.data;
  },

  async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async addPortfolioItem(portfolioItem) {
    const response = await api.post('/users/portfolio', portfolioItem);
    return response.data;
  },

  async deletePortfolioItem(itemId) {
    const response = await api.delete(`/users/portfolio/${itemId}`);
    return response.data;
  },

  async getFreelancers(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/users/freelancers?${params}`);
    return response.data;
  },

  async getClients(filters = {}) {
    const params = new URLSearchParams({ role: 'client', ...filters });
    const response = await api.get(`/users?${params}`);
    return response.data;
  },

  async updateUserStatus(userId, status) {
    const response = await api.put(`/users/${userId}/status`, { status });
    return response.data;
  },

  async getUserStats(userId) {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  }
};