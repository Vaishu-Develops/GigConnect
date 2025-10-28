import api from './api';

export const chatService = {
  async getUserChats() {
    try {
      console.log('Making request to /messages/chats');
      const response = await api.get('/messages/chats');
      console.log('Raw API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getUserChats:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },

  async getChat(chatId) {
    const response = await api.get(`/messages/chats/${chatId}`);
    return response.data;
  },

  async getMessages(chatId, page = 1, limit = 50) {
    const response = await api.get(`/messages/${chatId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  async sendMessage(messageData) {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  async markMessagesAsRead(messageIds, chatId) {
    const response = await api.put('/messages/mark-read', { messageIds, chatId });
    return response.data;
  },

  async getOnlineUsers() {
    const response = await api.get('/messages/online-users');
    return response.data;
  },

  async createChat(participantId, gigId = null) {
    try {
      console.log('Creating chat with participant:', participantId, 'gig:', gigId);
      const response = await api.post('/messages/chats', { participantId, gigId });
      console.log('Create chat response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in createChat:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },
};