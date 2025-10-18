import express from 'express';
import {
  createOrder,
  verifyPayment,
  refundPayment,
  getPaymentDetails,
  getUserPayments,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/refund', protect, refundPayment); // Add this
router.get('/:orderId', protect, getPaymentDetails);
router.get('/user/my-payments', protect, getUserPayments);

export default router;