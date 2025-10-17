import express from 'express';
import { submitReview, getFreelancerReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitReview);
router.get('/:freelancerId', getFreelancerReviews);

export default router;