import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gigService } from '../../services/gigService';
import GigGrid from '../../components/gig/GigGrid';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/Loader';

const ActiveJobs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchActiveJobs();
  }, []);

  const fetchActiveJobs = async () => {
    try {
      // In a real app, this would be an endpoint for freelancer's assigned gigs
      const allGigs = await gigService.getGigs();
      
      // Mock filtering - in real app, backend would handle this
      const activeGigs = allGigs.filter(gig => 
        gig.status === 'in-progress' 
        // && gig.freelancerId === currentUser.id // This would check assigned gigs
      ).map(gig => ({
        ...gig,
        // Mock freelancer assignment
        freelancer: { _id: 'freelancer123', name: 'You' }
      }));
      
      setGigs(activeGigs);
    } catch (error) {
      console.error('Failed to fetch active jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeliverableStats = (gig) => {
    // Mock deliverable data
    const total = 3;
    const completed = Math.floor(Math.random() * 4); // Random for demo
    return { total, completed, pending: total - completed };
  };

  const filteredGigs = gigs.filter(gig => {
    if (filter === 'all') return true;
    if (filter === 'urgent') {
      const stats = getDeliverableStats(gig);
      return stats.pending > 0 && stats.completed / stats.total < 0.5;
    }
    if (filter === 'almost-done') {
      const stats = getDeliverableStats(gig);
      return stats.completed / stats.total >= 0.7;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Active Jobs</h1>
            <p className="text-gray-600 mt-2">
              Manage your current projects and track progress
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button as={Link} to="/freelancer/browse-jobs" variant="outline">
              Find More Work
            </Button>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div 
            className={`bg-white rounded-lg shadow-sm border-2 p-4 text-center cursor-pointer transition-all ${
              filter === 'all' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
            }`}
            onClick={() => setFilter('all')}
          >
            <div className={`text-2xl font-bold ${
              filter === 'all' ? 'text-emerald-600' : 'text-gray-900'
            }`}>
              {gigs.length}
            </div>
            <div className="text-sm text-gray-600">All Jobs</div>
          </div>

          <div 
            className={`bg-white rounded-lg shadow-sm border-2 p-4 text-center cursor-pointer transition-all ${
              filter === 'urgent' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'
            }`}
            onClick={() => setFilter('urgent')}
          >
            <div className={`text-2xl font-bold ${
              filter === 'urgent' ? 'text-red-600' : 'text-gray-900'
            }`}>
              {gigs.filter(g => {
                const stats = getDeliverableStats(g);
                return stats.pending > 0 && stats.completed / stats.total < 0.5;
              }).length}
            </div>
            <div className="text-sm text-gray-600">Needs Attention</div>
          </div>

          <div 
            className={`bg-white rounded-lg shadow-sm border-2 p-4 text-center cursor-pointer transition-all ${
              filter === 'almost-done' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => setFilter('almost-done')}
          >
            <div className={`text-2xl font-bold ${
              filter === 'almost-done' ? 'text-green-600' : 'text-gray-900'
            }`}>
              {gigs.filter(g => {
                const stats = getDeliverableStats(g);
                return stats.completed / stats.total >= 0.7;
              }).length}
            </div>
            <div className="text-sm text-gray-600">Almost Done</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {gigs.reduce((total, gig) => {
                const stats = getDeliverableStats(gig);
                return total + stats.completed;
              }, 0)}
            </div>
            <div className="text-sm text-gray-600">Completed Tasks</div>
          </div>
        </div>

        {/* Enhanced Gig Grid with Progress */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner />
          </div>
        ) : filteredGigs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No active jobs' : `No ${filter} jobs`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You don't have any active jobs at the moment. Start applying to gigs!"
                : `You don't have any ${filter.replace('-', ' ')} jobs at the moment.`
              }
            </p>
            <Link
              to="/freelancer/browse-jobs"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Browse Available Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map((gig) => {
              const stats = getDeliverableStats(gig);
              const progress = (stats.completed / stats.total) * 100;
              
              return (
                <div key={gig._id} className="card hover:shadow-lg transition-all duration-300 group">
                  <div className="p-6">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{stats.completed}/{stats.total} tasks</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            progress >= 70 ? 'bg-green-500' :
                            progress >= 40 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Gig Header */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 flex-1 mr-2">
                        {gig.title}
                      </h3>
                      <Badge variant={
                        progress >= 70 ? 'success' :
                        progress >= 40 ? 'accent' : 'error'
                      }>
                        {Math.round(progress)}%
                      </Badge>
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center space-x-2 mb-3">
                      <img
                        src={gig.client?.avatar || '/robot.png'}
                        alt={gig.client?.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600">{gig.client?.name}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {gig.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {gig.skillsRequired?.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>💰 ₹{gig.budget}</span>
                      <span>📍 {gig.location}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button
                        as={Link}
                        to={`/freelancer/workspace/${gig._id}`}
                        size="sm"
                        className="flex-1"
                      >
                        Continue Work
                      </Button>
                      <Button
                        as={Link}
                        to={`/messages/new?userId=${gig.client?._id}&gigId=${gig._id}`}
                        variant="outline"
                        size="sm"
                      >
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveJobs;