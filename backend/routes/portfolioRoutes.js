import express from 'express';
import {
  getUserPortfolio,
  getMyPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  toggleFeatured
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/user/:userId', getUserPortfolio);

// Private routes
router.use(protect);
router.get('/my', getMyPortfolio);
router.post('/', createPortfolioItem);
router.put('/:id', updatePortfolioItem);
router.delete('/:id', deletePortfolioItem);
router.patch('/:id/featured', toggleFeatured);

export default router;