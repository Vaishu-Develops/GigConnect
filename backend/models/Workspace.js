import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'member', 'viewer'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  settings: {
    isPublic: {
      type: Boolean,
      default: false
    },
    allowMemberInvite: {
      type: Boolean,
      default: true
    },
    maxMembers: {
      type: Number,
      default: 50
    }
  },
  avatar: {
    type: String,
    default: ''
  },
  stats: {
    totalProjects: {
      type: Number,
      default: 0
    },
    completedProjects: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
workspaceSchema.index({ owner: 1 });
workspaceSchema.index({ 'members.user': 1 });
workspaceSchema.index({ name: 'text', description: 'text' });

// Virtual for member count
workspaceSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Method to check if user is member
workspaceSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.user.toString() === userId.toString());
};

// Method to get user's role in workspace
workspaceSchema.methods.getUserRole = function(userId) {
  const member = this.members.find(member => member.user.toString() === userId.toString());
  return member ? member.role : null;
};

// Method to check if user can invite members
workspaceSchema.methods.canInviteMembers = function(userId) {
  if (this.owner.toString() === userId.toString()) return true;
  const userRole = this.getUserRole(userId);
  return userRole === 'admin' && this.settings.allowMemberInvite;
};

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;