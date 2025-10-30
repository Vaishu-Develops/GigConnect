import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createWorkspace,
  getUserWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  acceptInvitation,
  getUserInvitations,
  cancelInvitation,
  getWorkspaceStats,
  updateMemberRole,
  removeMember
} from '../controllers/workspaceController.js';

const router = express.Router();

// All workspace routes require authentication
router.use(protect);

// Member invitation routes (must come before /:id routes)
router.get('/invitations', getUserInvitations);
router.post('/invitations/:token/accept', acceptInvitation);

// Workspace CRUD
router.post('/', createWorkspace);
router.get('/', getUserWorkspaces);
router.get('/:id', getWorkspace);
router.get('/:id/stats', getWorkspaceStats);
router.put('/:id', updateWorkspace);
router.delete('/:id', deleteWorkspace);

// Member invitation for specific workspace
router.post('/:id/invite', inviteMember);
router.delete('/:id/invite/:email', cancelInvitation);

// Member management
router.put('/:id/members/:memberId', updateMemberRole);
router.delete('/:id/members/:memberId', removeMember);

export default router;