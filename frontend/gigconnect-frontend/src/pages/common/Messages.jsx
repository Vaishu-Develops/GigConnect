import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/chatService';
import ChatList from '../../components/chat/ChatList';
import ChatThread from './ChatThread';
import Input from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/Loader';

const Messages = () => {
  const { user } = useAuth();
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const fetchingRef = useRef(false);

  useEffect(() => {
    if (!fetchingRef.current) {
      fetchChats();
    }
    
    // Handle new chat creation from URL params
    const newUserId = searchParams.get('userId');
    if (newUserId && newUserId !== user?.id) {
      handleCreateNewChat(newUserId);
    }
  }, [searchParams]);

  const handleCreateNewChat = async (targetUserId) => {
    try {
      // Check if chat already exists
      const existingChat = chats.find(chat => 
        chat.participants?.some(p => p._id === targetUserId)
      );
      
      if (existingChat) {
        navigate(`/messages/${existingChat.chatId}`);
        return;
      }

      // Create new chat
      const response = await chatService.createChat(targetUserId);
      
      if (response.success && response.chat) {
        // Refresh chats and navigate to new chat
        await fetchChats();
        navigate(`/messages/${response.chat._id}`);
      }
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    if (fetchingRef.current) return;
    
    try {
      fetchingRef.current = true;
      console.log('Fetching user chats...');
      setLoading(true);
      const response = await chatService.getUserChats();
      console.log('Chats response:', response);
      
      if (response && response.success && Array.isArray(response.chats)) {
        // Remove duplicates based on chatId
        const uniqueChats = response.chats.filter((chat, index, self) => 
          index === self.findIndex(c => c.chatId === chat.chatId)
        );
        setChats(uniqueChats);
        console.log('Successfully loaded chats:', uniqueChats.length);
      } else if (Array.isArray(response)) {
        // Handle direct array response
        setChats(response);
        console.log('Successfully loaded chats (direct array):', response.length);
      } else {
        console.error('Invalid chats response structure:', response);
        setChats([]);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setChats([]);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  const handleChatSelect = (selectedChatId) => {
    navigate(`/messages/${selectedChatId}`);
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
                  <div className="flex flex-col justify-center items-center h-32 text-gray-600">
                    <LoadingSpinner />
                    <p className="mt-2 text-sm">Loading conversations...</p>
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">💬</div>
                    <p>No conversations yet</p>
                    <p className="text-sm">Start chatting with users!</p>
                  </div>
                ) : (
                  <div className="space-y-3 p-4">
                    {filteredChats.map((chat) => (
                      <div
                        key={chat.chatId}
                        onClick={() => handleChatSelect(chat.chatId)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          chatId === chat.chatId 
                            ? 'bg-emerald-50 border border-emerald-200' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {chat.otherUser?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="font-medium text-gray-900 truncate">
                                {chat.otherUser?.name || 'Unknown User'}
                              </p>
                              <span className="text-xs text-gray-500">
                                {new Date(chat.lastMessage?.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {chat.lastMessage?.content || 'No messages yet'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 h-[calc(100vh-200px)]">
            {chatId && chatId !== 'new' && chatId !== 'undefined' ? (
              <ChatThread />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex items-center justify-center">
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