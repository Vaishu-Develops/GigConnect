import React from 'react';
import { Link } from 'react-router-dom';

const RoleSelector = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join GigConnect
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose how you want to use our platform. You can always change this later.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Client Card */}
          <Link
            to="/register?role=client"
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-emerald-500 hover:shadow-xl p-8 text-center transition-all duration-300 h-full flex flex-col">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                💼
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                I'm a Client
              </h3>
              <p className="text-gray-600 mb-6 flex-grow">
                I want to hire talented freelancers for my projects and get work done efficiently.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Post gigs and projects
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Browse freelancer profiles
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Manage payments securely
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <span className="text-emerald-600 font-semibold group-hover:text-emerald-700">
                  Hire Talent →
                </span>
              </div>
            </div>
          </Link>

          {/* Freelancer Card */}
          <Link
            to="/register?role=freelancer"
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-purple-500 hover:shadow-xl p-8 text-center transition-all duration-300 h-full flex flex-col">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                🚀
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                I'm a Freelancer
              </h3>
              <p className="text-gray-600 mb-6 flex-grow">
                I have skills to offer and want to find local gigs to grow my business and portfolio.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Showcase your portfolio
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Apply to local gigs
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Get paid for your work
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <span className="text-purple-600 font-semibold group-hover:text-purple-700">
                  Find Work →
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;