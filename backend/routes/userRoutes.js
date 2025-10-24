import express from 'express';
import {
  getUsers,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserStatus,
  getUserStats,
  addPortfolioItem,
  deletePortfolioItem,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getUsers); // Add this line
router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

router.route('/portfolio').post(protect, addPortfolioItem);
router.route('/portfolio/:itemId').delete(protect, deletePortfolioItem);

router.route('/:id')
  .get(getUserById)
  .put(protect, updateUserById)
  .delete(protect, deleteUserById);

router.put('/:id/status', protect, updateUserStatus);
router.get('/:id/stats', getUserStats);

export default router;