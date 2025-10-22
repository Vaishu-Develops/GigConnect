import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs md:max-w-md rounded-2xl px-4 py-2 ${
          isOwn
            ? 'bg-gradient-to-r from-secondary to-accent text-white rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none'
        }`}
      >
        {/* Message text */}
        <p className="text-sm break-words">{message.content}</p>

        {/* Message status */}
        <div className={`flex items-center justify-end mt-1 text-xs ${
          isOwn ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span className="mr-1">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {isOwn && (
            message.read ? (
              <CheckCheck size={12} />
            ) : (
              <Check size={12} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;