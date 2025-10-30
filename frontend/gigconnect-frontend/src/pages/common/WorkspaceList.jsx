import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workspaceService } from '../../services/workspaceService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/Loader';

const WorkspaceList = () => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching workspace data...');
      
      // Fetch workspaces and invitations separately to handle individual failures
      let workspacesData = { data: [] };
      let invitationsData = { data: [] };

      try {
        workspacesData = await workspaceService.getUserWorkspaces();
        console.log('Workspaces fetched:', workspacesData);
      } catch (workspaceError) {
        console.error('Failed to fetch workspaces:', workspaceError);
      }

      try {
        invitationsData = await workspaceService.getUserInvitations();
        console.log('Invitations fetched:', invitationsData);
      } catch (invitationError) {
        console.error('Failed to fetch invitations:', invitationError);
      }

      setWorkspaces(workspacesData.data || []);
      setInvitations(invitationsData.data || []);
    } catch (error) {
      console.error('Failed to fetch workspace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (token) => {
    try {
      const response = await workspaceService.acceptInvitation(token);
      if (response.success) {
        alert('Successfully joined workspace!');
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Accept invitation error:', error);
      alert(error.response?.data?.message || 'Failed to accept invitation');
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'success',
      member: 'primary',
      viewer: 'gray'
    };
    return colors[role] || 'gray';
  };

  const getUserRole = (workspace) => {
    if (workspace.owner._id === user._id) return 'Owner';
    const member = workspace.members.find(m => m.user._id === user._id);
    return member ? member.role : 'Member';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
            <p className="text-gray-600 mt-2">
              Collaborate with your team on projects and gigs
            </p>
          </div>
          <Button as={Link} to="/workspaces/create">
            Create Workspace
          </Button>
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pending Invitations
            </h2>
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation._id}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {invitation.workspace.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {invitation.workspace.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Invited by {invitation.invitedBy.name} as{' '}
                            <Badge variant={getRoleColor(invitation.role)} size="sm">
                              {invitation.role}
                            </Badge>
                          </p>
                          {invitation.message && (
                            <p className="text-sm text-gray-600 mt-1 italic">
                              "{invitation.message}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptInvitation(invitation.token)}
                      >
                        Accept
                      </Button>
                      <Button size="sm" variant="outline">
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workspaces Grid */}
        {workspaces.length === 0 && invitations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No workspaces yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first workspace to start collaborating with your team
            </p>
            <Button as={Link} to="/workspaces/create">
              Create Your First Workspace
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <Link
                key={workspace._id}
                to={`/workspaces/${workspace._id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                    {workspace.avatar ? (
                      <img
                        src={workspace.avatar}
                        alt={workspace.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {workspace.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <Badge variant={getRoleColor(getUserRole(workspace).toLowerCase())}>
                    {getUserRole(workspace)}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {workspace.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {workspace.description || 'No description provided'}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {workspace.memberCount} member{workspace.memberCount !== 1 ? 's' : ''}
                    </span>
                    <span>
                      {workspace.stats.totalProjects} project{workspace.stats.totalProjects !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Members Preview */}
                <div className="flex items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="flex -space-x-2">
                    {workspace.members.slice(0, 3).map((member, index) => (
                      <img
                        key={member.user._id}
                        src={member.user.avatar || '/default-avatar.png'}
                        alt={member.user.name}
                        className="w-6 h-6 rounded-full border-2 border-white"
                      />
                    ))}
                    {workspace.memberCount > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          +{workspace.memberCount - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="ml-3 text-xs text-gray-500">
                    {workspace.memberCount > 1 ? 'Team members' : 'Solo workspace'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceList;