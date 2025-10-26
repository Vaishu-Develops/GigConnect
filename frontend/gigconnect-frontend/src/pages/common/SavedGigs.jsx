import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gigService } from '../../services/gigService';
import GigCard from '../../components/gig/GigCard';
import { LoadingSpinner } from '../../components/ui/Loader';

const SavedGigs = () => {
  const { user } = useAuth();
  const [savedGigs, setSavedGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavedGigs();
  }, []);

  const fetchSavedGigs = async () => {
    try {
      setLoading(true);
      
      // Get saved gig IDs from localStorage
      const savedGigIds = JSON.parse(localStorage.getItem('savedGigs') || '[]');
      
      if (savedGigIds.length === 0) {
        setSavedGigs([]);
        setLoading(false);
        return;
      }

      // Fetch gig details for each saved ID
      const gigPromises = savedGigIds.map(gigId => 
        gigService.getGigById(gigId).catch(err => {
          console.error(`Failed to fetch gig ${gigId}:`, err);
          return null;
        })
      );

      const gigs = await Promise.all(gigPromises);
      const validGigs = gigs.filter(gig => gig !== null);
      
      setSavedGigs(validGigs);
    } catch (err) {
      setError('Failed to load saved gigs');
      console.error('Error fetching saved gigs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromSaved = (gigId) => {
    const currentSaved = JSON.parse(localStorage.getItem('savedGigs') || '[]');
    const updatedSaved = currentSaved.filter(id => id !== gigId);
    localStorage.setItem('savedGigs', JSON.stringify(updatedSaved));
    
    // Update state
    setSavedGigs(prev => prev.filter(gig => gig._id !== gigId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Gigs</h1>
          <p className="mt-2 text-gray-600">
            Gigs you've saved for later consideration
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {savedGigs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No saved gigs yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring gigs and save the ones you're interested in
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Browse Gigs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedGigs.map((gig) => (
              <div key={gig._id} className="relative">
                <GigCard gig={gig} />
                <button
                  onClick={() => handleRemoveFromSaved(gig._id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remove from saved"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedGigs;