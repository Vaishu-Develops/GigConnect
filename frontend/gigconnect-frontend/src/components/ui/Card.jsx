import React from 'react';

const Card = ({ 
  children, 
  className = '',
  variant = 'default',
  hover = false,
  ...props 
}) => {
  const variants = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg border border-gray-100',
    filled: 'bg-gray-50 border border-gray-200',
  };

  const hoverClass = hover ? 'hover:shadow-md transition-all duration-300' : '';

  return (
    <div 
      className={`
        rounded-xl ${variants[variant]} ${hoverClass} ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

export default Card;