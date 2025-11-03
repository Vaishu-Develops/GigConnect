import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { formatCurrency } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/Loader';
import { useAuth } from '../../context/AuthContext';

const Earnings = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
    bankName: ''
  });
  const [showBankForm, setShowBankForm] = useState(false);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
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
      
      // Also fetch withdrawals to calculate correct available balance
      const withdrawalsData = await paymentService.getWithdrawals();
      console.log('Withdrawals received:', withdrawalsData.data);
      setWithdrawals(withdrawalsData.data || []);
      
      calculateStats(paymentsData.payments || [], withdrawalsData.data || []);
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
      // If withdrawals fail, still calculate with empty withdrawals
      try {
        const paymentsData = await paymentService.getUserPayments();
        setPayments(paymentsData.payments || []);
        calculateStats(paymentsData.payments || [], []);
      } catch (paymentError) {
        console.error('Failed to fetch payments:', paymentError);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (paymentsData, withdrawalsData = []) => {
    console.log('Calculating stats for payments:', paymentsData);
    console.log('Calculating stats for withdrawals:', withdrawalsData);
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
    
    // Calculate total withdrawn amount (pending, processing, completed withdrawals)
    const totalWithdrawn = withdrawalsData
      .filter(withdrawal => ['pending', 'processing', 'completed'].includes(withdrawal.status))
      .reduce((sum, withdrawal) => sum + withdrawal.amount, 0);
    
    console.log('Total withdrawn amount:', totalWithdrawn);
    
    const calculatedStats = {
      totalEarnings: freelancerEarnings,
      pendingBalance: pendingBalance * (1 - platformFeeRate),
      availableBalance: freelancerEarnings - totalWithdrawn, // Subtract withdrawn amounts
      completedProjects: paidPayments.length
    };
    
    console.log('Calculated stats:', calculatedStats);
    setStats(calculatedStats);
  };

  const handleWithdrawClick = () => {
    if (stats.availableBalance <= 0) {
      alert('No funds available for withdrawal');
      return;
    }
    setShowBankForm(true);
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || withdrawalAmount <= 0) {
      alert('Please enter a valid withdrawal amount');
      return;
    }

    if (parseFloat(withdrawalAmount) > stats.availableBalance) {
      alert(`Withdrawal amount cannot exceed available balance of ${formatCurrency(stats.availableBalance)}`);
      return;
    }

    if (!bankDetails.accountNumber || !bankDetails.routingNumber || 
        !bankDetails.accountHolderName || !bankDetails.bankName) {
      alert('Please fill in all bank details');
      return;
    }

    setWithdrawalLoading(true);
    try {
      const withdrawalData = {
        amount: parseFloat(withdrawalAmount),
        bankDetails
      };

      const response = await paymentService.createWithdrawal(withdrawalData);
      
      if (response.success) {
        alert(`Withdrawal request submitted successfully! Transaction ID: ${response.data.transactionId}`);
        setWithdrawalAmount('');
        setBankDetails({
          accountNumber: '',
          routingNumber: '',
          accountHolderName: '',
          bankName: ''
        });
        setShowBankForm(false);
        // Refresh earnings to reflect the withdrawal
        fetchEarnings();
      } else {
        alert('Failed to submit withdrawal request');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert(error.response?.data?.message || 'Failed to submit withdrawal request');
    } finally {
      setWithdrawalLoading(false);
    }
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

  const getWithdrawalStatusColor = (status) => {
    const colors = {
      'pending': 'accent',
      'processing': 'accent',
      'completed': 'success',
      'failed': 'error',
      'cancelled': 'gray'
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
          
          {!showBankForm ? (
            <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    max={stats.availableBalance}
                    min="1"
                  />
                  <button 
                    onClick={handleWithdrawClick}
                    disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0 || parseFloat(withdrawalAmount) > stats.availableBalance}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Available: {formatCurrency(stats.availableBalance)}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Withdrawal Amount: <span className="font-semibold">{formatCurrency(parseFloat(withdrawalAmount))}</span></p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={bankDetails.accountHolderName}
                    onChange={handleBankDetailsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Full name as on account"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={bankDetails.bankName}
                    onChange={handleBankDetailsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Bank name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={handleBankDetailsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Account number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    name="routingNumber"
                    value={bankDetails.routingNumber}
                    onChange={handleBankDetailsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Routing number"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowBankForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleWithdrawal}
                  disabled={withdrawalLoading}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  {withdrawalLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Submit Withdrawal'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payment & Withdrawal History</h3>
          </div>

          {(() => {
            // Combine payments and withdrawals into a single list
            const allTransactions = [
              ...payments.map(payment => ({
                ...payment,
                type: 'payment',
                date: payment.createdAt,
                title: payment.gigId?.title || 'Project Payment',
                client: payment.clientId?.name,
                amount: payment.amount,
                status: payment.status,
                orderId: payment.orderId,
                id: payment._id
              })),
              ...withdrawals.map(withdrawal => ({
                ...withdrawal,
                type: 'withdrawal',
                date: withdrawal.createdAt,
                title: 'Withdrawal',
                amount: withdrawal.amount,
                status: withdrawal.status,
                transactionId: withdrawal.transactionId,
                id: withdrawal._id
              }))
            ];

            // Sort by date (newest first)
            allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (allTransactions.length === 0) {
              return (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No transactions yet
                  </h3>
                  <p className="text-gray-600">
                    Your payment and withdrawal history will appear here.
                  </p>
                </div>
              );
            }

            return (
              <div className="divide-y divide-gray-200">
                {allTransactions.map((transaction) => (
                  <div key={`${transaction.type}-${transaction.id}`} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {transaction.type === 'payment' ? (
                              <span className="text-green-600">↓</span>
                            ) : (
                              <span className="text-blue-600">↑</span>
                            )}
                            <h4 className="font-semibold text-gray-900">
                              {transaction.title}
                            </h4>
                          </div>
                          <Badge variant={
                            transaction.type === 'payment' 
                              ? getStatusColor(transaction.status)
                              : getWithdrawalStatusColor(transaction.status)
                          }>
                            {transaction.status}
                          </Badge>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                            {transaction.type}
                          </span>
                        </div>
                        {transaction.type === 'payment' && transaction.client && (
                          <p className="text-sm text-gray-600">
                            Client: {transaction.client}
                          </p>
                        )}
                        {transaction.type === 'withdrawal' && transaction.bankDetails && (
                          <p className="text-sm text-gray-600">
                            Bank: {transaction.bankDetails.bankName} (****{transaction.bankDetails.accountNumber?.slice(-4)})
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()} at {new Date(transaction.date).toLocaleTimeString()}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          transaction.type === 'payment' ? 'text-emerald-600' : 'text-blue-600'
                        }`}>
                          {transaction.type === 'payment' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {transaction.type === 'payment' 
                            ? `Order: #${transaction.orderId}` 
                            : `ID: ${transaction.transactionId}`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Earnings;