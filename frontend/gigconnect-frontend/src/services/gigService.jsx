import api from './api';

export const gigService = {
  // Create gig - matches your backend endpoint
  async createGig(gigData) {
    const response = await api.post('/gigs', gigData);
    return response.data;
  },

  // Get all gigs - matches your backend endpoint
  async getGigs(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await api.get(`/gigs?${params}`);
    return response.data;
  },

  // Get single gig - matches your backend endpoint
  async getGigById(id) {
    const response = await api.get(`/gigs/${id}`);
    return response.data;
  },

  // Update gig - matches your backend endpoint
  async updateGig(id, gigData) {
    const response = await api.put(`/gigs/${id}`, gigData);
    return response.data;
  },

  // Delete gig - matches your backend endpoint
  async deleteGig(id) {
    const response = await api.delete(`/gigs/${id}`);
    return response.data;
  }
};