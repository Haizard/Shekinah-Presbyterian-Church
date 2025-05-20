const Donation = require('../models/Donation');
const Finance = require('../models/Finance');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private/Admin/Finance
const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({})
      .sort({ createdAt: -1 })
      .populate('branchId', 'name');
    
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get donations by status
// @route   GET /api/donations/status/:status
// @access  Private/Admin/Finance
const getDonationsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    const donations = await Donation.find({ paymentStatus: status })
      .sort({ createdAt: -1 })
      .populate('branchId', 'name');
    
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations by status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get donations by branch
// @route   GET /api/donations/branch/:branchId
// @access  Private/Admin/Finance
const getDonationsByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    
    const donations = await Donation.find({ branchId })
      .sort({ createdAt: -1 })
      .populate('branchId', 'name');
    
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations by branch:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Private/Admin/Finance
const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('branchId', 'name');
    
    if (donation) {
      res.json(donation);
    } else {
      res.status(404).json({ message: 'Donation not found' });
    }
  } catch (error) {
    console.error('Error fetching donation by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a donation
// @route   POST /api/donations
// @access  Public
const createDonation = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      amount,
      currency,
      donationType,
      category,
      designation,
      paymentMethod,
      branchId,
      notes,
      isAnonymous,
    } = req.body;

    // Generate a unique transaction ID
    const transactionId = `DON-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const donation = new Donation({
      firstName,
      lastName,
      email,
      phone: phone || '',
      amount,
      currency: currency || 'Tsh',
      donationType,
      category,
      designation: designation || '',
      paymentMethod,
      paymentStatus: 'pending',
      transactionId,
      branchId: branchId || null,
      notes: notes || '',
      isAnonymous: isAnonymous || false,
    });

    const createdDonation = await donation.save();
    
    // Send confirmation email
    await sendDonationConfirmationEmail(createdDonation);
    
    res.status(201).json({
      message: 'Donation created successfully',
      donation: createdDonation,
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update donation status
// @route   PUT /api/donations/:id/status
// @access  Private/Admin/Finance
const updateDonationStatus = async (req, res) => {
  try {
    const { paymentStatus, transactionId, paymentReference } = req.body;
    
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    donation.paymentStatus = paymentStatus || donation.paymentStatus;
    donation.transactionId = transactionId || donation.transactionId;
    donation.paymentReference = paymentReference || donation.paymentReference;
    
    // If status is completed, create a finance record
    if (paymentStatus === 'completed' && donation.paymentStatus !== 'completed') {
      // Create a finance record for this donation
      const finance = new Finance({
        type: 'income',
        category: `Donation - ${donation.category}`,
        amount: donation.amount,
        date: new Date().toISOString().split('T')[0],
        description: `Donation from ${donation.isAnonymous ? 'Anonymous' : `${donation.firstName} ${donation.lastName}`}`,
        reference: donation.transactionId,
        branchId: donation.branchId,
      });
      
      await finance.save();
      
      // Send receipt email if payment is completed
      if (!donation.receiptSent) {
        await sendDonationReceiptEmail(donation);
        donation.receiptSent = true;
        donation.receiptId = `RCP-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      }
    }
    
    const updatedDonation = await donation.save();
    
    res.json({
      message: 'Donation status updated successfully',
      donation: updatedDonation,
    });
  } catch (error) {
    console.error('Error updating donation status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a donation
// @route   DELETE /api/donations/:id
// @access  Private/Admin
const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    await donation.deleteOne();
    
    res.json({ message: 'Donation removed' });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private/Admin/Finance
const getDonationStats = async (req, res) => {
  try {
    // Get total donations
    const totalDonations = await Donation.countDocuments({ paymentStatus: 'completed' });
    
    // Get total amount
    const totalAmountResult = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;
    
    // Get donations by category
    const donationsByCategory = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: '$category', count: { $sum: 1 }, amount: { $sum: '$amount' } } }
    ]);
    
    // Get donations by payment method
    const donationsByPaymentMethod = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, amount: { $sum: '$amount' } } }
    ]);
    
    // Get donations by branch
    const donationsByBranch = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: '$branchId', count: { $sum: 1 }, amount: { $sum: '$amount' } } }
    ]);
    
    // Get recent donations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDonations = await Donation.aggregate([
      { $match: { paymentStatus: 'completed', createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      totalDonations,
      totalAmount,
      donationsByCategory,
      donationsByPaymentMethod,
      donationsByBranch,
      recentDonations
    });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to send donation confirmation email
const sendDonationConfirmationEmail = async (donation) => {
  try {
    // This is a placeholder - implement actual email sending logic
    console.log(`Sending confirmation email for donation ${donation._id}`);
    // In a real implementation, you would use nodemailer or a similar library
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

// Helper function to send donation receipt email
const sendDonationReceiptEmail = async (donation) => {
  try {
    // This is a placeholder - implement actual email sending logic
    console.log(`Sending receipt email for donation ${donation._id}`);
    // In a real implementation, you would use nodemailer or a similar library
  } catch (error) {
    console.error('Error sending receipt email:', error);
  }
};

module.exports = {
  getDonations,
  getDonationsByStatus,
  getDonationsByBranch,
  getDonationById,
  createDonation,
  updateDonationStatus,
  deleteDonation,
  getDonationStats,
};
