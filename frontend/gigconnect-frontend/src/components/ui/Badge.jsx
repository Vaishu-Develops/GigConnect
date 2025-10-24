import React from 'react';

const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '' 
}) => {
  const variants = {
    primary: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    secondary: 'bg-purple-100 text-purple-800 border-purple-200',
    accent: 'bg-amber-100 text-amber-800 border-amber-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`
      inline-flex items-center border rounded-full font-medium
      ${variants[variant]} ${sizes[size]} ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;