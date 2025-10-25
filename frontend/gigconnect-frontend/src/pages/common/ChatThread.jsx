import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    console.log('ChatThread chatId:', chatId);
    if (chatId && chatId !== 'undefined' && chatId !== 'new') {
      fetchChatData();
    } else {
      console.error('Invalid chatId:', chatId);
      setLoading(false);
    }
  }, [chatId]);

  const fetchChatData = async () => {
    try {
      console.log('Fetching chat data for chatId:', chatId);
      const [chatResponse, messagesResponse] = await Promise.all([
        chatService.getChat(chatId),
        chatService.getMessages(chatId)
      ]);
      
      console.log('ChatThread - Chat response:', chatResponse);
      console.log('ChatThread - Messages response:', messagesResponse);
      
      if (chatResponse.success) {
        setChat(chatResponse.chat);
        console.log('ChatThread - Set chat with otherUser:', chatResponse.chat.otherUser);
      }
      
      if (messagesResponse.success) {
        setMessages(messagesResponse.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    setSending(true);
    try {
      console.log('Sending message:', { chatId, content });
      const response = await chatService.sendMessage({
        chatId,
        content,
        messageType: 'text'
      });
      
      console.log('Message sent response:', response);
      
      if (response.success && response.message) {
        setMessages(prev => [...prev, response.message]);
      } else {
        console.error('Invalid response:', response);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-200px)] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!chat && (chatId === 'new' || chatId === 'undefined' || !chatId)) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Invalid Chat
          </h3>
          <Link to="/messages" className="text-emerald-600 hover:text-emerald-700">
            Go back to messages
          </Link>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chat not found
          </h3>
          <p className="text-gray-600 mb-4">
            The conversation you're looking for doesn't exist.
          </p>
          <Link to="/messages" className="text-emerald-600 hover:text-emerald-700">
            Go back to messages
          </Link>
        </div>
      </div>
    );
  }

  // Get the other user in the chat from the backend response
  const otherUser = chat.otherUser || chat.participants?.find(p => p._id !== user._id) || { name: 'Unknown User' };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Chat Header */}
      <div className="flex-shrink-0">
        <ChatHeader 
          user={otherUser}
          isOnline={false}
        />
      </div>

      {/* Chat Messages - Scrollable Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
          loading={sending}
        />
      </div>
    </div>
  );
};

export default ChatThread;