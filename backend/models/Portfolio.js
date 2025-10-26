import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String // URLs to images
  }],
  projectUrl: {
    type: String // Live project link
  },
  technologies: [{
    type: String // Skills/technologies used
  }],
  category: {
    type: String,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  clientTestimonial: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
portfolioSchema.index({ userId: 1, isActive: 1 });
portfolioSchema.index({ category: 1, featured: -1 });

export default mongoose.model('Portfolio', portfolioSchema);