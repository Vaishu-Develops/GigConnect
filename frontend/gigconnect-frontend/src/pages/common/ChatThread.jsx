import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/chatService';
import ChatBox from '../../components/chat/ChatBox';
import ChatHeader from '../../components/chat/ChatHeader';
import { LoadingSpinner } from '../../components/ui/Loader';

const ChatThread = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (chatId) {
      fetchChatData();
    }
  }, [chatId]);

  const fetchChatData = async () => {
    try {
      const [chatData, messagesData] = await Promise.all([
        chatService.getChat(chatId),
        chatService.getMessages(chatId)
      ]);
      
      setChat(chatData);
      setMessages(messagesData.messages || []);
    } catch (error) {
      console.error('Failed to fetch chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    setSending(true);
    try {
      const newMessage = await chatService.sendMessage({
        chatId,
        content,
        messageType: 'text'
      });
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chat not found
          </h3>
          <p className="text-gray-600">
            The conversation you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Get the other user in the chat
  const otherUser = chat.participants?.find(p => p._id !== user._id) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-100px)] flex flex-col">
        {/* Chat Header */}
        <ChatHeader 
          user={otherUser}
          isOnline={otherUser.isOnline}
        />

        {/* Chat Messages */}
        <div className="flex-1">
          <ChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={sending}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatThread;