import React from 'react';
import { Link, useParams } from 'react-router-dom';

const ChatList = ({ chats = [], loading = false }) => {
  const { chatId } = useParams();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getOtherUser = (chat) => {
    // This would typically come from the backend
    return chat.otherUser || { name: 'Unknown User', avatar: null };
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 animate-pulse">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-3">💬</div>
        <p>No conversations yet</p>
        <p className="text-sm">Start chatting with users!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {chats.map((chat) => {
        const otherUser = getOtherUser(chat);
        const isActive = chatId === chat._id;

        return (
          <Link
            key={chat._id}
            to={`/messages/${chat._id}`}
            className={`
              flex items-center space-x-3 p-4 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-emerald-50 border-r-2 border-emerald-600' 
                : 'hover:bg-gray-50'
              }
            `}
          >
            <img
              src={otherUser.avatar || '/robot.png'}
              alt={otherUser.name}
              className="w-12 h-12 rounded-full"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-gray-900 truncate">
                  {otherUser.name}
                </h4>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {formatTime(chat.lastMessage?.createdAt || chat.updatedAt)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 truncate">
                {chat.lastMessage?.content || 'No messages yet'}
              </p>
            </div>

            {chat.unreadCount > 0 && (
              <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chat.unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default ChatList;