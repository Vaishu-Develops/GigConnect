import mongoose from 'mongoose';
import Workspace from '../models/Workspace.js';
import Project from '../models/Project.js';
import Discussion from '../models/Discussion.js';
import Payment from '../models/Payment.js';

// @desc    Get workspace analytics
// @route   GET /api/workspaces/:id/analytics
// @access  Private
export const getWorkspaceAnalytics = async (req, res) => {
  try {
    const { id: workspaceId } = req.params;
    const userId = req.user._id;

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

    // Get date ranges for analytics
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get projects analytics
    const projects = await Project.find({ workspace: workspaceId });
    const projectStats = {
      total: projects.length,
      completed: projects.filter(p => p.status === 'completed').length,
      inProgress: projects.filter(p => p.status === 'in-progress').length,
      pending: projects.filter(p => p.status === 'pending').length,
      avgProgress: projects.length > 0 
        ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
        : 0
    };

    // Get member activity analytics
    const memberActivity = await Promise.all(
      workspace.members.map(async (member) => {
        const memberProjects = projects.filter(p => 
          p.assignedTo?.toString() === member.user.toString() || 
          p.createdBy?.toString() === member.user.toString()
        );
        
        const discussions = await Discussion.countDocuments({
          workspace: workspaceId,
          $or: [
            { createdBy: member.user },
            { 'participants.user': member.user }
          ]
        });

        return {
          userId: member.user,
          projectsCount: memberProjects.length,
          discussionsCount: discussions,
          completedProjects: memberProjects.filter(p => p.status === 'completed').length,
          activeScore: memberProjects.length + discussions
        };
      })
    );

    // Get discussion analytics
    const discussionStats = await Discussion.aggregate([
      { $match: { workspace: new mongoose.Types.ObjectId(workspaceId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalMessages: { $sum: { $size: '$messages' } },
          activeDiscussions: {
            $sum: {
              $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Get financial analytics (if payments exist)
    let financialStats = {
      totalEarnings: 0,
      averageProjectValue: 0,
      monthlyEarnings: 0,
      pendingPayments: 0
    };

    try {
      const payments = await Payment.find({
        workspace: workspaceId,
        status: 'completed'
      });

      const monthlyPayments = payments.filter(p => 
        new Date(p.createdAt) >= startOfMonth
      );

      financialStats = {
        totalEarnings: payments.reduce((sum, p) => sum + p.amount, 0),
        averageProjectValue: payments.length > 0 
          ? Math.round(payments.reduce((sum, p) => sum + p.amount, 0) / payments.length)
          : 0,
        monthlyEarnings: monthlyPayments.reduce((sum, p) => sum + p.amount, 0),
        pendingPayments: await Payment.countDocuments({
          workspace: workspaceId,
          status: 'pending'
        })
      };
    } catch (error) {
      console.log('Payment analytics not available:', error.message);
    }

    // Get timeline data for charts (last 30 days)
    const timelineData = await Project.aggregate([
      {
        $match: {
          workspace: new mongoose.Types.ObjectId(workspaceId),
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          projectsCreated: { $sum: 1 },
          projectsCompleted: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get productivity metrics
    const productivityMetrics = {
      projectsThisMonth: projects.filter(p => 
        new Date(p.createdAt) >= startOfMonth
      ).length,
      completionRate: projectStats.total > 0 
        ? Math.round((projectStats.completed / projectStats.total) * 100)
        : 0,
      avgTimeToComplete: await calculateAvgCompletionTime(workspaceId),
      memberEngagement: Math.round((memberActivity.reduce((sum, m) => sum + m.activeScore, 0) / workspace.members.length) * 10) / 10
    };

    const analytics = {
      workspace: {
        id: workspace._id,
        name: workspace.name,
        memberCount: workspace.members.length,
        createdAt: workspace.createdAt
      },
      projectStats,
      memberActivity: memberActivity.sort((a, b) => b.activeScore - a.activeScore),
      discussionStats: discussionStats[0] || {
        total: 0,
        totalMessages: 0,
        activeDiscussions: 0
      },
      financialStats,
      timelineData,
      productivityMetrics,
      generatedAt: new Date()
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate analytics'
    });
  }
};

// Helper function to calculate average completion time
const calculateAvgCompletionTime = async (workspaceId) => {
  try {
    const completedProjects = await Project.find({
      workspace: workspaceId,
      status: 'completed',
      completedAt: { $exists: true }
    });

    if (completedProjects.length === 0) return 0;

    const totalDays = completedProjects.reduce((sum, project) => {
      const timeDiff = new Date(project.completedAt) - new Date(project.createdAt);
      return sum + Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }, 0);

    return Math.round(totalDays / completedProjects.length);
  } catch (error) {
    console.error('Error calculating completion time:', error);
    return 0;
  }
};

// @desc    Get member performance analytics
// @route   GET /api/workspaces/:id/analytics/members
// @access  Private
export const getMemberAnalytics = async (req, res) => {
  try {
    const { id: workspaceId } = req.params;
    const userId = req.user._id;

    // Check workspace access
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ],
      isActive: true
    }).populate('members.user', 'name email avatar');

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found or access denied'
      });
    }

    // Get detailed member analytics
    const memberAnalytics = await Promise.all(
      workspace.members.map(async (member) => {
        const projects = await Project.find({
          workspace: workspaceId,
          $or: [
            { assignedTo: member.user._id },
            { createdBy: member.user._id }
          ]
        });

        const discussions = await Discussion.find({
          workspace: workspaceId,
          $or: [
            { createdBy: member.user._id },
            { 'participants.user': member.user._id }
          ]
        });

        const messageCount = discussions.reduce((sum, discussion) => {
          return sum + discussion.messages.filter(msg => 
            msg.user.toString() === member.user._id.toString()
          ).length;
        }, 0);

        return {
          user: member.user,
          role: member.role,
          joinedAt: member.joinedAt,
          projects: {
            total: projects.length,
            completed: projects.filter(p => p.status === 'completed').length,
            inProgress: projects.filter(p => p.status === 'in-progress').length,
            avgProgress: projects.length > 0 
              ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
              : 0
          },
          discussions: {
            created: discussions.filter(d => d.createdBy.toString() === member.user._id.toString()).length,
            participated: discussions.length,
            messages: messageCount
          },
          productivity: {
            completionRate: projects.length > 0 
              ? Math.round((projects.filter(p => p.status === 'completed').length / projects.length) * 100)
              : 0,
            engagementScore: Math.round(((projects.length * 2) + discussions.length + messageCount) * 10) / 10
          }
        };
      })
    );

    res.json({
      success: true,
      data: memberAnalytics.sort((a, b) => b.productivity.engagementScore - a.productivity.engagementScore)
    });

  } catch (error) {
    console.error('Member analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate member analytics'
    });
  }
};