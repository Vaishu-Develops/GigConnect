// components/gig/GigCard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      {/* Header with Budget */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
            {gig.title}
          </h3>
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
            {formatBudget(gig.budget)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {gig.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500">
          <span className="flex items-center">
            📍 {gig.location}
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            ⏱️ {gig.duration || 'Flexible'}
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {gig.skillsRequired?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-200"
            >
              {skill}
            </span>
          ))}
          {gig.skillsRequired?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
              +{gig.skillsRequired.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <img
              src={gig.client?.avatar || '/default-avatar.png'}
              alt={gig.client?.name}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="text-sm text-gray-600">{gig.client?.name}</span>
          </div>
          
          <Link
            to={`/gigs/${gig._id}`}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 transform group-hover:scale-105"
          >
            View Details
          </Link>
        </div>

        {/* Owner Action Buttons */}
        {(showOwnerActions && isOwner) && (
          <div className="flex space-x-2 pt-2 border-t border-gray-100">
            <button
              onClick={handleEditGig}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-200"
            >
              Edit Gig
            </button>
            <button
              onClick={handleViewApplicants}
              className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition duration-200"
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