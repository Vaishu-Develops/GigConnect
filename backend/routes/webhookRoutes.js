import express from 'express';
import { handleRazorpayWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Webhook route - no auth needed (called by Razorpay)
router.post('/razorpay', express.raw({ type: 'application/json' }), handleRazorpayWebhook);

export default router;