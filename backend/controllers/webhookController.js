import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Gig from '../models/Gig.js';

// @desc    Handle Razorpay webhook
// @route   POST /api/webhooks/razorpay
// @access  Public (called by Razorpay)
const handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Verify webhook signature
    const razorpaySignature = req.headers['x-razorpay-signature'];
    
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      console.error('Webhook signature verification failed');
      return res.status(400).json({ success: false });
    }

    const event = req.body.event;
    const payment = req.body.payload.payment?.entity;

    console.log(`Webhook received: ${event}`);

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payment);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(payment);
        break;
      
      case 'payment.dispute.created':
        await handlePaymentDispute(payment);
        break;
      
      default:
        console.log(`Unhandled event type: ${event}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false });
  }
};

const handlePaymentCaptured = async (payment) => {
  try {
    // Find payment by Razorpay order ID
    const paymentRecord = await Payment.findOneAndUpdate(
      { orderId: payment.order_id },
      {
        paymentId: payment.id,
        status: 'paid',
      },
      { new: true }
    );

    if (paymentRecord) {
      // Update gig status
      await Gig.findByIdAndUpdate(paymentRecord.gigId, {
        status: 'in-progress',
      });

      console.log(`Payment ${payment.id} marked as paid`);
    }
  } catch (error) {
    console.error('Handle payment captured error:', error);
  }
};

const handlePaymentFailed = async (payment) => {
  try {
    await Payment.findOneAndUpdate(
      { orderId: payment.order_id },
      { status: 'failed' }
    );
    console.log(`Payment ${payment.id} marked as failed`);
  } catch (error) {
    console.error('Handle payment failed error:', error);
  }
};

const handlePaymentDispute = async (payment) => {
  try {
    await Payment.findOneAndUpdate(
      { paymentId: payment.id },
      { status: 'disputed' }
    );
    console.log(`Payment ${payment.id} disputed`);
  } catch (error) {
    console.error('Handle payment dispute error:', error);
  }
};

export { handleRazorpayWebhook };