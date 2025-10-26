import api from './api';

export const portfolioService = {
  // Get user's portfolio
  async getUserPortfolio(userId) {
    const response = await api.get(`/portfolio/user/${userId}`);
    return response.data;
  },

  // Get my portfolio
  async getMyPortfolio() {
    const response = await api.get('/portfolio/my');
    return response.data;
  },

  // Create portfolio item
  async createPortfolioItem(portfolioData) {
    const response = await api.post('/portfolio', portfolioData);
    return response.data;
  },

  // Update portfolio item
  async updatePortfolioItem(id, portfolioData) {
    const response = await api.put(`/portfolio/${id}`, portfolioData);
    return response.data;
  },

  // Delete portfolio item
  async deletePortfolioItem(id) {
    const response = await api.delete(`/portfolio/${id}`);
    return response.data;
  },

  // Toggle featured status
  async toggleFeatured(id) {
    const response = await api.patch(`/portfolio/${id}/featured`);
    return response.data;
  }
};