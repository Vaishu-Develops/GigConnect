import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gigService } from '../../services/gigService';
import GigGrid from '../../components/gig/GigGrid';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyGigs();
  }, []);

  const fetchMyGigs = async () => {
    try {
      const gigsData = await gigService.getMyGigs();
      setGigs(gigsData);
    } catch (error) {
      console.error('Failed to fetch gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      all: gigs.length,
      open: gigs.filter(gig => gig.status === 'open').length,
      'in-progress': gigs.filter(gig => gig.status === 'in-progress').length,
      completed: gigs.filter(gig => gig.status === 'completed').length,
    };
    return counts;
  };

  const filteredGigs = gigs.filter(gig => 
    filter === 'all' ? true : gig.status === filter
  );

  const statusCounts = getStatusCounts();

  const getStatusColor = (status) => {
    const colors = {
      'open': 'success',
      'in-progress': 'accent',
      'completed': 'primary',
      'cancelled': 'error'
    };
    return colors[status] || 'gray';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Gigs</h1>
            <p className="text-gray-600 mt-2">
              Manage your posted gigs and track applications
            </p>
          </div>
          <Button as={Link} to="/client/post-gig" className="mt-4 sm:mt-0">
            Post New Gig
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { key: 'all', label: 'Total Gigs', count: statusCounts.all },
            { key: 'open', label: 'Open', count: statusCounts.open },
            { key: 'in-progress', label: 'In Progress', count: statusCounts['in-progress'] },
            { key: 'completed', label: 'Completed', count: statusCounts.completed },
          ].map((stat) => (
            <div
              key={stat.key}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilter(stat.key)}
            >
              <div className={`text-2xl font-bold ${
                filter === stat.key ? 'text-emerald-600' : 'text-gray-900'
              }`}>
                {stat.count}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {[
              { key: 'all', label: 'All Gigs' },
              { key: 'open', label: 'Open' },
              { key: 'in-progress', label: 'In Progress' },
              { key: 'completed', label: 'Completed' },
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
                {tab.label} {statusCounts[tab.key] > 0 && `(${statusCounts[tab.key]})`}
              </button>
            ))}
          </div>
        </div>

        {/* Gigs Grid */}
        <GigGrid 
          gigs={filteredGigs}
          loading={loading}
          showOwnerActions={true}
          emptyMessage={
            filter === 'all' 
              ? "You haven't posted any gigs yet"
              : `No ${filter.replace('-', ' ')} gigs found`
          }
        />

        {/* Empty State Action */}
        {!loading && gigs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Ready to find amazing talent?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Post your first gig and connect with skilled freelancers in your area
            </p>
            <Button as={Link} to="/client/post-gig" size="lg">
              Post Your First Gig
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGigs;