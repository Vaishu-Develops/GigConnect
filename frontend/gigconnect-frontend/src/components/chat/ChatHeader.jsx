import React from 'react';

const ChatHeader = ({ user, isOnline = false }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={user?.avatar || '/default-avatar.png'}
            alt={user?.name}
            className="w-12 h-12 rounded-full"
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{user?.name}</h3>
          <p className="text-sm text-gray-600">
            {isOnline ? 'Online' : 'Last seen recently'}
          </p>
        </div>

        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            📞
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            ⚙️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;