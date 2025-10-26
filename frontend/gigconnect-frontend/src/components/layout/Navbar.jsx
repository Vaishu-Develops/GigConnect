// components/layout/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GC</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-purple-700 bg-clip-text text-transparent">
              GigConnect
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search gigs, freelancers..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/explore" className="text-gray-700 hover:text-emerald-600 font-medium">
              Explore
            </Link>
            {user ? (
              <>
                <Link to="/messages" className="text-gray-700 hover:text-emerald-600 font-medium">
                  Messages
                </Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-emerald-600 font-medium">
                  Dashboard
                </Link>
                <div className="relative group">
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full cursor-pointer"
                  />
                  <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-emerald-50">
                      Profile
                    </Link>
                    <Link to="/saved-gigs" className="block px-4 py-2 text-gray-800 hover:bg-emerald-50">
                      Saved Gigs
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-emerald-50">
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-emerald-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-emerald-600 font-medium">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-emerald-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;