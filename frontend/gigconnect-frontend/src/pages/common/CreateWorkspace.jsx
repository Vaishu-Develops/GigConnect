import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workspaceService } from '../../services/workspaceService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/Loader';

const CreateWorkspace = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    allowMemberInvite: true,
    maxMembers: 50
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Workspace name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await workspaceService.createWorkspace({
        name: formData.name.trim(),
        description: formData.description.trim(),
        settings: {
          isPublic: formData.isPublic,
          allowMemberInvite: formData.allowMemberInvite,
          maxMembers: parseInt(formData.maxMembers)
        }
      });

      if (response.success) {
        alert('Workspace created successfully!');
        navigate(`/workspaces/${response.data._id}`);
      }
    } catch (error) {
      console.error('Create workspace error:', error);
      alert(error.response?.data?.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Workspace
          </h1>
          <p className="text-gray-600">
            Set up a collaborative space for your team or projects
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Workspace Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workspace Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Frontend Development Team"
                required
                maxLength={100}
              />
              <p className="text-sm text-gray-500 mt-1">
                Choose a clear, descriptive name for your workspace
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this workspace is for..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
              
              {/* Max Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Members
                </label>
                <select
                  name="maxMembers"
                  value={formData.maxMembers}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value={10}>10 members</option>
                  <option value={25}>25 members</option>
                  <option value={50}>50 members</option>
                  <option value={100}>100 members</option>
                </select>
              </div>

              {/* Public Workspace */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <div>
                  <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                    Make workspace public
                  </label>
                  <p className="text-sm text-gray-500">
                    Public workspaces can be discovered and joined by anyone
                  </p>
                </div>
              </div>

              {/* Allow Member Invites */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="allowMemberInvite"
                  name="allowMemberInvite"
                  checked={formData.allowMemberInvite}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <div>
                  <label htmlFor="allowMemberInvite" className="text-sm font-medium text-gray-700">
                    Allow admins to invite members
                  </label>
                  <p className="text-sm text-gray-500">
                    Let workspace admins invite new members
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/workspaces')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Workspace'
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Features Preview */}
        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What you'll get with your workspace:
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600">👥</span>
              </div>
              <span className="text-gray-700">Invite team members with roles</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">💼</span>
              </div>
              <span className="text-gray-700">Collaborate on projects & gigs</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">💬</span>
              </div>
              <span className="text-gray-700">Team communication tools</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600">📊</span>
              </div>
              <span className="text-gray-700">Shared analytics & insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;