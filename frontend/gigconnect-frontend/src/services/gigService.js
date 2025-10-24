import api from './api';

export const gigService = {
  async createGig(gigData) {
    const response = await api.post('/gigs', gigData);
    return response.data;
  },

  async getGigs(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await api.get(`/gigs?${params}`);
    return response.data;
  },

  async getGigById(id) {
    const response = await api.get(`/gigs/${id}`);
    return response.data;
  },

  async updateGig(id, gigData) {
    const response = await api.put(`/gigs/${id}`, gigData);
    return response.data;
  },

  async deleteGig(id) {
    const response = await api.delete(`/gigs/${id}`);
    return response.data;
  },

  async getMyGigs() {
    const response = await api.get('/gigs/my-gigs');
    return response.data;
  },

  async getGigApplications(gigId) {
    const response = await api.get(`/gigs/${gigId}/applications`);
    return response.data;
  },
};