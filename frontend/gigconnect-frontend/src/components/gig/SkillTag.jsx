import React from 'react';

const SkillTag = ({ 
  skill, 
  onRemove, 
  removable = false,
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 font-medium
        ${sizes[size]} ${className}
      `}
    >
      {skill}
      {removable && (
        <button
          onClick={() => onRemove(skill)}
          className="ml-1.5 text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          ✕
        </button>
      )}
    </span>
  );
};

export default SkillTag;