import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { gigService } from '../../services/gigService';

const GigForm = ({ gig, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    title: gig?.title || '',
    description: gig?.description || '',
    budget: gig?.budget || '',
    category: gig?.category || '',
    location: gig?.location || '',
    skillsRequired: gig?.skillsRequired || [],
    duration: gig?.duration || '',
  });
  
  const [currentSkill, setCurrentSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.skillsRequired.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'create') {
        await gigService.createGig(formData);
      } else {
        await gigService.updateGig(gig._id, formData);
      }
      
      navigate('/client/my-gigs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === 'create' ? 'Post a New Gig' : 'Edit Gig'}
        </h1>
        <p className="text-gray-600">
          {mode === 'create' 
            ? 'Fill in the details to find the perfect freelancer for your project'
            : 'Update your gig details'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <Input
          label="Gig Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Website Development for Small Business"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            placeholder="Describe the project requirements, goals, and any specific details..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Budget (₹)"
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g., 5000"
            min="1"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Bangalore, Karnataka"
            required
          />

          <Input
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 2 weeks, 1 month"
          />
        </div>

        {/* Skills Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a skill (e.g., React, Design)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddSkill}
              disabled={!currentSkill.trim()}
            >
              Add
            </Button>
          </div>
          
          {/* Skills Display */}
          <div className="flex flex-wrap gap-2">
            {formData.skillsRequired.map((skill, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-emerald-600 hover:text-emerald-800 ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-4 pt-6">
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            {mode === 'create' ? 'Post Gig' : 'Update Gig'}
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GigForm;