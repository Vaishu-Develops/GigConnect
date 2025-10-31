import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import UserCard from '../../components/user/UserCard';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import { LoadingCard } from '../../components/ui/Loader';

const BrowseFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    skills: '',
    minRate: '',
    maxRate: '',
    sortBy: 'rating'
  });

  useEffect(() => {
    fetchFreelancers();
  }, [filters]);

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const users = await userService.getFreelancers(filters);
      // Ensure users is an array before setting state
      setFreelancers(Array.isArray(users) ? users : []);
    } catch (error) {
      console.error('Failed to fetch freelancers:', error);
      // Set empty array on error to prevent map errors
      setFreelancers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFreelancers();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Skilled Freelancers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with talented professionals in your area for your next project
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex space-x-2">
              <Input
                placeholder="Search by name, skills, or expertise..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="flex-1"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              <div className="space-y-4">
                <Input
                  label="Location"
                  placeholder="City, state..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                />

                <Input
                  label="Skills"
                  placeholder="e.g., React, Design, Writing"
                  value={filters.skills}
                  onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Min Rate (₹/hr)"
                    type="number"
                    placeholder="Min"
                    value={filters.minRate}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRate: e.target.value }))}
                  />
                  <Input
                    label="Max Rate (₹/hr)"
                    type="number"
                    placeholder="Max"
                    value={filters.maxRate}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxRate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <Select
                    value={filters.sortBy}
                    onChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                    options={[
                      { value: 'rating', label: 'Highest Rated' },
                      { value: 'newest', label: 'Newest First' },
                      { value: 'rate_high', label: 'Rate: High to Low' },
                      { value: 'rate_low', label: 'Rate: Low to High' }
                    ]}
                    placeholder="Select sorting option"
                  />
                </div>

                <button
                  onClick={() => setFilters({
                    search: '',
                    location: '',
                    skills: '',
                    minRate: '',
                    maxRate: '',
                    sortBy: 'rating'
                  })}
                  className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium py-2"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Freelancers Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Freelancers
                </h2>
                <p className="text-gray-600">
                  {loading ? 'Loading...' : `${freelancers.length} freelancers found`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <LoadingCard key={index} />
                ))}
              </div>
            ) : !Array.isArray(freelancers) || freelancers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No freelancers found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search filters or check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freelancers.map((freelancer) => (
                  <UserCard key={freelancer._id} user={freelancer} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseFreelancers;