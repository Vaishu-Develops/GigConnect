import React, { useState } from 'react';
import { workspaceService } from '../../services/workspaceService';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const MemberManageModal = ({ isOpen, onClose, member, workspace, onMemberUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [newRole, setNewRole] = useState(member?.role || 'member');

  const handleRoleChange = async () => {
    if (!member || newRole === member.role) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      const response = await workspaceService.updateMemberRole(
        workspace._id, 
        member.user._id, 
        newRole
      );

      if (response.success) {
        alert(`${member.user.name}'s role has been updated to ${newRole}`);
        onMemberUpdated();
        onClose();
      }
    } catch (error) {
      console.error('Failed to update member role:', error);
      alert(error.response?.data?.message || 'Failed to update member role');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!member) return;

    const confirmed = confirm(`Are you sure you want to remove ${member.user.name} from this workspace?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await workspaceService.removeMember(workspace._id, member.user._id);

      if (response.success) {
        alert(`${member.user.name} has been removed from the workspace`);
        onMemberUpdated();
        onClose();
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      alert(error.response?.data?.message || 'Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !member) return null;

  const roleOptions = [
    { value: 'viewer', label: 'Viewer', description: 'Can view workspace content' },
    { value: 'member', label: 'Member', description: 'Can participate in projects' },
    { value: 'admin', label: 'Admin', description: 'Can manage workspace and members' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Member
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Member Info */}
          <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={(member.user.avatar && member.user.avatar.trim()) || '/robot.png'}
              alt={member.user.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h4 className="font-semibold text-gray-900">{member.user.name}</h4>
              <p className="text-sm text-gray-600">{member.user.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="gray">Current: {member.role}</Badge>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Change Role
            </label>
            <div className="space-y-3">
              {roleOptions.map((option) => (
                <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={newRole === option.value}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRoleChange}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Updating...' : 'Update Role'}
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={handleRemoveMember}
              disabled={loading}
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              Remove from Workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberManageModal;