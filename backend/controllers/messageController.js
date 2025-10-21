import Message from '../models/Message.js';
import { onlineUsers } from '../server.js';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { chatId, content, messageType = 'text', fileUrl = null, fileName = null, fileSize = null, replyTo = null } = req.body;

    const message = await Message.create({
      chatId,
      sender: req.user._id,
      content,
      messageType,
      fileUrl,
      fileName,
      fileSize,
      replyTo
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('replyTo', 'content sender');

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ 
      chatId,
      deleted: false 
    })
      .populate('sender', 'name email')
      .populate('replyTo', 'content sender')
      .populate('readBy.userId', 'name')
      .populate('reactions.userId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Mark messages as read for current user
    const unreadMessages = messages.filter(msg => 
      !msg.readBy.some(read => read.userId.toString() === req.user._id.toString())
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        {
          _id: { $in: unreadMessages.map(msg => msg._id) },
          'readBy.userId': { $ne: req.user._id }
        },
        {
          $push: {
            readBy: {
              userId: req.user._id,
              readAt: new Date()
            }
          },
          $set: { isRead: true }
        }
      );
    }

    const totalMessages = await Message.countDocuments({ 
      chatId,
      deleted: false 
    });

    res.json({
      success: true,
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
        hasNext: page < Math.ceil(totalMessages / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/mark-read
// @access  Private
const markMessagesAsRead = async (req, res) => {
  try {
    const { messageIds, chatId } = req.body;

    await Message.updateMany(
      {
        _id: { $in: messageIds },
        'readBy.userId': { $ne: req.user._id }
      },
      {
        $push: {
          readBy: {
            userId: req.user._id,
            readAt: new Date()
          }
        },
        $set: { isRead: true }
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Add reaction to message
// @route   POST /api/messages/:messageId/reaction
// @access  Private
const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Remove existing reaction from same user
    message.reactions = message.reactions.filter(
      reaction => reaction.userId.toString() !== req.user._id.toString()
    );

    // Add new reaction
    message.reactions.push({
      userId: req.user._id,
      emoji
    });

    await message.save();

    const populatedMessage = await Message.findById(messageId)
      .populate('reactions.userId', 'name');

    res.json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete message (soft delete)
// @route   DELETE /api/messages/:messageId
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    message.deleted = true;
    message.deletedAt = new Date();
    message.content = 'This message was deleted';
    
    await message.save();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get online users
// @route   GET /api/messages/online-users
// @access  Private
const getOnlineUsers = async (req, res) => {
  try {
    const onlineUsersArray = Array.from(onlineUsers.values()).map(userData => userData.user);
    
    res.json({
      success: true,
      onlineUsers: onlineUsersArray
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export {
  sendMessage,
  getMessages,
  markMessagesAsRead,
  addReaction,
  deleteMessage,
  getOnlineUsers,
};