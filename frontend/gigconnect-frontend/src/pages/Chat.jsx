import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { Send, Paperclip, Smile } from 'lucide-react';
import ChatList from '../components/chat/ChatList';
import MessageBubble from '../components/chat/MessageBubble';

const Chat = () => {
  const { chats, activeChat, messages, setActiveChat, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    setLoading(true);
    await sendMessage(activeChat._id, newMessage.trim());
    setNewMessage('');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Chat List Sidebar */}
      <ChatList 
        chats={chats} 
        activeChat={activeChat}
        onSelectChat={setActiveChat}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                  {activeChat.participant?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {activeChat.participant?.name}
                  </h2>
                  <p className="text-sm text-green-600">Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message._id}
                  message={message}
                  isOwn={message.sender === 'current-user-id'} // Replace with actual user ID check
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="p-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Paperclip size={20} />
                  </button>
                  <button
                    type="button"
                    className="p-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Smile size={20} />
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || loading}
                    className="p-3 bg-secondary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <Send size={64} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;