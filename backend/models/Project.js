import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['lead', 'developer', 'designer', 'tester', 'contributor'],
      default: 'contributor'
    }
  }],
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  budget: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  earnings: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  deadline: {
    type: Date
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completedDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  milestones: [{
    title: String,
    description: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
projectSchema.index({ workspace: 1 });
projectSchema.index({ owner: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ 'assignedTo.user': 1 });

// Virtual for checking if project is completed
projectSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed';
});

// Method to add team member
projectSchema.methods.addTeamMember = function(userId, role = 'contributor') {
  const existingMember = this.assignedTo.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (!existingMember) {
    this.assignedTo.push({ user: userId, role });
  }
  return this;
};

// Method to remove team member
projectSchema.methods.removeTeamMember = function(userId) {
  this.assignedTo = this.assignedTo.filter(member => 
    member.user.toString() !== userId.toString()
  );
  return this;
};

// Method to update progress
projectSchema.methods.updateProgress = function(progress) {
  this.progress = Math.max(0, Math.min(100, progress));
  if (this.progress === 100 && this.status !== 'completed') {
    this.status = 'completed';
    this.completedDate = new Date();
  }
  return this;
};

const Project = mongoose.model('Project', projectSchema);

export default Project;