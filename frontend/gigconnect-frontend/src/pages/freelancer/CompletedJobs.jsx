import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gigService } from '../../services/gigService';
import GigGrid from '../../components/gig/GigGrid';

const CompletedJobs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  const fetchCompletedJobs = async () => {
    try {
      const allGigs = await gigService.getGigs();
      const completedGigs = allGigs.filter(gig => 
        gig.status === 'completed' && gig.freelancer?._id // Assuming this identifies assigned gigs
      );
      setGigs(completedGigs);
    } catch (error) {
      console.error('Failed to fetch completed jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Completed Jobs</h1>
          <p className="text-gray-600 mt-2">
            Review your successfully delivered projects and client feedback
          </p>
        </div>

        {/* Jobs Grid */}
        <GigGrid 
          gigs={gigs}
          loading={loading}
          emptyMessage={
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No completed jobs yet
              </h3>
              <p className="text-gray-600 mb-6">
                Your completed jobs will appear here once you finish projects with clients.
              </p>
              <Link
                to="/freelancer/browse-jobs"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Browse Available Jobs
              </Link>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CompletedJobs;