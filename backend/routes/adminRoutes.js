import express from 'express';
import {
  getUsers,
  getGigs,
  deleteUser,
  deleteGig
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, getUsers);
router.get('/gigs', protect, getGigs);
router.delete('/users/:id', protect, deleteUser);
router.delete('/gigs/:id', protect, deleteGig);

export default router;