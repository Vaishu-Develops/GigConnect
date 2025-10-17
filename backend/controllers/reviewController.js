import Review from '../models/Review.js';
import Gig from '../models/Gig.js';

// @desc    Submit a review
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
    const existingReview = await Review.findOne({ gigId });
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

    const populatedReview = await Review.findById(review._id)
      .populate('clientId', 'name')
      .populate('freelancerId', 'name');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a freelancer
// @route   GET /api/reviews/:freelancerId
// @access  Public
const getFreelancerReviews = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    const reviews = await Review.find({ freelancerId })
      .populate('clientId', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { submitReview, getFreelancerReviews };