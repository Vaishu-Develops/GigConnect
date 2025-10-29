import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { formatCurrency } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/Loader';
import { useAuth } from '../../context/AuthContext';

const Earnings = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingBalance: 0,
    availableBalance: 0,
    completedProjects: 0
  });

  useEffect(() => {
    if (user) {
      fetchEarnings();
    }
  }, [user]);

  const fetchEarnings = async () => {
    try {
      const paymentsData = await paymentService.getUserPayments();
      console.log('All payments received:', paymentsData.payments);
      setPayments(paymentsData.payments || []);
      calculateStats(paymentsData.payments || []);
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (paymentsData) => {
    console.log('Calculating stats for payments:', paymentsData);
    console.log('Current user from context:', user);
    
    if (!user || !user._id) {
      console.error('No current user found!');
      setStats({
        totalEarnings: 0,
        pendingBalance: 0,
        availableBalance: 0,
        completedProjects: 0
      });
      return;
    }
    
    // Filter payments where current user is the freelancer (receiving money)
    const myPayments = paymentsData.filter(p => {
      const freelancerId = p.freelancerId?._id || p.freelancerId;
      const isFreelancer = freelancerId === user._id;
      console.log(`Payment ${p._id}: freelancerId=${freelancerId}, currentUserId=${user._id}, isFreelancer=${isFreelancer}`);
      return isFreelancer;
    });
    
    console.log('Filtered freelancer payments:', myPayments);
    
    const paidPayments = myPayments.filter(p => p.status === 'paid');
    const pendingPayments = myPayments.filter(p => ['created', 'attempted'].includes(p.status));
    
    console.log('Paid payments:', paidPayments);
    console.log('Pending payments:', pendingPayments);
    
    const totalEarnings = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const pendingBalance = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    console.log('Total earnings before fee:', totalEarnings);
    console.log('Pending balance before fee:', pendingBalance);
    
    // Platform takes 5% fee, so freelancer gets 95%
    const platformFeeRate = 0.05;
    const freelancerEarnings = totalEarnings * (1 - platformFeeRate);
    
    const calculatedStats = {
      totalEarnings: freelancerEarnings,
      pendingBalance: pendingBalance * (1 - platformFeeRate),
      availableBalance: freelancerEarnings, // In real app, this would subtract withdrawn amounts
      completedProjects: paidPayments.length
    };
    
    console.log('Calculated stats:', calculatedStats);
    setStats(calculatedStats);
  };

  const getStatusColor = (status) => {
    const colors = {
      'paid': 'success',
      'created': 'accent',
      'attempted': 'accent', 
      'failed': 'error',
      'refunded': 'gray'
    };
    return colors[status] || 'gray';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600 mt-2">
            Track your earnings and payment history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-2">
              {formatCurrency(stats.availableBalance)}
            </div>
            <div className="text-gray-600">Available Balance</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-amber-600 mb-2">
              {formatCurrency(stats.pendingBalance)}
            </div>
            <div className="text-gray-600">Pending Clearance</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {stats.completedProjects}
            </div>
            <div className="text-gray-600">Completed Projects</div>
          </div>
        </div>

        {/* Withdrawal Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Funds</h3>
          <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  max={stats.availableBalance}
                />
                <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                  Withdraw
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Available: {formatCurrency(stats.availableBalance)}
              </p>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No payments yet
              </h3>
              <p className="text-gray-600">
                Your payment history will appear here once you complete projects.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <div key={payment._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {payment.gigId?.title || 'Project Payment'}
                        </h4>
                        <Badge variant={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Client: {payment.clientId?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">
                        {formatCurrency(payment.amount)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Order: #{payment.orderId}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Earnings;