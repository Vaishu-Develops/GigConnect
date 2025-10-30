import mongoose from 'mongoose';

const workspaceInvitationSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invitedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'member', 'viewer'],
    default: 'member'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending'
  },
  token: {
    type: String,
    unique: true,
    sparse: true
  },
  message: {
    type: String,
    maxlength: 500
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
}, {
  timestamps: true
});

// Index for faster queries
workspaceInvitationSchema.index({ workspace: 1 });
workspaceInvitationSchema.index({ email: 1 });
workspaceInvitationSchema.index({ token: 1 });
workspaceInvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Generate invitation token
workspaceInvitationSchema.pre('save', function(next) {
  if (this.isNew && !this.token) {
    this.token = 'inv_' + Date.now() + Math.random().toString(36).substr(2, 10);
  }
  next();
});

const WorkspaceInvitation = mongoose.model('WorkspaceInvitation', workspaceInvitationSchema);

export default WorkspaceInvitation;