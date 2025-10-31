import React, { useState, useEffect } from 'react';
import { gigService } from '../../services/gigService';
import GigGrid from '../../components/gig/GigGrid';
import GigFilters from '../../components/gig/GigFilters';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const ExploreGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    minBudget: '',
    maxBudget: '',
    category: '',
    sortBy: 'newest'
  });

  useEffect(() => {
    fetchGigs();
  }, [filters]);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const gigsData = await gigService.getGigs(filters);
      setGigs(gigsData);
    } catch (error) {
      console.error('Failed to fetch gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Next Gig
          </h1>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Discover local opportunities that match your skills and interests
          </p>
          
          {/* Quick Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex space-x-2">
              <Input
                placeholder="Search gigs by keyword..."
                value={filters.keyword}
                onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                className="flex-1"
              />
              <Button type="submit">
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <GigFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Gigs Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Gigs
                </h2>
                <p className="text-gray-600">
                  {loading ? 'Loading...' : `${gigs.length} gigs found`}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                <div className="w-48">
                  <Select
                    value={filters.sortBy}
                    onChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                    options={[
                      { value: 'newest', label: 'Newest First' },
                      { value: 'budget_high', label: 'Budget: High to Low' },
                      { value: 'budget_low', label: 'Budget: Low to High' }
                    ]}
                    placeholder="Select sorting option"
                  />
                </div>
              </div>
            </div>

            <GigGrid 
              gigs={gigs} 
              loading={loading}
              emptyMessage="No gigs match your search criteria"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreGigs;