import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';

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
              src={user?.avatar || user?.profilePicture || '/images/default-avatar.png'}
              alt={user?.name || 'User profile'}
              className="w-16 h-16 rounded-full border-2 border-emerald-200 group-hover:border-emerald-400 transition-colors object-cover bg-gray-100"
              onError={(e) => {
                e.target.src = '/images/default-avatar.png';
                e.target.onerror = null;
              }}
            />
            {user?.isOnline && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
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
            
            <div className="flex items-center space-x-2">
              <Rating rating={user.avgRating || 0} size="sm" readonly showLabel />
              <span className="text-sm text-gray-500">
                ({user.reviewCount || 0} reviews)
              </span>
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

        {/* Location & Rate */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            {user.location && (
              <span className="flex items-center">
                📍 {user.location}
              </span>
            )}
            {user.hourlyRate && (
              <span className="flex items-center">
                💰 {formatRate(user.hourlyRate)}/hr
              </span>
            )}
          </div>
          
          <span className="text-xs text-gray-400">
            Joined {new Date(user.createdAt).getFullYear()}
          </span>
        </div>
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