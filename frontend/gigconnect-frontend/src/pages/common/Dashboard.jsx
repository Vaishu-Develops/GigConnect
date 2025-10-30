// pages/common/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your {user.role === 'client' ? 'projects' : 'work'} today.
          </p>
        </div>

        {user.role === 'client' ? (
          <ClientDashboard />
        ) : (
          <FreelancerDashboard />
        )}
      </div>
    </div>
  );
};

const ClientDashboard = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Projects</h3>
        <div className="text-3xl font-bold text-emerald-600">12</div>
        <p className="text-gray-600 text-sm mt-2">Projects in progress</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Spent</h3>
        <div className="text-3xl font-bold text-purple-600">₹1,24,500</div>
        <p className="text-gray-600 text-sm mt-2">Across all projects</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Reviews</h3>
        <div className="text-3xl font-bold text-amber-500">3</div>
        <p className="text-gray-600 text-sm mt-2">Projects to review</p>
      </div>

      {/* Quick Actions */}
      <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            to="/client/post-gig"
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="font-medium">Post New Gig</div>
          </Link>

          <Link
            to="/client/my-gigs"
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="text-2xl mb-2">💼</div>
            <div className="font-medium">My Gigs</div>
          </Link>

          <Link
            to="/client/contracts"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium">My Contracts</div>
          </Link>

          <Link
            to="/messages"
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="text-2xl mb-2">💬</div>
            <div className="font-medium">Messages</div>
          </Link>

          <Link
            to="/client/active-projects"
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="text-2xl mb-2">🚀</div>
            <div className="font-medium">Active Projects</div>
          </Link>

          <Link
            to="/workspaces"
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="text-2xl mb-2">🏢</div>
            <div className="font-medium">Workspaces</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

const FreelancerDashboard = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Jobs</h3>
        <div className="text-3xl font-bold text-emerald-600">5</div>
        <p className="text-gray-600 text-sm mt-2">Jobs in progress</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Earnings</h3>
        <div className="text-3xl font-bold text-purple-600">₹85,200</div>
        <p className="text-gray-600 text-sm mt-2">This month</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Rating</h3>
        <div className="text-3xl font-bold text-amber-500">4.8</div>
        <p className="text-gray-600 text-sm mt-2">Based on 47 reviews</p>
      </div>

      {/* Quick Actions */}
      <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            to="/freelancer/browse-jobs"
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-medium">Browse Jobs</div>
          </Link>

          <Link
            to="/freelancer/applications"
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="text-2xl mb-2">📨</div>
            <div className="font-medium">My Applications</div>
          </Link>

          <Link
            to="/freelancer/hire-proposals"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium">Hire Proposals</div>
          </Link>

          <Link
            to="/messages"
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="text-2xl mb-2">💬</div>
            <div className="font-medium">Messages</div>
          </Link>

          <Link
            to="/freelancer/earnings"
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="text-2xl mb-2">💰</div>
            <div className="font-medium">Earnings</div>
          </Link>

          <Link
            to="/workspaces"
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="text-2xl mb-2">🏢</div>
            <div className="font-medium">Workspaces</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;