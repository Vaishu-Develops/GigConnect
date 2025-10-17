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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Review', reviewSchema);