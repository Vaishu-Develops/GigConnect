import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { contractService } from '../../services/contractService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const DirectHire = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { freelancer, mode } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    budgetType: 'fixed', // fixed or hourly
    timeline: '',
    requirements: '',
    startDate: ''
  });

  const [errors, setErrors] = useState({});

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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.description.trim()) newErrors.description = 'Project description is required';
    if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Valid budget is required';
    if (!formData.timeline.trim()) newErrors.timeline = 'Timeline is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Check if freelancer data is available
    if (!freelancer || !freelancer._id) {
      alert('Freelancer information is missing. Please go back and try again.');
      return;
    }
    
    setLoading(true);

    try {
      // Create direct hire contract
      const contractData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: parseFloat(formData.budget),
        budgetType: formData.budgetType,
        timeline: formData.timeline.trim(),
        requirements: formData.requirements.trim(),
        freelancerId: freelancer._id,
        startDate: formData.startDate || null,
        contractType: 'direct-hire'
      };

      const response = await contractService.createContract(contractData);
      
      if (response.success) {
        // Navigate to contracts page with success message
        navigate('/client/contracts', {
          state: { 
            message: `Hire proposal sent to ${freelancer.name}!`,
            type: 'success'
          }
        });
      }
      
    } catch (error) {
      console.error('Failed to create hire proposal:', error);
      alert(error.message || 'Failed to send hire proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatRate = (rate) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(rate);
  };

  const budgetPlaceholder = formData.budgetType === 'fixed' 
    ? 'Total project budget (₹)' 
    : 'Estimated hours';

  const budgetLabel = formData.budgetType === 'fixed' 
    ? 'Total Budget (₹)' 
    : `Estimated Hours (@ ${formatRate(freelancer.hourlyRate || 0)}/hr)`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Hire {freelancer.name}</h1>
              <p className="text-gray-600 mt-1">Send a direct hiring proposal</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Back
            </button>
          </div>

          {/* Freelancer Info Card */}
          <div className="bg-emerald-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {freelancer.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{freelancer.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{freelancer.role}</p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <span>⭐ {freelancer.avgRating || 0}/5</span>
                  <span className="mx-2">•</span>
                  <span>{freelancer.completedProjects || 0} projects</span>
                  {freelancer.hourlyRate && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="font-medium text-emerald-600">
                        {formatRate(freelancer.hourlyRate)}/hour
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Skills */}
            {freelancer.skills && freelancer.skills.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.slice(0, 5).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {freelancer.skills.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{freelancer.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Project Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., E-commerce Website Development"
                error={errors.title}
                className="w-full"
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe what you need the freelancer to do..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Budget Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Type *
                </label>
                <select
                  name="budgetType"
                  value={formData.budgetType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {budgetLabel} *
                </label>
                <Input
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder={budgetPlaceholder}
                  error={errors.budget}
                  className="w-full"
                />
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeline *
              </label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.timeline ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select timeline</option>
                <option value="1-3 days">1-3 days</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="2-3 months">2-3 months</option>
                <option value="3+ months">3+ months</option>
                <option value="ongoing">Ongoing</option>
              </select>
              {errors.timeline && (
                <p className="mt-1 text-sm text-red-600">{errors.timeline}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Start Date (Optional)
              </label>
              <Input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements (Optional)
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Any specific requirements, technologies, or deliverables..."
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {freelancer.name} will receive your hiring proposal</li>
                <li>• They can accept, decline, or negotiate terms</li>
                <li>• Once accepted, you can start working together</li>
                <li>• This is a private contract (not posted publicly)</li>
                <li>• You'll be able to track progress and communicate directly</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? 'Sending Proposal...' : 'Send Hire Proposal'}
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

export default DirectHire;