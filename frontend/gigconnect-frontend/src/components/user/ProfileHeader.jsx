import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { navigateToChat } from '../../utils/chatUtils';
import { getSafeAvatarUrl } from '../../utils/imageUtils';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EditProfileModal from './EditProfileModal';

const ProfileHeader = ({ user, isOwnProfile = false, onProfileUpdated }) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [messageLoading, setMessageLoading] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handleMessage = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser._id === user._id) {
      alert("You can't message yourself!");
      return;
    }

    setMessageLoading(true);
    try {
      await navigateToChat(user._id, navigate);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Please try again.');
    } finally {
      setMessageLoading(false);
    }
  };

  const handleHireMe = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser._id === user._id) {
      alert("You can't hire yourself!");
      return;
    }

    if (user.role !== 'freelancer') {
      alert("You can only hire freelancers!");
      return;
    }

    if (currentUser.role !== 'client') {
      alert("Only clients can hire freelancers!");
      return;
    }

    // Navigate to direct hire page
    navigate('/hire-freelancer', { 
      state: { 
        freelancer: user,
        mode: 'direct-hire'
      }
    });
  };

  const formatRate = (rate) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(rate);
  };

  const stats = [
    { label: 'Completed Projects', value: user.completedProjects || 0 },
    { label: 'Client Reviews', value: user.reviewCount || 0 },
    { label: 'Response Rate', value: `${user.responseRate || 0}%` },
    { label: 'On-time Delivery', value: `${user.onTimeRate || 0}%` },
  ];

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-32 bg-gradient-to-r from-emerald-500 to-purple-600"></div>
      
      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
          <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={getSafeAvatarUrl(user)}
                alt={user?.name || 'User profile'}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-gray-100"
                onError={(e) => {
                  e.target.src = '/robot.png';
                  e.target.onerror = null;
                }}
              />
              {user?.isOnline && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Unknown User'}</h1>
                {user?.isOnline && (
                  <Badge variant="success" size="sm">
                    Online
                  </Badge>
                )}
              </div>
              
              <p className="text-lg text-gray-600 capitalize">{user.role}</p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Rating rating={user.avgRating || 0} size="md" readonly showLabel />
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">
                  {user.location || 'Location not set'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-4 md:mt-0">
            {isOwnProfile ? (
              <Button onClick={() => setShowEditProfile(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleMessage}
                  disabled={messageLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                >
                  {messageLoading ? 'Connecting...' : 'Message'}
                </Button>
                {currentUser?.role === 'client' && user.role === 'freelancer' && (
                  <Button 
                    variant="secondary" 
                    onClick={handleHireMe}
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    Hire Me
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {user.bio}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Skills & Rate */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 pt-6 border-t border-gray-200">
          {user.skills && user.skills.length > 0 && (
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.hourlyRate && (
            <div className="mt-4 md:mt-0 md:ml-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">
                  {formatRate(user.hourlyRate)}
                </div>
                <div className="text-sm text-gray-600">Hourly Rate</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Edit Profile Modal */}
    {isOwnProfile && (
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onProfileUpdated={onProfileUpdated}
      />
    )}
    </>
  );
};

export default ProfileHeader;