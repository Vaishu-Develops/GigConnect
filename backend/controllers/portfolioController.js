import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';

// @desc    Get user's portfolio items
// @route   GET /api/portfolio/user/:userId
// @access  Public
const getUserPortfolio = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const portfolioItems = await Portfolio.find({
      userId,
      isActive: true
    }).sort({ featured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      portfolioItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my portfolio items
// @route   GET /api/portfolio/my
// @access  Private
const getMyPortfolio = async (req, res) => {
  try {
    const portfolioItems = await Portfolio.find({
      userId: req.user._id,
      isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      portfolioItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create portfolio item
// @route   POST /api/portfolio
// @access  Private
const createPortfolioItem = async (req, res) => {
  try {
    const {
      title,
      description,
      images,
      projectUrl,
      technologies,
      category,
      completedAt,
      clientTestimonial
    } = req.body;

    const portfolioItem = await Portfolio.create({
      userId: req.user._id,
      title,
      description,
      images: images || [],
      projectUrl,
      technologies: technologies || [],
      category,
      completedAt: completedAt || Date.now(),
      clientTestimonial
    });

    res.status(201).json({
      success: true,
      portfolioItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private
const updatePortfolioItem = async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    // Check if user owns the portfolio item
    if (portfolioItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this portfolio item'
      });
    }

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      portfolioItem: updatedPortfolio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private
const deletePortfolioItem = async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    // Check if user owns the portfolio item
    if (portfolioItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this portfolio item'
      });
    }

    // Soft delete
    await Portfolio.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Portfolio item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle featured status
// @route   PATCH /api/portfolio/:id/featured
// @access  Private
const toggleFeatured = async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    // Check if user owns the portfolio item
    if (portfolioItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this portfolio item'
      });
    }

    portfolioItem.featured = !portfolioItem.featured;
    await portfolioItem.save();

    res.status(200).json({
      success: true,
      portfolioItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
  getUserPortfolio,
  getMyPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  toggleFeatured
};