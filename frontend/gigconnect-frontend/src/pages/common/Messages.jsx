import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/chatService';
import ChatList from '../../components/chat/ChatList';
import Input from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/Loader';

const Messages = () => {
  const { user } = useAuth();
  const { chatId } = useParams();
  
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const chatsData = await chatService.getUserChats();
      setChats(chatsData);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(chat => {
    const otherUser = chat.otherUser || {};
    return otherUser.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Chat List Sidebar */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Messages
                </h1>
                
                {/* Search */}
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Chat List */}
              <div className="h-[calc(100vh-200px)] overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <ChatList chats={filteredChats} />
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1">
            {chatId ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-200px)]">
                {/* This would be replaced by ChatThread component */}
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No conversation selected
                  </h3>
                  <p>Choose a conversation from the list to start messaging</p>
                  
                  {chats.length === 0 && !loading && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-4">
                        You don't have any conversations yet
                      </p>
                      <Link
                        to="/explore"
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Find Gigs to Message
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;