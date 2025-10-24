import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gigService } from '../../services/gigService';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { LoadingSpinner } from '../ui/Loader';

const GigDetails = () => {
  const { gigId } = useParams();
  const { user } = useAuth();
  
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGigDetails();
  }, [gigId]);

  const fetchGigDetails = async () => {
    try {
      const gigData = await gigService.getGigById(gigId);
      setGig(gigData);
    } catch (err) {
      setError('Failed to load gig details');
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Gig not found'}
          </h3>
          <Link to="/explore" className="text-emerald-600 hover:text-emerald-700">
            Browse other gigs
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && gig.client?._id === user._id;
  const canApply = user && user.role === 'freelancer' && gig.status === 'open';

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{gig.title}</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="primary">{gig.category}</Badge>
              <Badge variant={
                gig.status === 'open' ? 'success' : 
                gig.status === 'in-progress' ? 'accent' : 'gray'
              }>
                {gig.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {formatBudget(gig.budget)}
            </div>
            <div className="text-sm text-gray-500">Budget</div>
          </div>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed">{gig.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Required */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {gig.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About the Client</h3>
            <div className="flex items-center space-x-4">
              <img
                src={gig.client?.avatar || '/default-avatar.png'}
                alt={gig.client?.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{gig.client?.name}</h4>
                <p className="text-gray-600 text-sm">Member since {new Date(gig.client?.createdAt).getFullYear()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Started</h3>
            
            {isOwner ? (
              <div className="space-y-3">
                <Button className="w-full" as={Link} to={`/client/edit-gig/${gig._id}`}>
                  Edit Gig
                </Button>
                <Button variant="secondary" className="w-full" as={Link} to={`/client/gig-applicants/${gig._id}`}>
                  View Applicants
                </Button>
              </div>
            ) : canApply ? (
              <div className="space-y-3">
                <Button className="w-full" as={Link} to={`/freelancer/apply/${gig._id}`}>
                  Apply Now
                </Button>
                <Button variant="outline" className="w-full">
                  Save for Later
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-600">
                {user ? (
                  <p>This gig is not available for applications</p>
                ) : (
                  <div className="space-y-3">
                    <p>Sign in to apply for this gig</p>
                    <Button className="w-full" as={Link} to="/login">
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gig Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gig Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{gig.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{gig.duration || 'Flexible'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Posted:</span>
                <span className="font-medium">
                  {new Date(gig.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;