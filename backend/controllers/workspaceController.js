import mongoose from 'mongoose';
import Workspace from '../models/Workspace.js';
import WorkspaceInvitation from '../models/WorkspaceInvitation.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

// @desc    Create new workspace
// @route   POST /api/workspaces
// @access  Private
export const createWorkspace = async (req, res) => {
  try {
    const { name, description, settings } = req.body;
    const ownerId = req.user._id;

    // Check if workspace name already exists for this user
    const existingWorkspace = await Workspace.findOne({ 
      name: name.trim(), 
      owner: ownerId 
    });

    if (existingWorkspace) {
      return res.status(400).json({
        success: false,
        message: 'A workspace with this name already exists'
      });
    }

    const workspace = new Workspace({
      name: name.trim(),
      description,
      owner: ownerId,
      members: [{
        user: ownerId,
        role: 'admin',
        joinedAt: new Date()
      }],
      settings: {
        isPublic: settings?.isPublic || false,
        allowMemberInvite: settings?.allowMemberInvite !== false,
        maxMembers: settings?.maxMembers || 50
      }
    });

    await workspace.save();
    await workspace.populate('owner', 'name email avatar');
    await workspace.populate('members.user', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Workspace created successfully',
      data: workspace
    });
  } catch (error) {
    console.error('Create workspace error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create workspace'
    });
  }
};

// @desc    Get user's workspaces
// @route   GET /api/workspaces
// @access  Private
export const getUserWorkspaces = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Getting workspaces for user:', userId);

    const workspaces = await Workspace.find({
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ],
      isActive: true
    })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .sort({ updatedAt: -1 });

    console.log('Found workspaces:', workspaces.length);

    res.json({
      success: true,
      data: workspaces
    });
  } catch (error) {
    console.error('Get workspaces error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workspaces',
      error: error.message
    });
  }
};

// @desc    Get workspace by ID
// @route   GET /api/workspaces/:id
// @access  Private
export const getWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const workspace = await Workspace.findOne({
      _id: id,
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ],
      isActive: true
    })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found or access denied'
      });
    }

    res.json({
      success: true,
      data: workspace
    });
  } catch (error) {
    console.error('Get workspace error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workspace'
    });
  }
};

// @desc    Update workspace
// @route   PUT /api/workspaces/:id
// @access  Private
export const updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { name, description, settings, avatar } = req.body;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    // Check if user is owner or admin
    const userRole = workspace.getUserRole(userId);
    if (workspace.owner.toString() !== userId.toString() && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only workspace owners and admins can update workspace'
      });
    }

    // Update fields
    if (name) workspace.name = name.trim();
    if (description !== undefined) workspace.description = description;
    if (avatar !== undefined) workspace.avatar = avatar;
    if (settings) {
      workspace.settings = {
        ...workspace.settings,
        ...settings
      };
    }

    await workspace.save();
    await workspace.populate('owner', 'name email avatar');
    await workspace.populate('members.user', 'name email avatar');

    res.json({
      success: true,
      message: 'Workspace updated successfully',
      data: workspace
    });
  } catch (error) {
    console.error('Update workspace error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update workspace'
    });
  }
};

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Private
export const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    // Only owner can delete workspace
    if (workspace.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only workspace owner can delete workspace'
      });
    }

    // Soft delete
    workspace.isActive = false;
    await workspace.save();

    res.json({
      success: true,
      message: 'Workspace deleted successfully'
    });
  } catch (error) {
    console.error('Delete workspace error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete workspace'
    });
  }
};

