import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gigService } from '../../services/gigService';
import { chatService } from '../../services/chatService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const HireFreelancer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const freelancer = location.state?.freelancer;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    timeline: '',
    projectType: 'fixed', // fixed or hourly
    urgency: 'medium'
  });

  if (!freelancer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Freelancer not found</h2>
          <p className="text-gray-600">Please select a freelancer to hire.</p>
          <Button onClick={() => navigate('/browse-freelancers')} className="mt-4">
            Browse Freelancers
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a direct hire gig (private gig for this freelancer)
      const gigData = {
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        category: 'direct-hire',
        location: freelancer.location || 'Remote',
        skillsRequired: freelancer.skills || [],
        status: 'in-progress' // Since we're directly hiring
      };

      const response = await gigService.createGig(gigData);
      
      // Create chat with freelancer
      await chatService.createChat(freelancer._id, response.gig._id);
      
      // Navigate to the project workspace
      navigate(`/client/project/${response.gig._id}`, {
        state: { message: 'Freelancer hired successfully!' }
      });
      
    } catch (error) {
      console.error('Failed to hire freelancer:', error);
      alert('Failed to create hiring proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Hire {freelancer.name}</h1>
              <p className="text-gray-600 mt-1">Create a direct hiring proposal</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Back
            </button>
          </div>

          {/* Freelancer Info */}
          <div className="bg-emerald-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                {freelancer.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{freelancer.name}</h3>
                <p className="text-sm text-gray-600">{freelancer.role}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <span>⭐ {freelancer.averageRating || 0}/5</span>
                  <span className="mx-2">•</span>
                  <span>{freelancer.completedProjects || 0} projects</span>
                  {freelancer.hourlyRate && (
                    <>
                      <span className="mx-2">•</span>
                      <span>₹{freelancer.hourlyRate}/hr</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hiring Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter a descriptive title for your project"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe what you need the freelancer to do..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type *
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget ({formData.projectType === 'hourly' ? '₹/hour' : 'Total ₹'}) *
                </label>
                <Input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder={formData.projectType === 'hourly' ? freelancer.hourlyRate || '500' : '10000'}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline *
                </label>
                <Input
                  type="text"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 weeks, 1 month"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="low">Low - Can wait</option>
                  <option value="medium">Medium - Normal priority</option>
                  <option value="high">High - Urgent</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">📋 What happens next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• A direct project will be created for {freelancer.name}</li>
                <li>• A chat will be started to discuss project details</li>
                <li>• The freelancer will be notified about your hiring proposal</li>
                <li>• You can track progress in your projects dashboard</li>
              </ul>
            </div>

            <div className="flex space-x-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating Proposal...' : `Hire ${freelancer.name}`}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HireFreelancer;