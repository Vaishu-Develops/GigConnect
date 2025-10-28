import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { contractService } from '../../services/contractService';
import { useAuth } from '../../context/AuthContext';
import { navigateToChat } from '../../utils/chatUtils';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/Loader';

const ContractDetails = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (contractId) {
      fetchContract();
    }
  }, [contractId]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const response = await contractService.getContract(contractId);
      if (response.success) {
        setContract(response.contract);
      }
    } catch (error) {
      console.error('Failed to fetch contract:', error);
      alert('Failed to load contract details');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      setActionLoading(true);
      await contractService.acceptContract(contractId);
      setContract(prev => ({ ...prev, status: 'accepted', acceptedAt: new Date() }));
      alert('Contract accepted successfully!');
    } catch (error) {
      console.error('Failed to accept contract:', error);
      alert(error.message || 'Failed to accept contract');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    const reason = prompt('Please provide a reason for declining (optional):');
    
    try {
      setActionLoading(true);
      await contractService.declineContract(contractId, reason);
      setContract(prev => ({ ...prev, status: 'declined' }));
      alert('Contract declined.');
    } catch (error) {
      console.error('Failed to decline contract:', error);
      alert(error.message || 'Failed to decline contract');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setActionLoading(true);
      await contractService.updateContractStatus(contractId, newStatus);
      setContract(prev => ({ ...prev, status: newStatus }));
      alert(`Contract status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(error.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending-acceptance': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'accepted': 'bg-green-100 text-green-800 border-green-200',
      'declined': 'bg-red-100 text-red-800 border-red-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'cancelled': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'pending-acceptance': 'Pending Your Response',
      'accepted': 'Accepted',
      'declined': 'Declined',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusTexts[status] || status;
  };

  const isClient = user && contract && user._id === contract.client?._id;
  const isFreelancer = user && contract && user._id === contract.freelancer?._id;
  const otherParty = isClient ? contract?.freelancer : contract?.client;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Contract not found</h2>
          <p className="text-gray-600 mb-4">The contract you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-800 text-sm mb-2"
              >
                ← Back to {isClient ? 'My Contracts' : 'Hire Proposals'}
              </button>
              <h1 className="text-2xl font-bold text-gray-800">{contract.title}</h1>
              <p className="text-gray-600 mt-1">
                Contract Details - {isClient ? 'Your hiring proposal' : 'Direct hire offer'}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(contract.status)}`}>
              {getStatusText(contract.status)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Description</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{contract.description}</p>
              
              {contract.requirements && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Additional Requirements:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{contract.requirements}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contract Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Contract Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Budget</h3>
                  <p className="text-xl font-bold text-emerald-600">
                    {formatBudget(contract.budget, contract.budgetType)}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{contract.budgetType} price</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Timeline</h3>
                  <p className="text-lg font-semibold text-gray-800">{contract.timeline}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                  <p className="text-gray-800">{formatDate(contract.createdAt)}</p>
                </div>
                
                {contract.acceptedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Accepted</h3>
                    <p className="text-gray-800">{formatDate(contract.acceptedAt)}</p>
                  </div>
                )}
                
                {contract.startDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Start Date</h3>
                    <p className="text-gray-800">{formatDate(contract.startDate)}</p>
                  </div>
                )}
                
                {contract.completedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Completed</h3>
                    <p className="text-gray-800">{formatDate(contract.completedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Milestones */}
            {contract.milestones && contract.milestones.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Milestones</h2>
                <div className="space-y-4">
                  {contract.milestones.map((milestone, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{milestone.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                          {milestone.dueDate && (
                            <p className="text-gray-500 text-sm mt-2">Due: {formatDate(milestone.dueDate)}</p>
                          )}
                        </div>
                        {milestone.amount && (
                          <div className="text-right">
                            <p className="font-semibold text-emerald-600">
                              {formatBudget(milestone.amount, 'fixed')}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded ${
                              milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                              milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {milestone.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Other Party Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {isClient ? 'Freelancer' : 'Client'}
              </h2>
              
              {otherParty && (
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {otherParty.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{otherParty.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{otherParty.role}</p>
                    {otherParty.avgRating && (
                      <p className="text-sm text-gray-600">⭐ {otherParty.avgRating}/5</p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => navigateToChat(otherParty?._id, navigate)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  💬 Message {isClient ? 'Freelancer' : 'Client'}
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/user/${otherParty?._id}`)}
                  className="w-full"
                >
                  👤 View Profile
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions</h2>
              
              <div className="space-y-3">
                {/* Freelancer Actions */}
                {isFreelancer && contract.status === 'pending-acceptance' && (
                  <>
                    <Button
                      onClick={handleAccept}
                      disabled={actionLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      {actionLoading ? '⏳ Accepting...' : '✅ Accept Proposal'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleDecline}
                      disabled={actionLoading}
                      className="w-full border-red-600 text-red-600 hover:bg-red-50"
                    >
                      {actionLoading ? '⏳ Declining...' : '❌ Decline Proposal'}
                    </Button>
                  </>
                )}

                {/* Both parties actions for accepted contracts */}
                {contract.status === 'accepted' && (
                  <Button
                    onClick={() => handleStatusUpdate('in-progress')}
                    disabled={actionLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    🚀 Start Project
                  </Button>
                )}

                {contract.status === 'in-progress' && (
                  <Button
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={actionLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    ✅ Mark as Completed
                  </Button>
                )}

                {/* Cancel option */}
                {['pending-acceptance', 'accepted', 'in-progress'].includes(contract.status) && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this contract?')) {
                        handleStatusUpdate('cancelled');
                      }
                    }}
                    disabled={actionLoading}
                    className="w-full border-red-600 text-red-600 hover:bg-red-50"
                  >
                    🗑️ Cancel Contract
                  </Button>
                )}
              </div>
            </div>

            {/* Contract Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Timeline</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Contract created: {formatDate(contract.createdAt)}</span>
                </div>
                
                {contract.acceptedAt && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Accepted: {formatDate(contract.acceptedAt)}</span>
                  </div>
                )}
                
                {contract.completedAt && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-600">Completed: {formatDate(contract.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;