// @desc    Invite member to workspace
// @route   POST /api/workspaces/:id/invite
// @access  Private
export const inviteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, message } = req.body;
    const userId = req.user._id;

    console.log('Invite member request:', { 
      workspaceId: id, 
      email, 
      role, 
      message,
      userId: userId.toString(),
      body: req.body 
    });

    // Validate input
    if (!email || !email.trim()) {
      console.log('Validation failed: Email is required');
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      console.log('Workspace not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    console.log('Workspace found:', { 
      workspaceId: workspace._id, 
      owner: workspace.owner.toString(),
      memberCount: workspace.members.length 
    });

    // Check if user can invite members
    const canInvite = workspace.canInviteMembers(userId);
    console.log('Can invite check:', { 
      userId: userId.toString(), 
      isOwner: workspace.owner.toString() === userId.toString(),
      canInvite 
    });

    if (!canInvite) {
      console.log('Permission denied for user:', userId.toString());
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to invite members'
      });
    }

    // Check if user is already a member
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser && workspace.isMember(existingUser._id)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this workspace'
      });
    }

    // Check for existing pending invitation
    const existingInvitation = await WorkspaceInvitation.findOne({
      workspace: id,
      email: email.toLowerCase().trim(),
      status: 'pending'
    });

    if (existingInvitation) {
      // Instead of rejecting, let's update the existing invitation
      existingInvitation.role = role || 'member';
      existingInvitation.message = message?.trim() || '';
      existingInvitation.invitedBy = userId;
      existingInvitation.createdAt = new Date(); // Update timestamp
      
      await existingInvitation.save();
      await existingInvitation.populate('workspace', 'name description');
      await existingInvitation.populate('invitedBy', 'name email');

      console.log('Updated existing invitation:', existingInvitation._id);

      return res.status(200).json({
        success: true,
        message: 'Invitation updated and resent successfully',
        data: existingInvitation
      });
    }

    // Create invitation
    const invitation = new WorkspaceInvitation({
      workspace: id,
      invitedBy: userId,
      invitedUser: existingUser?._id,
      email: email.toLowerCase().trim(),
      role: role || 'member',
      message: message?.trim() || ''
    });

    console.log('Creating invitation:', invitation);

    await invitation.save();
    await invitation.populate('workspace', 'name description');
    await invitation.populate('invitedBy', 'name email');

    console.log('Invitation created successfully:', invitation._id);

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      data: invitation
    });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send invitation',
      error: error.message
    });
  }
};

// @desc    Accept workspace invitation
// @route   POST /api/workspaces/invitations/:token/accept
// @access  Private
export const acceptInvitation = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user._id;

    const invitation = await WorkspaceInvitation.findOne({
      token,
      status: 'pending'
    }).populate('workspace');

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired invitation'
      });
    }

    // Check if invitation is for current user
    if (invitation.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'This invitation is not for your account'
      });
    }

    // Check if workspace exists and is active
    if (!invitation.workspace || !invitation.workspace.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Workspace no longer exists'
      });
    }

    // Check if user is already a member
    if (invitation.workspace.isMember(userId)) {
      invitation.status = 'accepted';
      await invitation.save();
      
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this workspace'
      });
    }

    // Add user to workspace
    invitation.workspace.members.push({
      user: userId,
      role: invitation.role,
      joinedAt: new Date(),
      invitedBy: invitation.invitedBy
    });

    await invitation.workspace.save();

    // Update invitation status
    invitation.status = 'accepted';
    invitation.invitedUser = userId;
    await invitation.save();

    await invitation.workspace.populate('owner', 'name email avatar');
    await invitation.workspace.populate('members.user', 'name email avatar');

    res.json({
      success: true,
      message: 'Successfully joined workspace',
      data: invitation.workspace
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept invitation'
    });
  }
};

// @desc    Get workspace invitations for user
// @route   GET /api/workspaces/invitations
// @access  Private
export const getUserInvitations = async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log('Getting invitations for user:', userEmail);

    const invitations = await WorkspaceInvitation.find({
      email: userEmail,
      status: 'pending'
    })
    .populate('workspace', 'name description avatar')
    .populate('invitedBy', 'name email avatar')
    .sort({ createdAt: -1 });

    console.log('Found invitations:', invitations.length);

    res.json({
      success: true,
      data: invitations
    });
  } catch (error) {
    console.error('Get invitations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invitations',
      error: error.message
    });
  }
};

