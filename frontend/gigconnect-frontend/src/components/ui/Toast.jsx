import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const styles = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    warning: 'bg-warning text-white',
    info: 'bg-secondary text-white'
  };

  const Icon = icons[type];

  return (
    <div className={`flex items-center p-4 rounded-lg shadow-lg ${styles[type]} max-w-sm`}>
      <Icon size={20} className="mr-3" />
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 hover:opacity-70 transition-opacity"
      >
        <XCircle size={16} />
      </button>
    </div>
  );
};

export default Toast;