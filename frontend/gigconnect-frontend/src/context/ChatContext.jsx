import React, { createContext, useState, useContext, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's chats
  const fetchChats = async () => {
    setLoading(true);
    try {
      const chatsData = await chatService.getUserChats();
      setChats(chatsData);
      return chatsData;
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific chat
  const fetchMessages = async (chatId) => {
    setLoading(true);
    try {
      const messagesData = await chatService.getMessages(chatId);
      setMessages(messagesData.messages || []);
      return messagesData;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (messageData) => {
    try {
      const newMessage = await chatService.sendMessage(messageData);
      setMessages(prev => [...prev, newMessage]);
      
      // Update chat list with latest message
      setChats(prev => prev.map(chat => 
        chat._id === messageData.chatId 
          ? { ...chat, lastMessage: newMessage, updatedAt: new Date().toISOString() }
          : chat
      ));
      
      return newMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (messageIds, chatId) => {
    try {
      await chatService.markMessagesAsRead(messageIds, chatId);
      setMessages(prev => prev.map(msg => 
        messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg
      ));
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  // Get online users
  const fetchOnlineUsers = async () => {
    try {
      const onlineUsersData = await chatService.getOnlineUsers();
      setOnlineUsers(onlineUsersData);
    } catch (error) {
      console.error('Failed to fetch online users:', error);
    }
  };

  // Initialize socket connection (would be implemented with socket.io)
  useEffect(() => {
    if (user) {
      // Initialize socket connection here
      // socket = io(process.env.REACT_APP_SOCKET_URL);
      
      // Set up event listeners for real-time updates
      // socket.on('newMessage', handleNewMessage);
      // socket.on('userOnline', handleUserOnline);
      // socket.on('userOffline', handleUserOffline);
      
      return () => {
        // Clean up socket connection
        // socket.disconnect();
      };
    }
  }, [user]);

  const value = {
    chats,
    currentChat,
    messages,
    onlineUsers,
    loading,
    fetchChats,
    fetchMessages,
    sendMessage,
    markMessagesAsRead,
    fetchOnlineUsers,
    setCurrentChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};