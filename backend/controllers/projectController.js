import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Workspace from '../models/Workspace.js';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      workspace: workspaceId, 
      assignedTo = [], 
      budget = { amount: 0, currency: 'USD' },
      deadline,
      tags = [],
      priority = 'medium'
    } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Project title is required'
      });
    }

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: 'Workspace ID is required'
      });
    }

    // Check if workspace exists and user has access
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

    // Check if user can create projects (owner or admin)
    const userRole = workspace.getUserRole(userId);
    const isOwner = workspace.owner.toString() === userId.toString();
    
    if (!isOwner && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only workspace owners and admins can create projects'
      });
    }

    // Create project
    const project = new Project({
      title: title.trim(),
      description: description?.trim(),
      workspace: workspaceId,
      owner: userId,
      assignedTo: assignedTo.map(member => ({
        user: member.user || member,
        role: member.role || 'contributor'
      })),
      budget: {
        amount: budget.amount || 0,
        currency: budget.currency || 'USD'
      },
      deadline: deadline ? new Date(deadline) : undefined,
      tags: tags.filter(tag => tag && tag.trim()).map(tag => tag.trim()),
      priority
    });

    await project.save();
    await project.populate('owner', 'name email avatar');
    await project.populate('assignedTo.user', 'name email avatar');
    await project.populate('workspace', 'name');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

// @desc    Get projects for workspace
// @route   GET /api/projects/workspace/:workspaceId
// @access  Private
export const getWorkspaceProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user._id;
    const { status, priority, page = 1, limit = 10 } = req.query;

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
      isActive: true
    };

    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [projects, totalProjects] = await Promise.all([
      Project.find(filters)
        .populate('owner', 'name email avatar')
        .populate('assignedTo.user', 'name email avatar')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Project.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalProjects / parseInt(limit)),
          totalProjects,
          hasNext: skip + projects.length < totalProjects,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get workspace projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await Project.findOne({ _id: id, isActive: true })
      .populate('owner', 'name email avatar')
      .populate('assignedTo.user', 'name email avatar')
      .populate('workspace', 'name description owner members');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has access to this project through workspace
    const workspace = project.workspace;
    const hasAccess = workspace.owner.toString() === userId.toString() ||
                     workspace.members.some(member => member.user.toString() === userId.toString()) ||
                     project.assignedTo.some(member => member.user._id.toString() === userId.toString());

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const project = await Project.findOne({ _id: id, isActive: true })
      .populate('workspace', 'owner members');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const workspace = project.workspace;
    const isWorkspaceOwner = workspace.owner.toString() === userId.toString();
    const workspaceRole = workspace.members.find(m => m.user.toString() === userId.toString())?.role;
    const isProjectOwner = project.owner.toString() === userId.toString();

    if (!isWorkspaceOwner && workspaceRole !== 'admin' && !isProjectOwner) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this project'
      });
    }

    // Update allowed fields
    const allowedFields = [
      'title', 'description', 'status', 'priority', 
      'budget', 'deadline', 'tags', 'progress'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        project[field] = updateData[field];
      }
    });

    // Handle special fields
    if (updateData.assignedTo) {
      project.assignedTo = updateData.assignedTo.map(member => ({
        user: member.user || member,
        role: member.role || 'contributor'
      }));
    }

    // Update completion date if status changed to completed
    if (updateData.status === 'completed' && project.status !== 'completed') {
      project.completedDate = new Date();
    }

    await project.save();
    await project.populate('owner', 'name email avatar');
    await project.populate('assignedTo.user', 'name email avatar');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await Project.findOne({ _id: id, isActive: true })
      .populate('workspace', 'owner members');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions (only workspace owner, admins, or project owner)
    const workspace = project.workspace;
    const isWorkspaceOwner = workspace.owner.toString() === userId.toString();
    const workspaceRole = workspace.members.find(m => m.user.toString() === userId.toString())?.role;
    const isProjectOwner = project.owner.toString() === userId.toString();

    if (!isWorkspaceOwner && workspaceRole !== 'admin' && !isProjectOwner) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this project'
      });
    }

    // Soft delete
    project.isActive = false;
    await project.save();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
};