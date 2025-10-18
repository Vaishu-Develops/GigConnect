import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let razorpayInstance = null;

// Get Razorpay instance with lazy initialization
const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

/**
 * Create a new Razorpay order
 * @param {Object} orderData - Order details
 * @param {number} orderData.amount - Amount in rupees
 * @param {string} orderData.currency - Currency code (default: INR)
 * @param {string} orderData.receipt - Receipt ID
 * @param {Object} orderData.notes - Additional notes
 * @returns {Promise<Object>} Razorpay order object
 */
export const createRazorpayOrder = async (orderData) => {
  try {
    const options = {
      amount: orderData.amount * 100, // Convert to paise
      currency: orderData.currency || 'INR',
      receipt: orderData.receipt,
      notes: orderData.notes || {},
      payment_capture: 1, // Auto capture payment
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);
    return {
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      },
    };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return {
      success: false,
      error: error.error?.description || error.message,
    };
  }
};

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean} Whether signature is valid
 */
export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Payment signature verification error:', error);
    return false;
  }
};

/**
 * Get payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment details
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    const razorpay = getRazorpayInstance();
    const payment = await razorpay.payments.fetch(paymentId);
    return {
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount / 100, // Convert to rupees
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        bank: payment.bank,
        wallet: payment.wallet,
        card_id: payment.card_id,
        email: payment.email,
        contact: payment.contact,
        order_id: payment.order_id,
        created_at: payment.created_at,
      },
    };
  } catch (error) {
    console.error('Get payment details error:', error);
    return {
      success: false,
      error: error.error?.description || error.message,
    };
  }
};

/**
 * Get order details from Razorpay
 * @param {string} orderId - Razorpay order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderDetails = async (orderId) => {
  try {
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.fetch(orderId);
    return {
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        attempts: order.attempts,
        created_at: order.created_at,
      },
    };
  } catch (error) {
    console.error('Get order details error:', error);
    return {
      success: false,
      error: error.error?.description || error.message,
    };
  }
};

/**
 * Refund a payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Amount to refund (in rupees)
 * @param {string} notes - Refund notes
 * @returns {Promise<Object>} Refund details
 */
export const createRefund = async (paymentId, amount = null, notes = {}) => {
  try {
    const refundData = {
      payment_id: paymentId,
      notes: notes,
    };

    // If amount is specified, refund partial amount
    if (amount) {
      refundData.amount = amount * 100; // Convert to paise
    }

    const razorpay = getRazorpayInstance();
    const refund = await razorpay.refunds.create(refundData);
    return {
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100, // Convert to rupees
        currency: refund.currency,
        status: refund.status,
        speed_processed: refund.speed_processed,
        speed_requested: refund.speed_requested,
        notes: refund.notes,
        created_at: refund.created_at,
      },
    };
  } catch (error) {
    console.error('Create refund error:', error);
    return {
      success: false,
      error: error.error?.description || error.message,
    };
  }
};

/**
 * Get refund details
 * @param {string} refundId - Razorpay refund ID
 * @returns {Promise<Object>} Refund details
 */
export const getRefundDetails = async (refundId) => {
  try {
    const razorpay = getRazorpayInstance();
    const refund = await razorpay.refunds.fetch(refundId);
    return {
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency,
        status: refund.status,
        payment_id: refund.payment_id,
        created_at: refund.created_at,
      },
    };
  } catch (error) {
    console.error('Get refund details error:', error);
    return {
      success: false,
      error: error.error?.description || error.message,
    };
  }
};

/**
 * Create payment link for later use
 * @param {Object} linkData - Payment link details
 * @returns {Promise<Object>} Payment link details
 */
export const createPaymentLink = async (linkData) => {
  try {
    const razorpay = getRazorpayInstance();
    const paymentLink = await razorpay.paymentLink.create({
      amount: linkData.amount * 100,
      currency: linkData.currency || 'INR',
      accept_partial: linkData.accept_partial || false,
      description: linkData.description || 'GigConnect Payment',
      customer: {
        name: linkData.customer_name,
        email: linkData.customer_email,
        contact: linkData.customer_contact,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: linkData.notes || {},
      callback_url: linkData.callback_url || `${process.env.CLIENT_URL}/payment-success`,
      callback_method: 'get',
    });

    return {
      success: true,
      payment_link: {
        id: paymentLink.id,
        short_url: paymentLink.short_url,
        amount: paymentLink.amount / 100,
        status: paymentLink.status,
        created_at: paymentLink.created_at,
      },
    };
  } catch (error) {
    console.error('Create payment link error:', error);
    return {
      success: false,
      error: error.error?.description || error.message,
    };
  }
};

/**
 * Validate webhook signature
 * @param {string} webhookBody - Raw webhook body
 * @param {string} signature - Webhook signature from header
 * @returns {boolean} Whether webhook is valid
 */
export const validateWebhookSignature = (webhookBody, signature) => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(webhookBody)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Webhook signature validation error:', error);
    return false;
  }
};

/**
 * Generate test payment data for development
 * @returns {Object} Test payment data
 */
export const generateTestPaymentData = () => {
  return {
    order_id: `order_${Date.now()}`,
    payment_id: `pay_${Date.now()}`,
    signature: 'test_signature_' + Math.random().toString(36).substring(7),
    amount: Math.floor(Math.random() * 1000) + 100, // 100-1100 rupees
    currency: 'INR',
  };
};

export default {
  getRazorpayInstance,
  createRazorpayOrder,
  verifyPaymentSignature,
  getPaymentDetails,
  getOrderDetails,
  createRefund,
  getRefundDetails,
  createPaymentLink,
  validateWebhookSignature,
  generateTestPaymentData,
};