import React, { useState, useEffect } from 'react';
import { workspaceService } from '../../services/workspaceService';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/Loader';

const InvitationTester = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await workspaceService.getUserInvitations();
      setInvitations(response.data || []);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (token) => {
    try {
      const response = await workspaceService.acceptInvitation(token);
      if (response.success) {
        alert('Successfully joined workspace!');
        fetchInvitations(); // Refresh
      }
    } catch (error) {
      console.error('Accept invitation error:', error);
      alert(error.response?.data?.message || 'Failed to accept invitation');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          🧪 Invitation Tester (Development Only)
        </h1>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800">Testing Invitations</h3>
          <p className="text-yellow-700 text-sm">
            Since email sending isn't implemented yet, you can use this page to test accepting invitations.
            Invitations are automatically created when someone invites you to their workspace.
          </p>
        </div>

        {invitations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No pending invitations
            </h3>
            <p className="text-gray-600">
              When someone invites you to a workspace, the invitation will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div
                key={invitation._id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Invitation to {invitation.workspace.name}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Invited by {invitation.invitedBy.name} ({invitation.invitedBy.email})
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Role: <span className="font-medium">{invitation.role}</span>
                    </p>
                    {invitation.message && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-emerald-500">
                        <p className="text-sm text-gray-700 italic">"{invitation.message}"</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-3">
                      Token: <code className="bg-gray-100 px-2 py-1 rounded">{invitation.token}</code>
                    </p>
                  </div>
                  
                  <div className="ml-6">
                    <Button
                      onClick={() => handleAccept(invitation.token)}
                      size="sm"
                    >
                      Accept Invitation
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">How to Test:</h3>
          <ol className="list-decimal list-inside text-blue-700 text-sm space-y-1">
            <li>Create a workspace from your account</li>
            <li>Invite someone (any email address)</li>
            <li>Login as the person you invited (create account with that email)</li>
            <li>Visit this page to see and accept the invitation</li>
            <li>You'll be added to the workspace automatically</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default InvitationTester;