import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import { getSafeAvatarUrl } from '../../utils/imageUtils';

const UserCard = ({ user, showActions = true }) => {
  const formatRate = (rate) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(rate);
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-300 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <img
              src={getSafeAvatarUrl(user)}
              alt={user?.name || 'User profile'}
              className="w-16 h-16 rounded-full border-2 border-emerald-200 group-hover:border-emerald-400 transition-colors object-cover bg-gray-100"
              onError={(e) => {
                e.target.src = '/robot.png';
                e.target.onerror = null;
              }}
            />
            {user?.isOnline && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-600 capitalize">{user.role}</p>
              </div>
              {user.isOnline && (
                <Badge variant="success" size="sm">
                  Online
                </Badge>
              )}
            </div>
            
            {/* Rating and Reviews - Fixed responsive layout */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Rating rating={user.avgRating || user.averageRating || 0} size="sm" readonly />
                <span className="text-xs text-gray-500">
                  {(user.avgRating || user.averageRating || 0).toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {user.reviewCount || user.totalReviews || 0} reviews
              </span>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <div className="text-center">
                <div className="text-sm font-semibold text-emerald-600">
                  {user.completedProjects || 0}
                </div>
                <div className="text-xs text-gray-500">Projects</div>
              </div>
              
              {user.role === 'freelancer' && user.hourlyRate && (
                <div className="text-center">
                  <div className="text-sm font-semibold text-purple-600">
                    {formatRate(user.hourlyRate)}
                  </div>
                  <div className="text-xs text-gray-500">per hour</div>
                </div>
              )}
              
              <div className="text-center">
                <div className="text-xs text-gray-400">
                  Joined {new Date(user.createdAt).getFullYear()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {user.bio}
          </p>
        )}

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {user.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-200"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                +{user.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Location if available */}
        {user.location && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span className="flex items-center">
              � {user.location}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      {showActions && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex space-x-3">
            <Link
              to={`/user/${user._id}`}
              className="flex-1 bg-white text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-medium text-center hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
            >
              View Profile
            </Link>
            
            <Link
              to={`/messages/new?userId=${user._id}`}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center hover:shadow-lg transition-all duration-300 transform group-hover:scale-105"
            >
              Message
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;