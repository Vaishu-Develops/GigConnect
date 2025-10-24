import React, { useState } from 'react';

const Rating = ({ 
  rating = 0, 
  maxStars = 5, 
  size = 'md',
  readonly = false,
  onRatingChange,
  showLabel = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          
          return (
            <button
              key={index}
              type="button"
              className={`
                ${sizes[size]} transition-colors
                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                ${isFilled ? 'text-amber-500' : 'text-gray-300'}
              `}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
            >
              ★
            </button>
          );
        })}
      </div>
      
      {showLabel && (
        <span className="text-sm text-gray-600 ml-2">
          {rating.toFixed(1)}/{maxStars}
        </span>
      )}
    </div>
  );
};

export default Rating;