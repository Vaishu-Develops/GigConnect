import React, { useState } from 'react';

const ChatHeader = ({ user, isOnline = false }) => {
  console.log('ChatHeader user data:', user);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  
  const handleSettingsClick = () => {
    setShowSettingsDropdown(!showSettingsDropdown);
  };

  const handleClearChat = () => {
    // TODO: Implement clear chat functionality
    console.log('Clear chat clicked');
    setShowSettingsDropdown(false);
  };

  const handleBlockUser = () => {
    // TODO: Implement block user functionality
    console.log('Block user clicked');
    setShowSettingsDropdown(false);
  };

  const handleReportUser = () => {
    // TODO: Implement report user functionality
    console.log('Report user clicked');
    setShowSettingsDropdown(false);
  };
  
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <div className="relative">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name || 'User'}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{user?.name || 'Unknown User'}</h3>
          <p className="text-sm text-gray-600">
            {isOnline ? 'Online' : 'Last seen recently'}
          </p>
        </div>

        <div className="relative">
          <button 
            onClick={handleSettingsClick}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            title="Chat settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {/* Settings Dropdown */}
          {showSettingsDropdown && (
            <div className="absolute right-0 top-12 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={handleClearChat}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <span>🗑️</span>
                <span>Clear Chat</span>
              </button>
              <button
                onClick={handleBlockUser}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <span>🚫</span>
                <span>Block User</span>
              </button>
              <button
                onClick={handleReportUser}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <span>⚠️</span>
                <span>Report User</span>
              </button>
            </div>
          )}

          {/* Backdrop to close dropdown */}
          {showSettingsDropdown && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowSettingsDropdown(false)}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;