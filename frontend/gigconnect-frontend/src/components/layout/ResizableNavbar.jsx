import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useContractNotifications } from '../../hooks/useContractNotifications';
import { getSafeAvatarUrl } from '../../utils/imageUtils';
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../ui/resizable-navbar';
import { BellIcon } from '@heroicons/react/24/outline';

const GigConnectLogo = () => {
  return (
    <Link
      to="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
        <span className="text-white font-bold text-lg">G</span>
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
        GigConnect
      </span>
    </Link>
  );
};

const UserDropdown = ({ user, handleLogout, unreadCount, pendingProposals }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-lg hover:bg-emerald-50 transition-colors"
      >
        <img
          src={getSafeAvatarUrl(user)}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 w-48 py-2 mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-emerald-100/50 z-50">
          <Link 
            to="/profile" 
            className="block px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <Link 
            to="/dashboard" 
            className="block px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/workspaces" 
            className="block px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Workspaces
          </Link>
          
          {/* Role-specific links */}
          {user.role === 'client' && (
            <>
              <Link 
                to="/client/contracts" 
                className="block px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                My Contracts
              </Link>
              <Link 
                to="/client/my-gigs" 
                className="block px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                My Gigs
              </Link>
            </>
          )}
          
          {user.role === 'freelancer' && (
            <>
              <Link 
                to="/freelancer/hire-proposals" 
                className="block px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors relative"
                onClick={() => setIsOpen(false)}
              >
                Hire Proposals
                {pendingProposals > 0 && (
                  <span className="absolute right-2 top-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {pendingProposals > 9 ? '9+' : pendingProposals}
                  </span>
                )}
              </Link>
              <Link 
                to="/freelancer/applications" 
                className="block px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                My Applications
              </Link>
            </>
          )}
          
          <Link 
            to="/saved-gigs" 
            className="block px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Saved Gigs
          </Link>
          <Link 
            to="/settings" 
            className="block px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const { pendingProposals } = useContractNotifications();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation items for authenticated users
  const getNavItems = () => {
    if (!user) {
      return [
        { name: "Explore", link: "/explore" },
        { name: "Find Talent", link: "/freelancers" },
        { name: "How it Works", link: "/how-it-works" },
      ];
    }

    const baseItems = [
      { name: "Explore", link: "/explore" },
      { name: "Messages", link: "/messages" },
      { name: "Workspaces", link: "/workspaces" },
      { name: "Dashboard", link: "/dashboard" },
    ];

    if (user.role === 'client') {
      baseItems.push({ name: "Contracts", link: "/client/contracts" });
    } else if (user.role === 'freelancer') {
      baseItems.push({ name: "Proposals", link: "/freelancer/hire-proposals" });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <ResizableNavbar>
      {/* Desktop Navigation */}
      <NavBody>
        <div className="flex items-center">
          <GigConnectLogo />
        </div>
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Notifications */}
              <Link
                to="/notifications"
                className="relative p-2 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <BellIcon className="w-6 h-6 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Proposals notification for freelancers */}
              {user.role === 'freelancer' && pendingProposals > 0 && (
                <Link
                  to="/freelancer/hire-proposals"
                  className="relative p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <span className="text-emerald-600 font-medium">Proposals</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingProposals > 9 ? '9+' : pendingProposals}
                  </span>
                </Link>
              )}

              <UserDropdown
                user={user}
                handleLogout={handleLogout}
                unreadCount={unreadCount}
                pendingProposals={pendingProposals}
              />
            </>
          ) : (
            <>
              <NavbarButton 
                as={Link} 
                to="/login" 
                variant="secondary"
              >
                Login
              </NavbarButton>
              <NavbarButton 
                as={Link} 
                to="/register" 
                variant="primary"
              >
                Sign Up
              </NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <GigConnectLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              to={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-slate-700 hover:text-emerald-700 font-medium py-2 transition-colors"
            >
              {item.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex w-full flex-col gap-3 mt-4 pt-4 border-t border-slate-200">
              <Link
                to="/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between w-full text-slate-700 hover:text-emerald-700 font-medium py-2 transition-colors"
              >
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-slate-700 hover:text-emerald-700 font-medium py-2 transition-colors"
              >
                Profile
              </Link>
              
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-slate-700 hover:text-emerald-700 font-medium py-2 transition-colors"
              >
                Settings
              </Link>
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left text-slate-700 hover:text-emerald-700 font-medium py-2 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-4 mt-4">
              <NavbarButton
                as={Link}
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                as={Link}
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Sign Up
              </NavbarButton>
            </div>
          )}
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
};

export default Navbar;