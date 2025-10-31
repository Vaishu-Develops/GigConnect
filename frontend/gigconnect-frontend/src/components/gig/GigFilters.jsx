import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';

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
          <Select
            value={filters.category}
            onChange={(value) => handleChange('category', value)}
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(category => ({ value: category, label: category }))
            ]}
            placeholder="Select category"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <Select
            value={filters.sortBy}
            onChange={(value) => handleChange('sortBy', value)}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'budget_high', label: 'Budget: High to Low' },
              { value: 'budget_low', label: 'Budget: Low to High' },
              { value: 'deadline', label: 'Nearby Deadline' }
            ]}
            placeholder="Select sorting option"
          />
        </div>
      </div>
    </div>
  );
};

export default GigFilters;