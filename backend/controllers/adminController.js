import User from '../models/User.js';
import Gig from '../models/Gig.js';

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all gigs (Admin only)
// @route   GET /api/admin/gigs
// @access  Private/Admin
const getGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({}).populate('client', 'name email');
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete gig (Admin only)
// @route   DELETE /api/admin/gigs/:id
// @access  Private/Admin
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    
    if (gig) {
      await Gig.deleteOne({ _id: gig._id });
      res.json({ message: 'Gig removed' });
    } else {
      res.status(404).json({ message: 'Gig not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getUsers,
  getGigs,
  deleteUser,
  deleteGig
};