import getRazorpayInstance from '../config/razorpay.js';
import Payment from '../models/Payment.js';
import Gig from '../models/Gig.js';
import Contract from '../models/Contract.js';
import User from '../models/User.js';
import crypto from 'crypto';

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { gigId, contractId, amount, type = 'gig' } = req.body;

    let itemData, clientId, freelancerId, itemTitle;

    if (type === 'contract') {
      // Validate contract exists
      const contract = await Contract.findById(contractId).populate('client freelancer', 'name email');
      if (!contract) {
        return res.status(404).json({ 
          success: false,
          message: 'Contract not found' 
        });
      }

      // Check if user is the client of this contract
      if (contract.client._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false,
          message: 'Not authorized to pay for this contract' 
        });
      }

      // Check if contract is completed
      if (contract.status !== 'completed') {
        return res.status(400).json({ 
          success: false,
          message: 'Contract must be completed before payment' 
        });
      }

      itemData = contract;
      clientId = contract.client._id;
      freelancerId = contract.freelancer._id;
      itemTitle = contract.title;
    } else {
      // Validate gig exists
      const gig = await Gig.findById(gigId).populate('client', 'name email');
      if (!gig) {
        return res.status(404).json({ 
          success: false,
          message: 'Gig not found' 
        });
      }

      // Check if user is the client of this gig
      if (gig.client._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false,
          message: 'Not authorized to pay for this gig' 
        });
      }

      itemData = gig;
      clientId = gig.client._id;
      freelancerId = gig.freelancer._id;
      itemTitle = gig.title;
    }

    // Create receipt ID
    const receipt = `receipt_${Date.now()}`;

    // Razorpay order options
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: receipt,
      notes: {
        ...(type === 'contract' ? { contractId: contractId.toString() } : { gigId: gigId.toString() }),
        clientId: req.user._id.toString(),
        freelancerId: freelancerId.toString(),
        title: itemTitle,
        paymentType: type,
      },
    };

    // Create order in Razorpay
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    // Save payment record in database
    const paymentData = {
      orderId: order.id,
      clientId: req.user._id,
      freelancerId: freelancerId,
      amount: amount,
      receipt: receipt,
      status: 'created',
      paymentType: type,
      notes: {
        title: itemTitle,
        clientName: req.user.name,
      },
    };

    if (type === 'contract') {
      paymentData.contractId = contractId;
    } else {
      paymentData.gigId = gigId;
    }

    const payment = await Payment.create(paymentData);

    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      payment: {
        id: payment._id,
        title: itemTitle,
        type: type,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to create payment order' 
    });
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, contractId, type } = req.body;

    console.log('=== PAYMENT VERIFICATION START ===');
    console.log('Order ID:', razorpay_order_id);
    console.log('Payment ID:', razorpay_payment_id);
    console.log('Contract ID from request:', contractId);
    console.log('Payment Type:', type);

    // Create expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Verify signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update payment status in database
      const payment = await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentId: razorpay_payment_id,
          status: 'paid',
        },
        { new: true }
      ).populate('gigId').populate('contractId').populate('clientId').populate('freelancerId');

      console.log('Payment record found:', payment ? 'Yes' : 'No');
      if (payment) {
        console.log('Payment type from DB:', payment.paymentType);
        console.log('Contract ID from DB:', payment.contractId);
      }

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment record not found',
        });
      }

      // Update status based on payment type
      if (payment.paymentType === 'contract') {
        // Update contract payment status
        console.log('Updating contract payment status for contract ID:', payment.contractId);
        const updatedContract = await Contract.findByIdAndUpdate(payment.contractId, {
          paymentStatus: 'paid',
        }, { new: true });
        console.log('Contract updated:', updatedContract ? 'Success' : 'Failed');
        console.log('New payment status:', updatedContract?.paymentStatus);
        
        if (!updatedContract) {
          console.error('ERROR: Contract not found for ID:', payment.contractId);
        }
      } else {
        // Update gig status to in-progress
        await Gig.findByIdAndUpdate(payment.gigId, {
          status: 'in-progress',
        });
      }

      const itemTitle = payment.paymentType === 'contract' 
        ? payment.contractId?.title 
        : payment.gigId?.title;

      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment: {
          id: payment._id,
          amount: payment.amount,
          status: payment.status,
          title: itemTitle,
          type: payment.paymentType,
        },
      });
    } else {
      // Update payment status to failed
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: 'failed' }
      );

      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed',
    });
  }
};

// @desc    Refund payment
// @route   POST /api/payments/refund
// @access  Private
const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    // Find payment record
    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Check if user is authorized (client or freelancer)
    const isAuthorized = payment.clientId.toString() === req.user._id.toString() || 
                        payment.freelancerId.toString() === req.user._id.toString();
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to refund this payment',
      });
    }

    // Create refund using utility function
    const refundResult = await createRefund(paymentId, amount, {
      reason: reason || 'Refund requested',
      requestedBy: req.user._id.toString(),
    });

    if (!refundResult.success) {
      return res.status(400).json({
        success: false,
        message: refundResult.error,
      });
    }

    // Update payment status
    payment.status = 'refunded';
    await payment.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: refundResult.refund,
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Refund failed',
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:orderId
// @access  Private
const getPaymentDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const payment = await Payment.findOne({ orderId })
      .populate('gigId', 'title description')
      .populate('clientId', 'name email')
      .populate('freelancerId', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Check if user is authorized to view this payment
    if (payment.clientId._id.toString() !== req.user._id.toString() && 
        payment.freelancerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment',
      });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get payment details',
    });
  }
};

// @desc    Get user's payments
// @route   GET /api/payments/user/my-payments
// @access  Private
const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [
        { clientId: req.user._id },
        { freelancerId: req.user._id },
      ],
    })
      .populate('gigId', 'title')
      .populate('contractId', 'title')
      .populate('clientId', 'name')
      .populate('freelancerId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get payments',
    });
  }
};

export {
  createOrder,
  verifyPayment,
  refundPayment,
  getPaymentDetails,
  getUserPayments,
};