import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addMessage, getDiscussion } from '../../services/discussionService';
import Button from '../ui/Button';
import { LoadingSpinner } from '../ui/Loader';
import { 
  Send, 
  ArrowLeft,
  Users,
  Clock,
  Hash
} from 'lucide-react';

const DiscussionChat = ({ discussionId, onBack }) => {
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchDiscussion();
  }, [discussionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const response = await getDiscussion(discussionId);
      if (response.success) {
        setDiscussion(response.data);
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch discussion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const messageData = {
        content: newMessage.trim(),
        sender: user._id
      };

      const response = await addMessage(discussionId, messageData);
      
      if (response.success) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          Discussion not found
        </h4>
        <Button onClick={onBack} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg border border-gray-200">
      {/* Discussion Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h3 className="font-semibold text-gray-900">{discussion.title}</h3>
            <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{discussion.participants?.length || 0} participants</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Created {new Date(discussion.createdAt).toLocaleDateString()}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(discussion.priority)}`}>
                {discussion.priority} priority
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Discussion Description */}
      {discussion.description && (
        <div className="p-4 bg-blue-50 border-b border-gray-200">
          <p className="text-sm text-gray-700">{discussion.description}</p>
          {discussion.tags && discussion.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {discussion.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  <Hash className="w-3 h-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message, index) => {
            const isOwnMessage = message.sender?._id === user._id;
            const senderName = message.sender?.name || 'Unknown User';
            
            return (
              <div
                key={message._id || index}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwnMessage
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {!isOwnMessage && (
                    <div className="text-xs font-medium mb-1 opacity-75">
                      {senderName}
                    </div>
                  )}
                  <div>{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-emerald-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-600">No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            disabled={sending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{sending ? 'Sending...' : 'Send'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DiscussionChat;