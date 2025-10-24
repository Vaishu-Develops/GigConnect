import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const clientLinks = [
    { path: '/client/post-gig', label: 'Post Gig', icon: '📝' },
    { path: '/client/my-gigs', label: 'My Gigs', icon: '💼' },
    { path: '/client/active-projects', label: 'Active Projects', icon: '🚀' },
    { path: '/client/completed-projects', label: 'Completed', icon: '✅' },
  ];

  const freelancerLinks = [
    { path: '/freelancer/browse-jobs', label: 'Browse Jobs', icon: '🔍' },
    { path: '/freelancer/applications', label: 'My Applications', icon: '📨' },
    { path: '/freelancer/active-jobs', label: 'Active Jobs', icon: '💼' },
    { path: '/freelancer/earnings', label: 'Earnings', icon: '💰' },
  ];

  const commonLinks = [
    { path: '/messages', label: 'Messages', icon: '💬' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const getRoleLinks = () => {
    if (user?.role === 'client') return clientLinks;
    if (user?.role === 'freelancer') return freelancerLinks;
    return [];
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:shadow-none
      `}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {/* Role-specific links */}
          {getRoleLinks().map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive(link.path) 
                  ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}

          {/* Common links */}
          <div className="pt-4 border-t border-gray-200">
            {commonLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive(link.path) 
                    ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;