// @desc    Cancel/delete pending invitation
// @route   DELETE /api/workspaces/:id/invite/:email
// @access  Private
export const cancelInvitation = async (req, res) => {
  try {
    const { id, email } = req.params;
    const userId = req.user._id;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    // Check if user can manage invitations
    if (!workspace.canInviteMembers(userId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to cancel invitations'
      });
    }

    const invitation = await WorkspaceInvitation.findOneAndDelete({
      workspace: id,
      email: email.toLowerCase().trim(),
      status: 'pending'
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'No pending invitation found for this email'
      });
    }

    res.json({
      success: true,
      message: 'Invitation cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel invitation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel invitation',
      error: error.message
    });
  }
};

// @desc    Get workspace statistics
// @route   GET /api/workspaces/:id/stats
// @access  Private
export const getWorkspaceStats = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const workspace = await Workspace.findOne({
      _id: id,
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

    // Get project statistics
    const totalProjects = await Project.countDocuments({ 
      workspace: id, 
      isActive: true 
    });

    const completedProjects = await Project.countDocuments({ 
      workspace: id, 
      status: 'completed',
      isActive: true 
    });

    // Calculate total earnings from completed projects
    const earningsResult = await Project.aggregate([
      { 
        $match: { 
          workspace: new mongoose.Types.ObjectId(id), 
          status: 'completed',
          isActive: true 
        } 
      },
      { 
        $group: { 
          _id: null, 
          totalEarnings: { $sum: '$earnings.amount' } 
        } 
      }
    ]);

    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;

    // Get member count (owner + members, but avoid double counting if owner is in members)
    const isOwnerInMembers = workspace.members.some(member => 
      member.user.toString() === workspace.owner.toString()
    );
    const memberCount = workspace.members.length + (isOwnerInMembers ? 0 : 1);

    // Get recent activity (recent projects)
    const recentProjects = await Project.find({ 
      workspace: id, 
      isActive: true 
    })
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate('owner', 'name email avatar')
    .populate('assignedTo.user', 'name email avatar');

    // Get project status distribution
    const projectStatusDistribution = await Project.aggregate([
      { 
        $match: { 
          workspace: new mongoose.Types.ObjectId(id), 
          isActive: true 
        } 
      },
      { 
        $group: { 
          _id: '$status', 
          count: { $sum: 1 } 
        } 
      }
    ]);

    res.json({
      success: true,
      data: {
        memberCount,
        totalProjects,
        completedProjects,
        totalEarnings,
        recentProjects,
        projectStatusDistribution: projectStatusDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get workspace stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workspace statistics'
    });
  }
};

// @desc    Update member role in workspace
// @route   PUT /api/workspaces/:id/members/:memberId
// @access  Private
export const updateMemberRole = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const { role } = req.body;
    const userId = req.user._id;

    // Validate role
    const validRoles = ['viewer', 'member', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    const workspace = await Workspace.findById(id);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    // Check if user is owner
    if (workspace.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only workspace owners can update member roles'
      });
    }

    // Find and update member
    const memberIndex = workspace.members.findIndex(
      member => member.user.toString() === memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in workspace'
      });
    }

    // Prevent owner from changing their own role
    if (workspace.owner.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change owner role'
      });
    }

    workspace.members[memberIndex].role = role;
    await workspace.save();

    await workspace.populate('owner', 'name email avatar');
    await workspace.populate('members.user', 'name email avatar');

    res.json({
      success: true,
      message: 'Member role updated successfully',
      data: workspace
    });
  } catch (error) {
    console.error('Update member role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update member role'
    });
  }
};

// @desc    Remove member from workspace
// @route   DELETE /api/workspaces/:id/members/:memberId
// @access  Private
export const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user._id;

    const workspace = await Workspace.findById(id);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    // Check if user is owner
    if (workspace.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only workspace owners can remove members'
      });
    }

    // Prevent owner from removing themselves
    if (workspace.owner.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove workspace owner'
      });
    }

    // Find and remove member
    const memberIndex = workspace.members.findIndex(
      member => member.user.toString() === memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in workspace'
      });
    }

    workspace.members.splice(memberIndex, 1);
    await workspace.save();

    await workspace.populate('owner', 'name email avatar');
    await workspace.populate('members.user', 'name email avatar');

    res.json({
      success: true,
      message: 'Member removed successfully',
      data: workspace
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove member'
    });
  }
};