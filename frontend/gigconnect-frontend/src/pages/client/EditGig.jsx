import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gigService } from '../../services/gigService';
import GigForm from '../../components/gig/GigForm';
import { LoadingSpinner } from '../../components/ui/Loader';

const EditGig = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGig();
  }, [gigId]);

  const fetchGig = async () => {
    try {
      const gigData = await gigService.getGigById(gigId);
      setGig(gigData);
    } catch (error) {
      console.error('Failed to fetch gig:', error);
      navigate('/client/my-gigs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Gig not found
          </h3>
          <p className="text-gray-600">
            The gig you're trying to edit doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Edit Gig
          </h1>
          <p className="text-xl text-gray-600">
            Update your gig details to attract the right talent
          </p>
        </div>
        <GigForm gig={gig} mode="edit" />
      </div>
    </div>
  );
};

export default EditGig;