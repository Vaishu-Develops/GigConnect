import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Gig',
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    projectCompleted: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0
    },
    // Response from freelancer to the review
    response: {
      content: String,
      createdAt: Date
    }
  },
  {
    timestamps: true,
  }
);

// Ensure one review per gig per client-freelancer pair
reviewSchema.index({ gigId: 1, clientId: 1, freelancerId: 1 }, { unique: true });

// Index for better query performance
reviewSchema.index({ freelancerId: 1, rating: -1 });
reviewSchema.index({ clientId: 1 });

export default mongoose.model('Review', reviewSchema);