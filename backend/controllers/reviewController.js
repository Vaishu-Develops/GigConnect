import Review from '../models/Review.js';
import User from '../models/User.js';
import Gig from '../models/Gig.js';

// @desc    Submit a review (legacy endpoint - keeping for compatibility)
// @route   POST /api/reviews
// @access  Private
const submitReview = async (req, res) => {
  try {
    const { gigId, freelancerId, rating, comment } = req.body;

    // Check if gig exists and is completed
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the client of this gig
    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this gig' });
    }

    // Check if review already exists for this gig
    const existingReview = await Review.findOne({ gigId, clientId: req.user._id, freelancerId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already submitted for this gig' });
    }

    const review = await Review.create({
      gigId,
      clientId: req.user._id,
      freelancerId,
      rating,
      comment,
    });

    // Update freelancer's average rating
    await updateFreelancerRating(freelancerId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    console.error('Error in submitReview:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to update freelancer's average rating
const updateFreelancerRating = async (freelancerId) => {
  try {
    const reviews = await Review.find({ freelancerId });
    
    if (reviews.length > 0) {
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await User.findByIdAndUpdate(freelancerId, {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews: reviews.length
      });
    }
  } catch (error) {
    console.error('Error updating freelancer rating:', error);
  }
};

// @desc    Get reviews for a freelancer
// @route   GET /api/reviews/freelancer/:freelancerId
// @access  Public
const getFreelancerReviews = async (req, res) => {
  try {
    const { freelancerId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ freelancerId })
      .populate('clientId', 'name avatar companyName')
      .populate('gigId', 'title category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ freelancerId });

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNext: page < Math.ceil(totalReviews / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export { submitReview, getFreelancerReviews };