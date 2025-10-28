import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contractService } from '../../services/contractService';
import { useAuth } from '../../context/AuthContext';
import { navigateToChat } from '../../utils/chatUtils';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/Loader';

const HireProposals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = await contractService.getContracts({ status: 'pending-acceptance' });
      setProposals(response.contracts || []);
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (contractId) => {
    try {
      setActionLoading({ ...actionLoading, [contractId]: 'accepting' });
      await contractService.acceptContract(contractId);
      
      // Update local state
      setProposals(proposals.map(proposal => 
        proposal._id === contractId 
          ? { ...proposal, status: 'accepted' }
          : proposal
      ));
      
      alert('Proposal accepted! You can now start working on this project.');
    } catch (error) {
      console.error('Failed to accept proposal:', error);
      alert(error.message || 'Failed to accept proposal');
    } finally {
      setActionLoading({ ...actionLoading, [contractId]: null });
    }
  };

  const handleDecline = async (contractId) => {
    const reason = prompt('Optional: Please provide a reason for declining:');
    
    try {
      setActionLoading({ ...actionLoading, [contractId]: 'declining' });
      await contractService.declineContract(contractId, reason);
      
      // Remove from local state
      setProposals(proposals.filter(proposal => proposal._id !== contractId));
      
      alert('Proposal declined.');
    } catch (error) {
      console.error('Failed to decline proposal:', error);
      alert(error.message || 'Failed to decline proposal');
    } finally {
      setActionLoading({ ...actionLoading, [contractId]: null });
    }
  };

  const formatBudget = (amount, budgetType) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
    
    return budgetType === 'hourly' ? `${formatted}/hr` : formatted;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Hire Proposals</h1>
          <p className="text-gray-600">
            Review and respond to direct hiring proposals from clients
          </p>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {proposals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">💼</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No hire proposals</h3>
              <p className="text-gray-600">
                You don't have any pending hire proposals at the moment.
              </p>
            </div>
          ) : (
            proposals.map((proposal) => (
              <div key={proposal._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    {/* Proposal Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {proposal.client?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {proposal.client?.name} wants to hire you
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(proposal.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Project Details */}
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {proposal.title}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {proposal.description}
                    </p>
                    
                    {/* Additional Requirements */}
                    {proposal.requirements && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-800 mb-1">Additional Requirements:</h5>
                        <p className="text-gray-600 text-sm">{proposal.requirements}</p>
                      </div>
                    )}
                    
                    {/* Contract Details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm text-gray-500">Budget</span>
                        <p className="font-semibold text-emerald-600">
                          {formatBudget(proposal.budget, proposal.budgetType)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Timeline</span>
                        <p className="font-medium text-gray-800">{proposal.timeline}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Budget Type</span>
                        <p className="font-medium text-gray-800 capitalize">{proposal.budgetType}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => handleAccept(proposal._id)}
                    disabled={actionLoading[proposal._id]}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {actionLoading[proposal._id] === 'accepting' ? 'Accepting...' : 'Accept Proposal'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDecline(proposal._id)}
                    disabled={actionLoading[proposal._id]}
                    className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                  >
                    {actionLoading[proposal._id] === 'declining' ? 'Declining...' : 'Decline'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigateToChat(proposal.client._id, navigate)}
                    disabled={actionLoading[proposal._id]}
                  >
                    Message Client
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HireProposals;