import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/Loader';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // This would typically come from a dedicated applications endpoint
      const response = await chatService.getUserChats();
      console.log('Chats response:', response);
      
      // Handle the response structure properly
      let chats = [];
      if (response && response.success && Array.isArray(response.chats)) {
        chats = response.chats;
      } else if (Array.isArray(response)) {
        chats = response;
      } else {
        console.error('Invalid chats response structure:', response);
        setApplications([]);
        return;
      }
      
      const applicationChats = chats.filter(chat => {
        // Check if this chat contains any application messages
        return chat.lastMessage?.messageType === 'application' || 
               chat.lastMessage?.content?.includes('🎯 New Job Application') ||
               chat.lastMessage?.content?.includes('Application for');
      });
      
      console.log('Filtered application chats:', applicationChats.length);
      console.log('Application chats:', applicationChats);
      
      setApplications(applicationChats);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'yellow',
      accepted: 'green',
      rejected: 'red',
      in_progress: 'blue',
      completed: 'emerald',
    };
    return colors[status] || 'gray';
  };

  const filters = ['all', 'pending', 'accepted', 'rejected', 'in_progress', 'completed'];

  const filteredApplications = applications.filter(application => {
    if (filter === 'all') return true;
    return application.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">
            Track all your job applications and their status
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 overflow-x-auto">
          {filters.map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                filter === filterOption
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1).replace('_', ' ')}
              {filterOption === 'all' && applications.length > 0 && ` (${applications.length})`}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? "You haven't applied to any gigs yet. Start browsing opportunities!"
                  : `You don't have any ${filter} applications at the moment.`
                }
              </p>
              {filter === 'all' && (
                <Link
                  to="/freelancer/browse-jobs"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Browse Jobs
                </Link>
              )}
            </div>
          ) : (
            filteredApplications.map((application) => {
              // Extract application details from the message content
              const messageContent = application.lastMessage?.content || '';
              const titleMatch = messageContent.match(/New Job Application for "(.+?)"/);
              const bidMatch = messageContent.match(/Bid Amount:\*\* ₹(\d+)/);
              const timelineMatch = messageContent.match(/Timeline:\*\* (.+?)$/m);
              
              const jobTitle = titleMatch ? titleMatch[1] : 'Job Application';
              const bidAmount = bidMatch ? bidMatch[1] : 'N/A';
              const timeline = timelineMatch ? timelineMatch[1] : 'N/A';
              
              return (
                <div key={application.chatId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Application Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {jobTitle}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>💰 ₹{bidAmount}</span>
                            <span>⏱️ {timeline}</span>
                            <span>👤 {application.otherUser?.name || 'Client'}</span>
                          </div>
                        </div>
                        <Badge variant="pending">
                          Submitted
                        </Badge>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {messageContent.split('\n').slice(2, 5).join(' ').slice(0, 200)}...
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Applied: {new Date(application.lastMessage?.createdAt).toLocaleDateString()}</span>
                        <span>Client: {application.otherUser?.name || 'Unknown'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-3 lg:w-48">
                      <Button
                        as={Link}
                        to={`/messages/${application.chatId}`}
                        className="w-full"
                      >
                        View Messages
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(`/messages/${application.chatId}`, '_blank')}
                      >
                        Open Chat
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;