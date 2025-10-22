import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  // Mock data for development
  useEffect(() => {
    if (user) {
      // Simulate loading chats
      const mockChats = [
        {
          _id: '1',
          participant: { name: 'John Client', _id: 'client1' },
          lastMessage: 'Hello, I need your help with my project',
          lastMessageTime: '2:30 PM',
          unreadCount: 2
        },
        {
          _id: '2',
          participant: { name: 'Sarah Designer', _id: 'freelancer1' },
          lastMessage: 'I have completed the design mockups',
          lastMessageTime: '10:15 AM',
          unreadCount: 0
        }
      ];
      setChats(mockChats);
    }
  }, [user]);

  const sendMessage = async (chatId, content) => {
    // In a real app, this would send to your backend
    const newMessage = {
      _id: Date.now().toString(),
      content,
      sender: user._id,
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Update last message in chats
    setChats(prev => prev.map(chat => 
      chat._id === chatId 
        ? { ...chat, lastMessage: content, lastMessageTime: 'Just now' }
        : chat
    ));

    return { success: true };
  };

  const value = {
    chats,
    activeChat,
    messages,
    onlineUsers,
    setActiveChat,
    sendMessage,
    setMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};