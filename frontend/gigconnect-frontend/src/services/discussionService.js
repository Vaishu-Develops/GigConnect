import api from './api.js';

// Create new discussion
export const createDiscussion = async (discussionData) => {
  try {
    const response = await api.post('/discussions', discussionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create discussion' };
  }
};

// Get discussions for workspace
export const getWorkspaceDiscussions = async (workspaceId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = `/discussions/workspace/${workspaceId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch discussions' };
  }
};

// Get specific discussion
export const getDiscussion = async (discussionId) => {
  try {
    const response = await api.get(`/discussions/${discussionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch discussion' };
  }
};

// Update discussion
export const updateDiscussion = async (discussionId, updateData) => {
  try {
    const response = await api.put(`/discussions/${discussionId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update discussion' };
  }
};

// Delete discussion
export const deleteDiscussion = async (discussionId) => {
  try {
    const response = await api.delete(`/discussions/${discussionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete discussion' };
  }
};

// Add message to discussion
export const addMessage = async (discussionId, messageData) => {
  try {
    const response = await api.post(`/discussions/${discussionId}/messages`, messageData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add message' };
  }
};

// Join discussion
export const joinDiscussion = async (discussionId) => {
  try {
    const response = await api.post(`/discussions/${discussionId}/join`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to join discussion' };
  }
};

// Toggle message reaction
export const toggleReaction = async (discussionId, messageId, emoji) => {
  try {
    const response = await api.post(`/discussions/${discussionId}/messages/${messageId}/reaction`, { emoji });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to toggle reaction' };
  }
};

// Pin/Unpin discussion
export const togglePin = async (discussionId, pinned) => {
  try {
    const response = await api.put(`/discussions/${discussionId}`, { pinned });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to toggle pin' };
  }
};

// Mark discussion as resolved/open
export const updateStatus = async (discussionId, status) => {
  try {
    const response = await api.put(`/discussions/${discussionId}`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update status' };
  }
};