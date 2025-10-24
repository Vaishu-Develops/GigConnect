import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import Badge from '../../components/ui/Badge';
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
      const chats = await chatService.getUserChats();
      const applicationChats = chats.filter(chat => chat.lastMessage?.messageType === 'application');
      setApplications(applicationChats);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'accent',
      'accepted': 'success',
      'rejected': 'error',
      'hired': 'primary'
    };
    return colors[status] || 'gray';
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' ? true : app.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">
            Track your job applications and interview status
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {[
              { key: 'all', label: 'All Applications' },
              { key: 'pending', label: 'Pending' },
              { key: 'accepted', label: 'Accepted' },
              { key: 'hired', label: 'Hired' },
              { key: 'rejected', label: 'Rejected' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  filter === tab.key
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
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
            filteredApplications.map((application) => (
              <div key={application._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Application Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {application.gig?.title || 'Gig Application'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>💰 ₹{application.bidAmount}</span>
                          <span>⏱️ {application.timeline}</span>
                          <span>📍 {application.gig?.location}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(application.status)}>
                        {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                      </Badge>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {application.lastMessage?.content}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                      <span>Last updated: {new Date(application.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-3 lg:w-48">
                    <Button
                      as={Link}
                      to={`/messages/${application._id}`}
                      className="w-full"
                    >
                      View Messages
                    </Button>
                    
                    <Button
                      as={Link}
                      to={`/freelancer/job/${application.gig?._id}`}
                      variant="outline"
                      className="w-full"
                    >
                      View Gig
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;