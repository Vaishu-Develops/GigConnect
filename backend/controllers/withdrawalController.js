import Withdrawal from '../models/Withdrawal.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

// Create withdrawal request
export const createWithdrawal = async (req, res) => {
  try {
    const { amount, bankDetails } = req.body;
    const freelancerId = req.user.id;

    console.log('=== WITHDRAWAL REQUEST DEBUG ===');
    console.log('User object:', req.user);
    console.log('Freelancer ID:', freelancerId);
    console.log('Requested amount:', amount);

    // Check if user is a freelancer
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only freelancers can create withdrawal requests' 
      });
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid withdrawal amount' 
      });
    }

    // Validate bank details
    if (!bankDetails || !bankDetails.accountNumber || !bankDetails.routingNumber || 
        !bankDetails.accountHolderName || !bankDetails.bankName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Complete bank details are required' 
      });
    }

    // Calculate available balance using the same logic as getUserPayments
    const freelancerIdForQuery = freelancerId || req.user._id;
    console.log('Using freelancer ID for query:', freelancerIdForQuery);
    
    const payments = await Payment.find({
      $or: [
        { freelancerId: freelancerIdForQuery, status: 'paid' },
        { freelancerId: freelancerIdForQuery, status: 'created' },
        { freelancerId: freelancerIdForQuery, status: 'attempted' }
      ]
    })
      .populate('gigId', 'title')
      .populate('contractId', 'title')
      .populate('clientId', 'name')
      .populate('freelancerId', 'name');

    console.log('All freelancer payments found:', payments.length);
    console.log('Sample payment:', payments[0]);

    let totalEarnings = 0;
    payments.forEach(payment => {
      console.log(`Payment ${payment._id}: amount=${payment.amount}, status=${payment.status}`);
      if (payment.status === 'paid' || payment.status === 'created' || payment.status === 'attempted') {
        // Platform takes 5%, freelancer gets 95%
        const earning = payment.amount * 0.95;
        totalEarnings += earning;
        console.log(`Added earning: ${earning}, total now: ${totalEarnings}`);
      }
    });

    console.log('Total earnings calculated:', totalEarnings);

    // Get total withdrawn amount
    const withdrawals = await Withdrawal.find({
      freelancer: freelancerIdForQuery,
      status: { $in: ['pending', 'processing', 'completed'] }
    });

    console.log('Previous withdrawals found:', withdrawals.length);
    const totalWithdrawn = withdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);
    const availableBalance = totalEarnings - totalWithdrawn;

    console.log('Total withdrawn:', totalWithdrawn);
    console.log('Available balance:', availableBalance);
    console.log('Requested amount:', amount);

    // Check if user has sufficient balance
    if (amount > availableBalance) {
      console.log('INSUFFICIENT BALANCE - Rejecting withdrawal');
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient balance. Available: ₹${availableBalance.toFixed(2)}` 
      });
    }

    // Create withdrawal request
    const withdrawal = new Withdrawal({
      freelancer: freelancerId,
      amount,
      bankDetails,
      status: 'pending'
    });

    await withdrawal.save();

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: {
        transactionId: withdrawal.transactionId,
        amount: withdrawal.amount,
        status: withdrawal.status,
        createdAt: withdrawal.createdAt
      }
    });
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create withdrawal request' 
    });
  }
};

// Get user's withdrawal history
export const getUserWithdrawals = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    
    // Check if user is a freelancer
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only freelancers can access withdrawal history' 
      });
    }
    
    const withdrawals = await Withdrawal.find({ freelancer: freelancerId })
      .sort({ createdAt: -1 })
      .select('-bankDetails.accountNumber -bankDetails.routingNumber'); // Hide sensitive info

    res.json({
      success: true,
      data: withdrawals
    });
  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch withdrawal history' 
    });
  }
};

// Get withdrawal by ID
export const getWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const freelancerId = req.user.id;
    
    // Check if user is a freelancer
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only freelancers can access withdrawals' 
      });
    }
    
    const withdrawal = await Withdrawal.findOne({ 
      _id: id, 
      freelancer: freelancerId 
    }).select('-bankDetails.accountNumber -bankDetails.routingNumber');

    if (!withdrawal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Withdrawal not found' 
      });
    }

    res.json({
      success: true,
      data: withdrawal
    });
  } catch (error) {
    console.error('Get withdrawal error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch withdrawal' 
    });
  }
};

// Cancel withdrawal (only pending withdrawals)
export const cancelWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const freelancerId = req.user.id;
    
    // Check if user is a freelancer
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only freelancers can cancel withdrawals' 
      });
    }
    
    const withdrawal = await Withdrawal.findOne({ 
      _id: id, 
      freelancer: freelancerId,
      status: 'pending'
    });

    if (!withdrawal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pending withdrawal not found' 
      });
    }

    withdrawal.status = 'cancelled';
    await withdrawal.save();

    res.json({
      success: true,
      message: 'Withdrawal cancelled successfully',
      data: withdrawal
    });
  } catch (error) {
    console.error('Cancel withdrawal error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel withdrawal' 
    });
  }
};