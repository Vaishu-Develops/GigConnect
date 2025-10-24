import React from 'react';
import Input from '../ui/Input';

const GigFilters = ({ filters, onFiltersChange }) => {
  const categories = [
    'Technology',
    'Design',
    'Writing',
    'Marketing',
    'Consulting',
    'Home Services',
    'Tutoring',
    'Creative Arts',
    'Professional Services',
    'Other'
  ];

  const handleChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    onFiltersChange({
      keyword: '',
      location: '',
      minBudget: '',
      maxBudget: '',
      category: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        <Input
          label="Search"
          placeholder="Search gigs..."
          value={filters.keyword}
          onChange={(e) => handleChange('keyword', e.target.value)}
        />

        <Input
          label="Location"
          placeholder="City, state..."
          value={filters.location}
          onChange={(e) => handleChange('location', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Min Budget"
            type="number"
            placeholder="Min"
            value={filters.minBudget}
            onChange={(e) => handleChange('minBudget', e.target.value)}
          />
          <Input
            label="Max Budget"
            type="number"
            placeholder="Max"
            value={filters.maxBudget}
            onChange={(e) => handleChange('maxBudget', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="budget_high">Budget: High to Low</option>
            <option value="budget_low">Budget: Low to High</option>
            <option value="deadline">Nearby Deadline</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default GigFilters;