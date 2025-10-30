import api from './api';

export const workspaceService = {
  // Workspace CRUD
  async createWorkspace(workspaceData) {
    const response = await api.post('/workspaces', workspaceData);
    return response.data;
  },

  async getUserWorkspaces() {
    const response = await api.get('/workspaces');
    return response.data;
  },

  async getWorkspace(workspaceId) {
    const response = await api.get(`/workspaces/${workspaceId}`);
    return response.data;
  },

  async updateWorkspace(workspaceId, workspaceData) {
    const response = await api.put(`/workspaces/${workspaceId}`, workspaceData);
    return response.data;
  },

  async deleteWorkspace(workspaceId) {
    const response = await api.delete(`/workspaces/${workspaceId}`);
    return response.data;
  },

  // Member management
  async inviteMember(workspaceId, invitationData) {
    const response = await api.post(`/workspaces/${workspaceId}/invite`, invitationData);
    return response.data;
  },

  async acceptInvitation(token) {
    const response = await api.post(`/workspaces/invitations/${token}/accept`);
    return response.data;
  },

  async getUserInvitations() {
    const response = await api.get('/workspaces/invitations');
    return response.data;
  },

  async cancelInvitation(workspaceId, email) {
    const response = await api.delete(`/workspaces/${workspaceId}/invite/${encodeURIComponent(email)}`);
    return response.data;
  },

  // Statistics
  async getWorkspaceStats(workspaceId) {
    const response = await api.get(`/workspaces/${workspaceId}/stats`);
    return response.data;
  },

  // Member management
  async updateMemberRole(workspaceId, memberId, role) {
    const response = await api.put(`/workspaces/${workspaceId}/members/${memberId}`, { role });
    return response.data;
  },

  async removeMember(workspaceId, memberId) {
    const response = await api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
    return response.data;
  }
};