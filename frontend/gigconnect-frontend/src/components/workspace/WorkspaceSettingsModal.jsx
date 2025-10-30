import React, { useState } from 'react';
import { workspaceService } from '../../services/workspaceService';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const WorkspaceSettingsModal = ({ isOpen, onClose, workspace, onWorkspaceUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: workspace?.name || '',
    description: workspace?.description || '',
    avatar: workspace?.avatar || '',
    settings: {
      allowMemberInvite: workspace?.settings?.allowMemberInvite || false,
      isPublic: workspace?.settings?.isPublic || false,
      allowFileSharing: workspace?.settings?.allowFileSharing || true,
      requireApproval: workspace?.settings?.requireApproval || false
    }
  });

  React.useEffect(() => {
    if (workspace) {
      setFormData({
        name: workspace.name || '',
        description: workspace.description || '',
        avatar: workspace.avatar || '',
        settings: {
          allowMemberInvite: workspace.settings?.allowMemberInvite || false,
          isPublic: workspace.settings?.isPublic || false,
          allowFileSharing: workspace.settings?.allowFileSharing || true,
          requireApproval: workspace.settings?.requireApproval || false
        }
      });
    }
  }, [workspace]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('settings.')) {
      const settingName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingName]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = async () => {
    if (!workspace) return;

    setLoading(true);
    try {
      const response = await workspaceService.updateWorkspace(workspace._id, formData);

      if (response.success) {
        alert('Workspace settings updated successfully!');
        onWorkspaceUpdated();
        onClose();
      }
    } catch (error) {
      console.error('Failed to update workspace settings:', error);
      alert(error.response?.data?.message || 'Failed to update workspace settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!workspace) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${workspace.name}"? This action cannot be undone and will remove all projects, members, and data associated with this workspace.`
    );
    
    if (!confirmed) return;

    const doubleConfirm = confirm(
      'This is your final warning. Type "DELETE" in the next prompt to confirm deletion.'
    );

    if (!doubleConfirm) return;

    const deleteConfirmation = prompt('Type "DELETE" to confirm workspace deletion:');
    if (deleteConfirmation !== 'DELETE') {
      alert('Deletion cancelled. You must type "DELETE" exactly.');
      return;
    }

    setLoading(true);
    try {
      const response = await workspaceService.deleteWorkspace(workspace._id);

      if (response.success) {
        alert('Workspace deleted successfully');
        // Redirect to workspaces list
        window.location.href = '/workspaces';
      }
    } catch (error) {
      console.error('Failed to delete workspace:', error);
      alert(error.response?.data?.message || 'Failed to delete workspace');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !workspace) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Workspace Settings
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'general', name: 'General', icon: '⚙️' },
              { id: 'members', name: 'Members', icon: '👥' },
              { id: 'permissions', name: 'Permissions', icon: '🔒' },
              { id: 'danger', name: 'Danger Zone', icon: '⚠️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">General Information</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter workspace name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Describe your workspace"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Member Management</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">Total Members</h5>
                      <p className="text-sm text-gray-600">Current workspace members</p>
                    </div>
                    <Badge variant="primary">{workspace.members?.length + 1 || 1}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">Pending Invitations</h5>
                      <p className="text-sm text-gray-600">Outstanding invites</p>
                    </div>
                    <Badge variant="yellow">0</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Workspace Permissions</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">Allow Member Invitations</h5>
                      <p className="text-sm text-gray-600">Let admins invite new members</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="settings.allowMemberInvite"
                        checked={formData.settings.allowMemberInvite}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">Public Workspace</h5>
                      <p className="text-sm text-gray-600">Make workspace discoverable</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="settings.isPublic"
                        checked={formData.settings.isPublic}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">File Sharing</h5>
                      <p className="text-sm text-gray-600">Allow file uploads and sharing</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="settings.allowFileSharing"
                        checked={formData.settings.allowFileSharing}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h4>
                
                <div className="space-y-4">
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h5 className="font-medium text-red-900 mb-2">Delete Workspace</h5>
                    <p className="text-sm text-red-700 mb-4">
                      Permanently delete this workspace and all its data. This action cannot be undone.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleDeleteWorkspace}
                      disabled={loading}
                      className="text-red-600 border-red-200 hover:bg-red-100"
                    >
                      Delete Workspace
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettingsModal;