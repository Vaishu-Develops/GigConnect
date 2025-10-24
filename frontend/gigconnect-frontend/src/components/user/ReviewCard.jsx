import React from 'react';
import Rating from '../ui/Rating';

const ReviewCard = ({ review }) => {
  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={review.clientId?.avatar || '/default-avatar.png'}
            alt={review.clientId?.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{review.clientId?.name}</h4>
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