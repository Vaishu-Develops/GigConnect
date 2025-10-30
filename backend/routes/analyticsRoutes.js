import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getWorkspaceAnalytics, 
  getMemberAnalytics 
} from '../controllers/analyticsController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get workspace analytics
router.get('/workspaces/:id/analytics', getWorkspaceAnalytics);

// Get member analytics
router.get('/workspaces/:id/analytics/members', getMemberAnalytics);

export default router;