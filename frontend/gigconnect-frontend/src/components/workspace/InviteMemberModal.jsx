import React, { useState } from 'react';
import { workspaceService } from '../../services/workspaceService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/Loader';

const InviteMemberModal = ({ workspace, isOpen, onClose, onInviteSent }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'member',
    message: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      alert('Email is required');
      return;
    }

    setLoading(true);
    try {
      const response = await workspaceService.inviteMember(workspace._id, {
        email: formData.email.trim(),
        role: formData.role,
        message: formData.message.trim()
      });

      if (response.success) {
        const message = response.message.includes('updated') 
          ? 'Invitation updated and resent successfully!' 
          : 'Invitation sent successfully!';
        
        alert(message);
        setFormData({ email: '', role: 'member', message: '' });
        onInviteSent();
        onClose();
      }
    } catch (error) {
      console.error('Invite member error:', error);
      
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already pending')) {
        const shouldResend = confirm(
          'An invitation is already pending for this email. Would you like to resend/update it?'
        );
        
        if (shouldResend) {
          // Try again - the backend will now update existing invitations
          handleSubmit(e);
          return;
        }
      }
      
      alert(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Invite Member to {workspace.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="colleague@example.com"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                We'll send an invitation to this email address
              </p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="viewer">Viewer - Can view workspace content</option>
                <option value="member">Member - Can participate and contribute</option>
                <option value="admin">Admin - Can manage workspace and members</option>
              </select>
            </div>

            {/* Personal Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Add a personal note to your invitation..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.message.length}/500 characters
              </p>
            </div>

            {/* Role Permissions Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Role Permissions</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="w-16 font-medium">Viewer:</span>
                  <span>View projects, read messages, see members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-16 font-medium">Member:</span>
                  <span>All viewer permissions + create/edit content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-16 font-medium">Admin:</span>
                  <span>All member permissions + invite/manage members</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.email.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Invitation'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteMemberModal;