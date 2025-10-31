import React from 'react';
import Rating from '../ui/Rating';
import { getSafeAvatarUrl } from '../../utils/imageUtils';

const ReviewCard = ({ review }) => {
  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={getSafeAvatarUrl(review.clientId)}
            alt={review.clientId?.name || 'Unknown User'}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.src = '/robot.png';
              e.target.onerror = null;
            }}
          />
          <div>
            <h4 className="font-semibold text-gray-900">{review.clientId?.name || 'Anonymous'}</h4>
            <p className="text-sm text-gray-600">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        <Rating rating={review.rating} size="sm" readonly />
      </div>

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed mb-4">
        {review.comment}
      </p>

      {/* Project Info */}
      {review.gigId && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Project: <span className="font-medium text-gray-900">{review.gigId.title}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;