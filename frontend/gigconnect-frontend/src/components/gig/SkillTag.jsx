import React from 'react';
import { clsx } from 'clsx';

const SkillTag = ({ 
  skill, 
  variant = 'default',
  onRemove,
  className = '' 
}) => {
  const variants = {
    default: 'bg-secondary/10 text-secondary',
    outline: 'border border-secondary text-secondary',
    accent: 'bg-accent/10 text-accent'
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        variants[variant],
        className
      )}
    >
      {skill}
      {onRemove && (
        <button
          onClick={() => onRemove(skill)}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillTag;