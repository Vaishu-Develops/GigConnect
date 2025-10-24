import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gigService } from '../../services/gigService';
import GigGrid from '../../components/gig/GigGrid';
import { LoadingSpinner } from '../../components/ui/Loader';

const ActiveProjects = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveProjects();
  }, []);

  const fetchActiveProjects = async () => {
    try {
      const gigsData = await gigService.getMyGigs();
      const activeGigs = gigsData.filter(gig => gig.status === 'in-progress');
      setGigs(activeGigs);
    } catch (error) {
      console.error('Failed to fetch active projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Active Projects</h1>
          <p className="text-gray-600 mt-2">
            Monitor your ongoing projects and communicate with freelancers
          </p>
        </div>

        {/* Projects Grid */}
        <GigGrid 
          gigs={gigs}
          loading={loading}
          emptyMessage={
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No active projects
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have any active projects at the moment.
              </p>
              <Link
                to="/client/post-gig"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Post a New Gig
              </Link>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default ActiveProjects;