import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createWithdrawal,
  getUserWithdrawals,
  getWithdrawal,
  cancelWithdrawal
} from '../controllers/withdrawalController.js';

const router = express.Router();

// All withdrawal routes require authentication
router.use(protect);

// Create withdrawal request - only freelancers can withdraw
router.post('/', createWithdrawal);

// Get user's withdrawal history
router.get('/', getUserWithdrawals);

// Get specific withdrawal
router.get('/:id', getWithdrawal);

// Cancel withdrawal
router.patch('/:id/cancel', cancelWithdrawal);

export default router;