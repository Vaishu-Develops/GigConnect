import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { contractService } from '../../services/contractService';
import { useAuth } from '../../context/AuthContext';
import { navigateToChat } from '../../utils/chatUtils';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/Loader';

const Contracts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');

  // Show success message if redirected from hire page
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
      
      // If refreshData flag is set, refresh the contracts list
      if (location.state?.refreshData) {
        fetchContracts();
      }
    }
  }, [location.state]);

  useEffect(() => {
    fetchContracts();
  }, [filter]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await contractService.getContracts({ type: filter });
      setContracts(response.contracts || []);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending-acceptance': 'bg-yellow-100 text-yellow-800',
      'accepted': 'bg-green-100 text-green-800',
      'declined': 'bg-red-100 text-red-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-emerald-100 text-emerald-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'pending-acceptance': 'Pending Response',
      'accepted': 'Accepted',
      'declined': 'Declined',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusTexts[status] || status;
  };

  const tabs = [
    { key: 'all', label: 'All Contracts' },
    { key: 'pending', label: 'Pending' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' }
  ];

  const filteredContracts = contracts.filter(contract => {
    if (filter === 'all') return true;
    if (filter === 'pending') return contract.status === 'pending-acceptance';
    if (filter === 'active') return ['accepted', 'in-progress'].includes(contract.status);
    if (filter === 'completed') return contract.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Success Message */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Contracts</h1>
          <p className="text-gray-600">
            {user?.role === 'client' 
              ? 'Manage your hiring proposals and active contracts' 
              : 'View proposals and manage your freelance contracts'
            }
          </p>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contracts List */}
        <div className="space-y-4">
          {filteredContracts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No contracts found</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? "You haven't created any contracts yet"
                  : `No ${filter} contracts found`
                }
              </p>
              {user?.role === 'client' && (
                <Button onClick={() => window.location.href = '/browse-freelancers'}>
                  Browse Freelancers
                </Button>
              )}
            </div>
          ) : (
            filteredContracts.map((contract) => (
              <div key={contract._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {contract.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {contract.description}
                    </p>
                    
                    {/* Contract Details */}
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        💰 {formatBudget(contract.budget)} 
                        {contract.budgetType === 'hourly' && '/hr'}
                      </span>
                      <span className="flex items-center">
                        ⏱️ {contract.timeline}
                      </span>
                      <span className="flex items-center">
                        📅 {formatDate(contract.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                      {getStatusText(contract.status)}
                    </span>
                  </div>
                </div>

                {/* Freelancer/Client Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    {user?.role === 'client' ? (
                      <>
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
                          {contract.freelancer?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{contract.freelancer?.name}</p>
                          <p className="text-sm text-gray-600">Freelancer</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                          {contract.client?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{contract.client?.name}</p>
                          <p className="text-sm text-gray-600">Client</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => navigate(`/contracts/${contract._id}`)}
                    >
                      View Details
                    </Button>
                    {contract.status === 'accepted' && (
                      <Button 
                        size="sm"
                        onClick={() => navigateToChat(user?.role === 'client' ? contract.freelancer?._id : contract.client?._id, navigate)}
                      >
                        Message
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Contracts;