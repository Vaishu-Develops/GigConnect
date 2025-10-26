import express from 'express';
import { submitReview, getFreelancerReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/freelancer/:freelancerId', getFreelancerReviews);

// Private routes
router.use(protect);
router.post('/', submitReview);

export default router;