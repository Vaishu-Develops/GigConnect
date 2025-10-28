import Contract from '../models/Contract.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Create a direct hire contract
// @route   POST /api/contracts
// @access  Private (Client only)
const createContract = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      budget, 
      budgetType, 
      timeline, 
      requirements, 
      freelancerId,
      milestones,
      startDate 
    } = req.body;

    // Check if user is a client
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can create contracts' });
    }

    // Verify freelancer exists and is actually a freelancer
    const freelancer = await User.findById(freelancerId);
    if (!freelancer || freelancer.role !== 'freelancer') {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Check if client is trying to hire themselves
    if (req.user._id.toString() === freelancerId) {
      return res.status(400).json({ message: 'You cannot hire yourself' });
    }

    const contract = await Contract.create({
      title,
      description,
      budget,
      budgetType: budgetType || 'fixed',
      timeline,
      requirements: requirements || '',
      milestones: milestones || [],
      client: req.user._id,
      freelancer: freelancerId,
      startDate: startDate ? new Date(startDate) : null,
      contractType: 'direct-hire'
    });

    // Populate client and freelancer data
    await contract.populate('client', 'name email avatar');
    await contract.populate('freelancer', 'name email avatar');

    // Create notification for freelancer
    await Notification.create({
      recipient: freelancerId,
      sender: req.user._id,
      type: 'gig_offer',
      title: 'New Hire Proposal',
      message: `${req.user.name} wants to hire you for "${title}"`,
      data: {
        contractId: contract._id,
        clientId: req.user._id,
        clientName: req.user.name
      }
    });

    res.status(201).json({
      success: true,
      contract,
      message: 'Hire proposal sent successfully'
    });
  } catch (error) {
    console.error('Contract creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get contracts for current user
// @route   GET /api/contracts
// @access  Private
const getContracts = async (req, res) => {
  try {
    const { status, type = 'all' } = req.query;
    
    let query = {};
    
    // Filter by user role
    if (req.user.role === 'client') {
      query.client = req.user._id;
    } else if (req.user.role === 'freelancer') {
      query.freelancer = req.user._id;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by type
    if (type === 'pending') {
      query.status = 'pending-acceptance';
    } else if (type === 'active') {
      query.status = { $in: ['accepted', 'in-progress'] };
    } else if (type === 'completed') {
      query.status = { $in: ['completed'] };
    }

    const contracts = await Contract.find(query)
      .populate('client', 'name email avatar')
      .populate('freelancer', 'name email avatar skills hourlyRate')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      contracts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single contract
// @route   GET /api/contracts/:id
// @access  Private
const getContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('client', 'name email avatar')
      .populate('freelancer', 'name email avatar skills hourlyRate');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if user is part of this contract
    const isClient = contract.client._id.toString() === req.user._id.toString();
    const isFreelancer = contract.freelancer._id.toString() === req.user._id.toString();
    
    if (!isClient && !isFreelancer) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      contract
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept contract (Freelancer only)
// @route   PUT /api/contracts/:id/accept
// @access  Private (Freelancer only)
const acceptContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if user is the freelancer for this contract
    if (contract.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the assigned freelancer can accept this contract' });
    }

    // Check if contract is in pending state
    if (contract.status !== 'pending-acceptance') {
      return res.status(400).json({ message: 'Contract cannot be accepted in current state' });
    }

    contract.status = 'accepted';
    contract.acceptedAt = new Date();
    await contract.save();

    // Create notification for client
    await Notification.create({
      recipient: contract.client,
      sender: req.user._id,
      type: 'gig_accepted',
      title: 'Contract Accepted',
      message: `${req.user.name} accepted your hire proposal for "${contract.title}"`,
      data: {
        contractId: contract._id,
        freelancerId: req.user._id,
        freelancerName: req.user.name
      }
    });

    await contract.populate('client', 'name email avatar');
    await contract.populate('freelancer', 'name email avatar');

    res.json({
      success: true,
      contract,
      message: 'Contract accepted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Decline contract (Freelancer only)
// @route   PUT /api/contracts/:id/decline
// @access  Private (Freelancer only)
const declineContract = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if user is the freelancer for this contract
    if (contract.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the assigned freelancer can decline this contract' });
    }

    // Check if contract is in pending state
    if (contract.status !== 'pending-acceptance') {
      return res.status(400).json({ message: 'Contract cannot be declined in current state' });
    }

    contract.status = 'declined';
    contract.declineReason = reason || 'No reason provided';
    await contract.save();

    // Create notification for client
    await Notification.create({
      recipient: contract.client,
      sender: req.user._id,
      type: 'system',
      title: 'Contract Declined',
      message: `${req.user.name} declined your hire proposal for "${contract.title}"`,
      data: {
        contractId: contract._id,
        freelancerId: req.user._id,
        freelancerName: req.user.name,
        reason: reason
      }
    });

    await contract.populate('client', 'name email avatar');
    await contract.populate('freelancer', 'name email avatar');

    res.json({
      success: true,
      contract,
      message: 'Contract declined'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contract status
// @route   PUT /api/contracts/:id/status
// @access  Private
const updateContractStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if user is part of this contract
    const isClient = contract.client.toString() === req.user._id.toString();
    const isFreelancer = contract.freelancer.toString() === req.user._id.toString();
    
    if (!isClient && !isFreelancer) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate status transitions
    const validTransitions = {
      'accepted': ['in-progress', 'cancelled'],
      'in-progress': ['completed', 'cancelled'],
      'completed': [], // No transitions from completed
      'cancelled': [], // No transitions from cancelled
      'declined': []   // No transitions from declined
    };

    if (!validTransitions[contract.status]?.includes(status)) {
      return res.status(400).json({ 
        message: `Cannot transition from ${contract.status} to ${status}` 
      });
    }

    contract.status = status;
    
    if (status === 'completed') {
      contract.completedAt = new Date();
    }

    await contract.save();

    await contract.populate('client', 'name email avatar');
    await contract.populate('freelancer', 'name email avatar');

    res.json({
      success: true,
      contract,
      message: `Contract status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createContract,
  getContracts,
  getContract,
  acceptContract,
  declineContract,
  updateContractStatus
};