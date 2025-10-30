import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastSeenAt: {
      type: Date,
      default: Date.now
    }
  }],
  messages: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    messageType: {
      type: String,
      enum: ['text', 'file', 'image', 'system'],
      default: 'text'
    },
    attachments: [{
      filename: String,
      url: String,
      mimetype: String,
      size: Number
    }],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Discussion.messages'
    },
    reactions: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      emoji: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    isEdited: {
      type: Boolean,
      default: false
    },
    editedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'archived', 'closed'],
    default: 'active'
  },
  tags: [{
    type: String,
    trim: true
  }],
  pinned: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  messageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
discussionSchema.index({ workspace: 1 });
discussionSchema.index({ createdBy: 1 });
discussionSchema.index({ 'participants.user': 1 });
discussionSchema.index({ lastActivity: -1 });
discussionSchema.index({ pinned: -1, lastActivity: -1 });

// Virtual for unread message count (would need user context)
discussionSchema.virtual('unreadCount').get(function() {
  // This would be calculated based on user's lastSeenAt
  return 0;
});

// Method to add participant
discussionSchema.methods.addParticipant = function(userId) {
  const existingParticipant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (!existingParticipant) {
    this.participants.push({ user: userId });
  } else {
    existingParticipant.lastSeenAt = new Date();
  }
  return this;
};

// Method to remove participant
discussionSchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(
    p => p.user.toString() !== userId.toString()
  );
  return this;
};

// Method to add message
discussionSchema.methods.addMessage = function(messageData) {
  this.messages.push(messageData);
  this.messageCount = this.messages.length;
  this.lastActivity = new Date();
  
  // Add sender as participant if not already
  this.addParticipant(messageData.user);
  
  return this;
};

// Method to update last seen for user
discussionSchema.methods.updateLastSeen = function(userId) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.lastSeenAt = new Date();
  }
  return this;
};

// Pre-save middleware to update message count
discussionSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.messageCount = this.messages.filter(msg => !msg.isDeleted).length;
    this.lastActivity = new Date();
  }
  next();
});

const Discussion = mongoose.model('Discussion', discussionSchema);

export default Discussion;