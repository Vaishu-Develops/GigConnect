import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(process.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token
      },
      transports: ['websocket']
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.emitToListeners('connect');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.emitToListeners('disconnect');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emitToListeners('error', error);
    });

    // Message events
    this.socket.on('new_message', (message) => {
      this.emitToListeners('new_message', message);
    });

    this.socket.on('message_read', (data) => {
      this.emitToListeners('message_read', data);
    });

    this.socket.on('typing_start', (data) => {
      this.emitToListeners('typing_start', data);
    });

    this.socket.on('typing_stop', (data) => {
      this.emitToListeners('typing_stop', data);
    });

    // Notification events
    this.socket.on('new_notification', (notification) => {
      this.emitToListeners('new_notification', notification);
    });

    // User events
    this.socket.on('user_online', (user) => {
      this.emitToListeners('user_online', user);
    });

    this.socket.on('user_offline', (user) => {
      this.emitToListeners('user_offline', user);
    });

    // Gig events
    this.socket.on('gig_updated', (gig) => {
      this.emitToListeners('gig_updated', gig);
    });

    this.socket.on('new_application', (application) => {
      this.emitToListeners('new_application', application);
    });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emitToListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for event ${event}:`, error);
        }
      });
    }
  }

  // Emit methods for client events
  joinChat(chatId) {
    this.emit('join_chat', { chatId });
  }

  leaveChat(chatId) {
    this.emit('leave_chat', { chatId });
  }

  startTyping(chatId) {
    this.emit('typing_start', { chatId });
  }

  stopTyping(chatId) {
    this.emit('typing_stop', { chatId });
  }

  markMessagesRead(messageIds, chatId) {
    this.emit('mark_read', { messageIds, chatId });
  }

  // Generic emit method
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Connection status
  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();