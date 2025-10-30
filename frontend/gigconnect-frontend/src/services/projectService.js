import api from './api';

export const projectService = {
  // Project CRUD
  async createProject(projectData) {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  async getWorkspaceProjects(workspaceId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/projects/workspace/${workspaceId}${queryParams ? `?${queryParams}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  async getProject(projectId) {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  async updateProject(projectId, projectData) {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  },

  async deleteProject(projectId) {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  }
};