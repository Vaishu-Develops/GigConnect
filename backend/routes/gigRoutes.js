import express from 'express';
import {
  createGig,
  getGigs,
  getGig,
  updateGig,
  deleteGig,
} from '../controllers/gigController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createGig)
  .get(getGigs);

router.route('/:id')
  .get(getGig)
  .put(protect, updateGig)
  .delete(protect, deleteGig);

export default router;