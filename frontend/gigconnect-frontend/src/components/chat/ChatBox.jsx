import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import MessageBubble from './MessageBubble';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ChatBox = ({ messages = [], onSendMessage, loading = false }) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive, but allow manual scrolling
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      // Check if user was already at the bottom before scrolling
      const container = messagesContainerRef.current;
      if (container) {
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
        
        // Only auto-scroll if user was already at the bottom or it's the first message
        if (isAtBottom || messages.length === 1) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [messages.length]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container - Scrollable */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scroll-smooth"
        style={{ 
          maxHeight: 'calc(100vh - 300px)', 
          scrollBehavior: 'smooth',
          overflowAnchor: 'none' // Prevents jumping when new messages are added
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={`${message._id}-${index}`}
                message={message}
                isOwn={message.sender?._id === user._id}
              />
            ))}
            {/* Scroll anchor */}
            <div ref={messagesEndRef} style={{ height: '1px' }} />
          </>
        )}
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            disabled={!newMessage.trim() || loading}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;