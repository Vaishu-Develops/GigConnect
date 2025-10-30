import mongoose from 'mongoose';
import Discussion from '../models/Discussion.js';
import Workspace from '../models/Workspace.js';

// @desc    Create new discussion
// @route   POST /api/discussions
// @access  Private
export const createDiscussion = async (req, res) => {
  try {
    const { title, description, workspace: workspaceId, tags = [], isPrivate = false } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Discussion title is required'
      });
    }

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: 'Workspace ID is required'
      });
    }

    // Check workspace access
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ],
      isActive: true
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found or access denied'
      });
    }

    // Create discussion
    const discussion = new Discussion({
      title: title.trim(),
      description: description?.trim(),
      workspace: workspaceId,
      createdBy: userId,
      participants: [{ user: userId }],
      tags: tags.filter(tag => tag && tag.trim()).map(tag => tag.trim()),
      isPrivate
    });

    await discussion.save();
    await discussion.populate('createdBy', 'name email avatar');
    await discussion.populate('participants.user', 'name email avatar');
    await discussion.populate('workspace', 'name');

    res.status(201).json({
      success: true,
      message: 'Discussion created successfully',
      data: discussion
    });
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create discussion',
      error: error.message
    });
  }
};

// @desc    Get discussions for workspace
// @route   GET /api/discussions/workspace/:workspaceId
// @access  Private
export const getWorkspaceDiscussions = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user._id;
    const { status, page = 1, limit = 20 } = req.query;

    // Check workspace access
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ],
      isActive: true
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found or access denied'
      });
    }

    // Build query filters
    const filters = {
      workspace: workspaceId,
      $or: [
        { isPrivate: false },
        { 'participants.user': userId },
        { createdBy: userId }
      ]
    };

    if (status) filters.status = status;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [discussions, totalDiscussions] = await Promise.all([
      Discussion.find(filters)
        .populate('createdBy', 'name email avatar')
        .populate('participants.user', 'name email avatar')
        .sort({ pinned: -1, lastActivity: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Discussion.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: {
        discussions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalDiscussions / parseInt(limit)),
          totalDiscussions,
          hasNext: skip + discussions.length < totalDiscussions,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get workspace discussions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discussions'
    });
  }
};

// @desc    Get discussion by ID
// @route   GET /api/discussions/:id
// @access  Private
export const getDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(id)
      .populate('createdBy', 'name email avatar')
      .populate('participants.user', 'name email avatar')
      .populate('messages.user', 'name email avatar')
      .populate('workspace', 'name');

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check access
    const hasAccess = discussion.createdBy._id.toString() === userId.toString() ||
                     discussion.participants.some(p => p.user._id.toString() === userId.toString()) ||
                     (!discussion.isPrivate);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update last seen for user
    discussion.updateLastSeen(userId);
    await discussion.save();

    // Transform messages to match frontend expectations
    const transformedDiscussion = discussion.toObject();
    if (transformedDiscussion.messages) {
      transformedDiscussion.messages = transformedDiscussion.messages.map(message => ({
        ...message,
        sender: message.user, // Frontend expects 'sender' instead of 'user'
      }));
    }

    res.json({
      success: true,
      data: transformedDiscussion
    });
  } catch (error) {
    console.error('Get discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discussion'
    });
  }
};

// @desc    Add message to discussion
// @route   POST /api/discussions/:id/messages
// @access  Private
export const addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, messageType = 'text', replyTo, attachments = [] } = req.body;
    const userId = req.user._id;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check access
    const hasAccess = discussion.participants.some(p => p.user.toString() === userId.toString()) ||
                     (!discussion.isPrivate);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Add message
    const messageData = {
      user: userId,
      content: content.trim(),
      messageType,
      replyTo: replyTo || undefined,
      attachments
    };

    discussion.addMessage(messageData);
    await discussion.save();

    // Get the newly added message with populated user
    await discussion.populate('messages.user', 'name email avatar');
    const newMessage = discussion.messages[discussion.messages.length - 1];

    // Transform message to match frontend expectations
    const transformedMessage = {
      ...newMessage.toObject(),
      sender: newMessage.user // Frontend expects 'sender' instead of 'user'
    };

    res.status(201).json({
      success: true,
      message: 'Message added successfully',
      data: transformedMessage
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add message'
    });
  }
};

// @desc    Update discussion
// @route   PUT /api/discussions/:id
// @access  Private
export const updateDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, status, pinned } = req.body;
    const userId = req.user._id;

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check permissions (creator or workspace owner/admin)
    const workspace = await Workspace.findById(discussion.workspace);
    const isCreator = discussion.createdBy.toString() === userId.toString();
    const isWorkspaceOwner = workspace.owner.toString() === userId.toString();
    const workspaceRole = workspace.members.find(m => m.user.toString() === userId.toString())?.role;

    if (!isCreator && !isWorkspaceOwner && workspaceRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Permission denied'
      });
    }

    // Update fields
    if (title) discussion.title = title.trim();
    if (description !== undefined) discussion.description = description;
    if (tags) discussion.tags = tags.filter(tag => tag && tag.trim()).map(tag => tag.trim());
    if (status) discussion.status = status;
    if (pinned !== undefined) discussion.pinned = pinned;

    await discussion.save();
    await discussion.populate('createdBy', 'name email avatar');
    await discussion.populate('participants.user', 'name email avatar');

    res.json({
      success: true,
      message: 'Discussion updated successfully',
      data: discussion
    });
  } catch (error) {
    console.error('Update discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update discussion'
    });
  }
};

// @desc    Delete discussion
// @route   DELETE /api/discussions/:id
// @access  Private
export const deleteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check permissions (creator or workspace owner/admin)
    const workspace = await Workspace.findById(discussion.workspace);
    const isCreator = discussion.createdBy.toString() === userId.toString();
    const isWorkspaceOwner = workspace.owner.toString() === userId.toString();
    const workspaceRole = workspace.members.find(m => m.user.toString() === userId.toString())?.role;

    if (!isCreator && !isWorkspaceOwner && workspaceRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Permission denied'
      });
    }

    await Discussion.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    console.error('Delete discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete discussion'
    });
  }
};

// @desc    Join discussion
// @route   POST /api/discussions/:id/join
// @access  Private
export const joinDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check if already a participant
    const isParticipant = discussion.participants.some(
      p => p.user.toString() === userId.toString()
    );

    if (isParticipant) {
      return res.status(400).json({
        success: false,
        message: 'Already a participant'
      });
    }

    discussion.addParticipant(userId);
    await discussion.save();
    await discussion.populate('participants.user', 'name email avatar');

    res.json({
      success: true,
      message: 'Joined discussion successfully',
      data: discussion
    });
  } catch (error) {
    console.error('Join discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join discussion'
    });
  }
};