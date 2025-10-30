import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createProject,
  getWorkspaceProjects,
  getProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';

const router = express.Router();

// All project routes require authentication
router.use(protect);

// Project CRUD
router.post('/', createProject);
router.get('/workspace/:workspaceId', getWorkspaceProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;