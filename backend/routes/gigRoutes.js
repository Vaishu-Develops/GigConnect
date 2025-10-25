import express from 'express';
import {
  createGig,
  getGigs,
  getGig,
  getMyGigs,
  updateGig,
  deleteGig,
} from '../controllers/gigController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-gigs', protect, getMyGigs);

router.route('/')
  .post(protect, createGig)
  .get(getGigs);

router.route('/:id')
  .get(getGig)
  .put(protect, updateGig)
  .delete(protect, deleteGig);

export default router;