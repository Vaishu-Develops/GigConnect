import React from 'react';
import { MessageCircle, Clock } from 'lucide-react';

const ChatList = ({ chats, activeChat, onSelectChat }) => {
  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      </div>

      {/* Chat List */}
      <div className="divide-y divide-gray-100">
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              activeChat?._id === chat._id ? 'bg-secondary/5 border-r-2 border-secondary' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {chat.participant?.name?.charAt(0).toUpperCase() || 'U'}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {chat.participant?.name || 'Unknown User'}
                  </h3>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {chat.lastMessageTime}
                  </span>
                </div>
                <p className="text-gray-600 text-sm truncate">
                  {chat.lastMessage || 'No messages yet'}
                </p>
              </div>

              {/* Unread indicator */}
              {chat.unreadCount > 0 && (
                <div className="bg-brand-highlight text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          </div>
        ))}

        {chats.length === 0 && (
          <div className="p-8 text-center">
            <MessageCircle className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-500 text-sm">No conversations yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;