// components/gig/GigCard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSafeAvatarUrl } from '../../utils/imageUtils';

const GigCard = ({ gig, showOwnerActions = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const formatBudget = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const isOwner = user && gig.client && user._id === gig.client._id;

  const handleEditGig = () => {
    navigate(`/client/edit-gig/${gig._id}`);
  };

  const handleViewApplicants = () => {
    navigate(`/client/gig-applicants/${gig._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group transform hover:-translate-y-1">
      {/* Header with Budget */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight pr-3">
            {gig.title}
          </h3>
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shadow-lg">
            {formatBudget(gig.budget)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {gig.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <span className="flex items-center">
            <span className="mr-1">📍</span> {gig.location}
          </span>
          <span className="flex items-center">
            <span className="mr-1">⏱️</span> {gig.duration || 'Flexible'}
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {gig.skillsRequired?.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              {skill}
            </span>
          ))}
          {gig.skillsRequired?.length > 4 && (
            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
              +{gig.skillsRequired.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <img
              src={getSafeAvatarUrl(gig.client)}
              alt={gig.client?.name}
              className="w-8 h-8 rounded-full mr-3 border-2 border-gray-200"
              onError={(e) => {
                e.target.src = '/robot.png';
                e.target.onerror = null;
              }}
            />
            <span className="text-sm font-medium text-gray-700">{gig.client?.name}</span>
          </div>
          
          <Link
            to={`/gigs/${gig._id}`}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-emerald-600 hover:to-emerald-700"
          >
            View Details
          </Link>
        </div>

        {/* Owner Action Buttons */}
        {(showOwnerActions && isOwner) && (
          <div className="flex space-x-3 pt-3 border-t border-gray-100">
            <button
              onClick={handleEditGig}
              className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              Edit Gig
            </button>
            <button
              onClick={handleViewApplicants}
              className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105"
            >
              View Applicants
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigCard;