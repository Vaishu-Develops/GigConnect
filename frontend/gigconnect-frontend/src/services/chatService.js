import api from './api';

export const chatService = {
  async getUserChats() {
    const response = await api.get('/messages/chats');
    return response.data;
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
    const response = await api.post('/messages/chats', { participantId, gigId });
    return response.data;
  },
};