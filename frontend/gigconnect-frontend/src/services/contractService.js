import api from './api';

export const contractService = {
  // Create a new direct hire contract
  createContract: async (contractData) => {
    try {
      const response = await api.post('/contracts', contractData);
      return response.data;
    } catch (error) {
      console.error('Contract creation failed:', error);
      throw error.response?.data || error;
    }
  },

  // Get user's contracts
  getContracts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      
      const response = await api.get(`/contracts?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      throw error.response?.data || error;
    }
  },

  // Get single contract
  getContract: async (contractId) => {
    try {
      const response = await api.get(`/contracts/${contractId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch contract:', error);
      throw error.response?.data || error;
    }
  },

  // Accept contract (freelancer only)
  acceptContract: async (contractId) => {
    try {
      const response = await api.put(`/contracts/${contractId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Failed to accept contract:', error);
      throw error.response?.data || error;
    }
  },

  // Decline contract (freelancer only)
  declineContract: async (contractId, reason = '') => {
    try {
      const response = await api.put(`/contracts/${contractId}/decline`, { reason });
      return response.data;
    } catch (error) {
      console.error('Failed to decline contract:', error);
      throw error.response?.data || error;
    }
  },

  // Update contract status
  updateContractStatus: async (contractId, status) => {
    try {
      const response = await api.put(`/contracts/${contractId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Failed to update contract status:', error);
      throw error.response?.data || error;
    }
  }
};