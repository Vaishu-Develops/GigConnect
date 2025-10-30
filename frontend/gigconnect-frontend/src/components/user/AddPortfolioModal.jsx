import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { portfolioService } from '../../services/portfolioService';

const AddPortfolioModal = ({ isOpen, onClose, onPortfolioAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    projectUrl: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const newPortfolioItem = await portfolioService.createPortfolioItem(formData);
      
      if (newPortfolioItem.success) {
        alert('Portfolio item added successfully!');
        setFormData({
          title: '',
          description: '',
          category: '',
          projectUrl: '',
          imageUrl: ''
        });
        onPortfolioAdded(newPortfolioItem.data);
        onClose();
      } else {
        throw new Error(newPortfolioItem.message || 'Failed to add portfolio item');
      }
    } catch (error) {
      console.error('Failed to add portfolio item:', error);
      alert(error.message || 'Failed to add portfolio item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      projectUrl: '',
      imageUrl: ''
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Portfolio Item"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Enter project title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
            placeholder="Describe your project, technologies used, challenges solved..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            required
          >
            <option value="">Select a category</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Data Science">Data Science</option>
            <option value="Writing & Content">Writing & Content</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Video & Animation">Video & Animation</option>
            <option value="Business & Consulting">Business & Consulting</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project URL (Optional)
          </label>
          <input
            type="url"
            name="projectUrl"
            value={formData.projectUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="https://your-project-demo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL (Optional)
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="https://your-project-image.com/image.jpg"
          />
          <p className="text-sm text-gray-500 mt-1">
            Add a screenshot or preview image of your project
          </p>
        </div>

        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add to Portfolio'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPortfolioModal;