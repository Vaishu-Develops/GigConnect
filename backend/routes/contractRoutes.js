import express from 'express';
import {
  createContract,
  getContracts,
  getContract,
  acceptContract,
  declineContract,
  updateContractStatus,
  updateContract,
  updatePaymentStatus
} from '../controllers/contractController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Contract CRUD operations
router.route('/')
  .post(createContract)    // Create new contract (clients only)
  .get(getContracts);      // Get user's contracts

router.route('/:id')
  .get(getContract)        // Get single contract
  .put(updateContract);    // Update contract

// Contract actions
router.put('/:id/accept', acceptContract);       // Accept contract (freelancers only)
router.put('/:id/decline', declineContract);     // Decline contract (freelancers only)
router.put('/:id/status', updateContractStatus); // Update contract status
router.put('/:id/payment-status', updatePaymentStatus); // Update payment status (for testing)

export default router;