import React from 'react';

const MessageBubble = ({ message, isOwn = false }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md`}>
        <div
          className={`
            rounded-2xl px-4 py-2 shadow-sm
            ${isOwn
              ? 'bg-emerald-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
            }
          `}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span>{formatTime(message.createdAt)}</span>
          {isOwn && message.isRead && (
            <span className="text-emerald-600">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;