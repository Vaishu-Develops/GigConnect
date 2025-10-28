import { useState, useEffect } from 'react';
import { contractService } from '../services/contractService';
import { useAuth } from '../context/AuthContext';

export const useContractNotifications = () => {
  const { user } = useAuth();
  const [pendingProposals, setPendingProposals] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'freelancer') {
      fetchPendingProposals();
    }
  }, [user]);

  const fetchPendingProposals = async () => {
    try {
      setLoading(true);
      const response = await contractService.getContracts({ status: 'pending-acceptance' });
      setPendingProposals(response.contracts?.length || 0);
    } catch (error) {
      console.error('Failed to fetch pending proposals:', error);
      setPendingProposals(0);
    } finally {
      setLoading(false);
    }
  };

  const refreshProposals = () => {
    if (user && user.role === 'freelancer') {
      fetchPendingProposals();
    }
  };

  return {
    pendingProposals,
    loading,
    refreshProposals
  };
};