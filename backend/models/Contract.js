import mongoose from 'mongoose';

const contractSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    budgetType: {
      type: String,
      enum: ['fixed', 'hourly'],
      default: 'fixed',
    },
    timeline: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      default: '',
    },
    milestones: [{
      title: String,
      description: String,
      amount: Number,
      dueDate: Date,
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'approved'],
        default: 'pending'
      }
    }],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: [
        'pending-acceptance',    // Sent to freelancer, waiting for response
        'accepted',             // Freelancer accepted, contract active
        'declined',             // Freelancer declined the offer
        'in-progress',          // Work is ongoing
        'completed',            // Work finished, pending final approval
        'cancelled',            // Contract cancelled by either party
        'disputed'              // Contract in dispute
      ],
      default: 'pending-acceptance',
    },
    contractType: {
      type: String,
      enum: ['direct-hire', 'gig-application'],
      default: 'direct-hire',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    acceptedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    // Payment related fields
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'pending', 'paid', 'refunded'],
      default: 'unpaid',
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    escrowAmount: {
      type: Number,
      default: 0,
    },
    // Communication
    lastMessage: {
      type: Date,
      default: Date.now,
    },
    // Ratings after completion
    clientRating: {
      rating: { type: Number, min: 1, max: 5 },
      review: String,
      date: Date
    },
    freelancerRating: {
      rating: { type: Number, min: 1, max: 5 },
      review: String,
      date: Date
    }
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
contractSchema.index({ client: 1, status: 1 });
contractSchema.index({ freelancer: 1, status: 1 });
contractSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Contract', contractSchema);