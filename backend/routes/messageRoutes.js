import express from 'express';
import {
  sendMessage,
  getMessages,
  markMessagesAsRead,
  addReaction,
  deleteMessage,
  getOnlineUsers,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/online-users', protect, getOnlineUsers);
router.get('/:chatId', protect, getMessages);
router.put('/mark-read', protect, markMessagesAsRead);
router.post('/:messageId/reaction', protect, addReaction);
router.delete('/:messageId', protect, deleteMessage);

export default router;