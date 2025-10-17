import Gig from '../models/Gig.js';

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Private (Client only)
const createGig = async (req, res) => {
  try {
    const { title, description, budget, category, location, skillsRequired } = req.body;

    // Check if user is a client
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can create gigs' });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      category,
      location,
      skillsRequired,
      client: req.user._id,
    });

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all gigs
// @route   GET /api/gigs
// @access  Public
const getGigs = async (req, res) => {
  try {
    const { keyword, location, minBudget, maxBudget, category } = req.query;
    
    let query = { status: 'open' };

    // Search by keyword
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by budget range
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    // Filter by category
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    const gigs = await Gig.find(query)
      .populate('client', 'name email')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('client', 'name email');

    if (gig) {
      res.json(gig);
    } else {
      res.status(404).json({ message: 'Gig not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update gig
// @route   PUT /api/gigs/:id
// @access  Private (Client only)
const updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the owner of the gig
    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this gig' });
    }

    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('client', 'name email');

    res.json(updatedGig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete gig
// @route   DELETE /api/gigs/:id
// @access  Private (Client only)
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the owner of the gig
    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this gig' });
    }

    await Gig.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gig removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createGig,
  getGigs,
  getGig,
  updateGig,
  deleteGig,
};