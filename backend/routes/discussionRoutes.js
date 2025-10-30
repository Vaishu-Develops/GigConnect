import express from 'express';
import {
  createDiscussion,
  getWorkspaceDiscussions,
  getDiscussion,
  addMessage,
  updateDiscussion,
  deleteDiscussion,
  joinDiscussion
} from '../controllers/discussionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create new discussion
router.post('/', createDiscussion);

// Get discussions for workspace
router.get('/workspace/:workspaceId', getWorkspaceDiscussions);

// Get specific discussion
router.get('/:id', getDiscussion);

// Update discussion
router.put('/:id', updateDiscussion);

// Delete discussion
router.delete('/:id', deleteDiscussion);

// Add message to discussion
router.post('/:id/messages', addMessage);

// Join discussion
router.post('/:id/join', joinDiscussion);

export default router;