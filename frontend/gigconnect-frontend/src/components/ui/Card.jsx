import React from 'react';
import { clsx } from 'clsx';

const Card = ({ 
  children, 
  className = '',
  hover = false,
  glass = false,
  ...props 
}) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-gray-200 overflow-hidden',
        {
          'glass-card': glass,
          'transition-all duration-300 hover:shadow-xl hover:border-secondary/30 transform hover:-translate-y-1': hover,
          'shadow-lg': !glass,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={clsx('p-6 border-b border-gray-100', className)}>
    {children}
  </div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={clsx('p-6', className)}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={clsx('p-6 border-t border-gray-100 bg-gray-50', className)}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;