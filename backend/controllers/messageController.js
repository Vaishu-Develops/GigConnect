import Message from '../models/Message.js';
import User from '../models/User.js';
import { onlineUsers } from '../server.js';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { chatId, content, messageType = 'text', fileUrl = null, fileName = null, fileSize = null, replyTo = null } = req.body;
    const senderId = req.user._id;

    console.log('Sending message to chatId:', chatId, 'from user:', senderId);

    // Find other participants in this chat to add to readBy
    const existingMessages = await Message.find({ chatId, deleted: false }).limit(10);
    const participants = new Set();
    
    existingMessages.forEach(msg => {
      participants.add(msg.sender.toString());
      msg.readBy.forEach(read => participants.add(read.userId.toString()));
    });

    // Remove sender from participants to get recipients
    participants.delete(senderId.toString());
    const recipients = Array.from(participants);

    console.log('Chat participants (recipients):', recipients);

    const message = await Message.create({
      chatId,
      sender: senderId,
      content,
      messageType,
      fileUrl,
      fileName,
      fileSize,
      replyTo,
      readBy: recipients.map(userId => ({ userId, readAt: new Date() }))
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('replyTo', 'content sender');

    console.log('Message created successfully:', populatedMessage._id);

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
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

// @desc    Get chat details by chatId
// @route   GET /api/messages/chats/:chatId
// @access  Private
const getChatDetails = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    console.log('getChatDetails - chatId:', chatId);
    console.log('getChatDetails - userId:', userId);

    // Check if user is part of this chat
    const chatExists = await Message.findOne({
      chatId,
      $or: [
        { sender: userId },
        { 'readBy.userId': userId }
      ]
    });

    if (!chatExists) {
      console.log('getChatDetails - Chat not found for user');
      return res.status(404).json({
        success: false,
        message: 'Chat not found or access denied'
      });
    }

    // Get all messages in this chat to find participants
    const allMessages = await Message.find({ chatId, deleted: false })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    console.log('getChatDetails - Found messages:', allMessages.length);

    // Get unique participants with their full data
    const participantMap = new Map();
    allMessages.forEach(msg => {
      if (msg.sender && msg.sender._id) {
        participantMap.set(msg.sender._id.toString(), msg.sender);
        console.log('getChatDetails - Added participant:', msg.sender.name, msg.sender._id);
      }
    });

    // Find other user (not current user)
    const otherUserId = Array.from(participantMap.keys()).find(id => id !== userId.toString());
    const otherUser = participantMap.get(otherUserId);

    console.log('getChatDetails - Current user ID:', userId.toString());
    console.log('getChatDetails - Other user ID:', otherUserId);
    console.log('getChatDetails - Other user object:', otherUser);

    // If no otherUser found from messages, try to extract from chatId
    let fallbackOtherUser = null;
    if (!otherUser && chatId.includes('_')) {
      const chatIdParts = chatId.split('_');
      console.log('getChatDetails - ChatId parts:', chatIdParts);
      
      // Try to find user IDs in the chatId
      for (const part of chatIdParts) {
        if (part.length === 24 && part !== userId.toString()) { // MongoDB ObjectId length
          try {
            fallbackOtherUser = await User.findById(part, 'name email avatar').lean();
            if (fallbackOtherUser) {
              console.log('getChatDetails - Found fallback user:', fallbackOtherUser.name);
              break;
            }
          } catch (err) {
            console.log('getChatDetails - Invalid user ID in chatId:', part);
          }
        }
      }
    }

    const finalOtherUser = otherUser || fallbackOtherUser;
    console.log('getChatDetails - Final other user:', finalOtherUser);

    res.status(200).json({
      success: true,
      chat: {
        chatId,
        otherUser: finalOtherUser || null,
        participants: Array.from(participantMap.values())
      }
    });
  } catch (error) {
    console.error('getChatDetails error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create a new chat
// @route   POST /api/messages/chats
// @access  Private
const createChat = async (req, res) => {
  try {
    const { participantId, gigId } = req.body;
    const userId = req.user._id;

    console.log('Creating chat between:', userId, 'and', participantId);

    // Convert to strings for comparison
    const userIdStr = userId.toString();
    const participantIdStr = participantId.toString();
    
    // Generate unique chatId with consistent ordering
    const sortedIds = [userIdStr, participantIdStr].sort();
    const chatId = `chat_${sortedIds[0]}_${sortedIds[1]}_${Date.now()}`;

    console.log('Generated chatId:', chatId);

    // Check if chat already exists between these users
    const existingChat = await Message.findOne({
      chatId: { $regex: `^chat_${sortedIds[0]}_${sortedIds[1]}_` }
    });

    if (existingChat) {
      console.log('Existing chat found:', existingChat.chatId);
      return res.status(200).json({
        success: true,
        chat: { _id: existingChat.chatId }
      });
    }

    // Create initial message with both users in readBy
    const message = await Message.create({
      chatId,
      sender: userId,
      content: gigId ? `Hi! I'm interested in your gig. Let's discuss the details.` : 'Hi! Let\'s discuss your project.',
      messageType: 'system',
      readBy: [
        { userId: participantId, readAt: new Date() },
        { userId: userId, readAt: new Date() }
      ]
    });

    console.log('Created chat with message:', message);

    res.status(201).json({
      success: true,
      chat: { _id: chatId }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Getting chats for user:', userId);

    // Find all messages where user is sender or recipient
    const allMessages = await Message.find({
      $or: [
        { sender: userId },
        { 'readBy.userId': userId }
      ],
      deleted: false,
      chatId: { $exists: true, $ne: null }
    })
    .populate('sender', 'name email avatar')
    .sort({ createdAt: -1 });

    console.log('Found messages:', allMessages.length);

    // Group by chatId and ensure uniqueness
    const chatGroups = {};
    allMessages.forEach(message => {
      if (message.chatId && !chatGroups[message.chatId]) {
        chatGroups[message.chatId] = [];
      }
      if (message.chatId) {
        chatGroups[message.chatId].push(message);
      }
    });

    const chats = [];
    for (const chatId of Object.keys(chatGroups)) {
      const messages = chatGroups[chatId];
      const latestMessage = messages[0]; // Already sorted by createdAt desc
      
      // Get unique participants with their full user data
      const participantMap = new Map();
      
      // Add senders
      messages.forEach(msg => {
        if (msg.sender && msg.sender._id) {
          participantMap.set(msg.sender._id.toString(), msg.sender);
        }
      });

      // Also check for other participants in the chat by checking all messages
      const allChatMessages = await Message.find({ 
        chatId: chatId,
        deleted: false 
      }).populate('sender', 'name email avatar');

      allChatMessages.forEach(msg => {
        if (msg.sender && msg.sender._id) {
          participantMap.set(msg.sender._id.toString(), msg.sender);
        }
      });

      // Find other user (not current user)
      const otherUserId = Array.from(participantMap.keys()).find(id => id !== userId.toString());
      const otherUser = participantMap.get(otherUserId);

      console.log('Chat', chatId, 'participants:', Array.from(participantMap.keys()));
      console.log('Other user:', otherUser?.name || 'Unknown');

      // If no other user found from messages, try to extract from chatId
      let fallbackOtherUser = null;
      if (!otherUser && chatId.includes('_')) {
        const chatIdParts = chatId.split('_');
        console.log('getUserChats - ChatId parts:', chatIdParts);
        
        // Try to find user IDs in the chatId
        for (const part of chatIdParts) {
          if (part.length === 24 && part !== userId.toString()) { // MongoDB ObjectId length
            try {
              fallbackOtherUser = await User.findById(part, 'name email avatar').lean();
              if (fallbackOtherUser) {
                console.log('getUserChats - Found fallback user:', fallbackOtherUser.name);
                break;
              }
            } catch (err) {
              console.log('getUserChats - Invalid user ID in chatId:', part);
            }
          }
        }
      }

      const finalOtherUser = otherUser || fallbackOtherUser;

      // Only add chat if we found an other user
      if (finalOtherUser) {
        chats.push({
          chatId,
          lastMessage: {
            _id: latestMessage._id,
            content: latestMessage.content,
            createdAt: latestMessage.createdAt,
            sender: latestMessage.sender
          },
          otherUser: finalOtherUser,
          unreadCount: 0
        });
      }
    }

    // Sort by latest message time and remove any potential duplicates
    const uniqueChats = chats.filter((chat, index, self) => 
      index === self.findIndex(c => c.chatId === chat.chatId)
    ).sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));

    console.log('Returning unique chats:', uniqueChats.length);

    res.status(200).json({
      success: true,
      chats: uniqueChats
    });
  } catch (error) {
    console.error('Error in getUserChats:', error);
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
  getUserChats,
  getChatDetails,
  createChat,
};