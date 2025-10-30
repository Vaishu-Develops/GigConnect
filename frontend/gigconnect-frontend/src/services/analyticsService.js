import api from './api';

// Get workspace analytics
export const getWorkspaceAnalytics = async (workspaceId) => {
  try {
    const response = await api.get(`/analytics/workspaces/${workspaceId}/analytics`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch analytics' };
  }
};

// Get member analytics
export const getMemberAnalytics = async (workspaceId) => {
  try {
    const response = await api.get(`/analytics/workspaces/${workspaceId}/analytics/members`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch member analytics' };
  }
};

const analyticsService = {
  getWorkspaceAnalytics,
  getMemberAnalytics
};

export default analyticsService;