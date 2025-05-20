const PaymentConfig = require('../models/PaymentConfig');

// @desc    Get all payment configurations
// @route   GET /api/payment-config
// @access  Private/Admin
const getPaymentConfigs = async (req, res) => {
  try {
    const paymentConfigs = await PaymentConfig.find({}).sort({ displayOrder: 1, name: 1 });
    res.json(paymentConfigs);
  } catch (error) {
    console.error('Error fetching payment configurations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get active payment configurations for public use
// @route   GET /api/payment-config/active
// @access  Public
const getActivePaymentConfigs = async (req, res) => {
  try {
    const paymentConfigs = await PaymentConfig.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .select('-apiKey -apiSecret -passKey -initiatorPassword -privateKey');
    
    res.json(paymentConfigs);
  } catch (error) {
    console.error('Error fetching active payment configurations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get payment configuration by ID
// @route   GET /api/payment-config/:id
// @access  Private/Admin
const getPaymentConfigById = async (req, res) => {
  try {
    const paymentConfig = await PaymentConfig.findById(req.params.id);
    
    if (!paymentConfig) {
      return res.status(404).json({ message: 'Payment configuration not found' });
    }
    
    res.json(paymentConfig);
  } catch (error) {
    console.error('Error fetching payment configuration by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get payment configurations by gateway type
// @route   GET /api/payment-config/type/:gatewayType
// @access  Private/Admin
const getPaymentConfigsByType = async (req, res) => {
  try {
    const { gatewayType } = req.params;
    
    const paymentConfigs = await PaymentConfig.find({ gatewayType })
      .sort({ displayOrder: 1, name: 1 });
    
    res.json(paymentConfigs);
  } catch (error) {
    console.error('Error fetching payment configurations by type:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a payment configuration
// @route   POST /api/payment-config
// @access  Private/Admin
const createPaymentConfig = async (req, res) => {
  try {
    const {
      name,
      isActive,
      gatewayType,
      mpesa,
      tigopesa,
      airtelmoney,
      bank,
      card,
      displayOrder,
      displayName,
      description,
      iconClass,
      additionalSettings,
    } = req.body;
    
    // Check if configuration with the same name already exists
    const existingConfig = await PaymentConfig.findOne({ name });
    if (existingConfig) {
      return res.status(400).json({ message: 'A payment configuration with this name already exists' });
    }
    
    // Create new payment configuration
    const paymentConfig = new PaymentConfig({
      name,
      isActive: isActive !== undefined ? isActive : true,
      gatewayType,
      mpesa: gatewayType === 'mpesa' ? mpesa : undefined,
      tigopesa: gatewayType === 'tigopesa' ? tigopesa : undefined,
      airtelmoney: gatewayType === 'airtelmoney' ? airtelmoney : undefined,
      bank: gatewayType === 'bank' ? bank : undefined,
      card: gatewayType === 'card' ? card : undefined,
      displayOrder: displayOrder || 0,
      displayName: displayName || name,
      description,
      iconClass,
      additionalSettings,
    });
    
    const createdPaymentConfig = await paymentConfig.save();
    
    res.status(201).json(createdPaymentConfig);
  } catch (error) {
    console.error('Error creating payment configuration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a payment configuration
// @route   PUT /api/payment-config/:id
// @access  Private/Admin
const updatePaymentConfig = async (req, res) => {
  try {
    const {
      name,
      isActive,
      gatewayType,
      mpesa,
      tigopesa,
      airtelmoney,
      bank,
      card,
      displayOrder,
      displayName,
      description,
      iconClass,
      additionalSettings,
    } = req.body;
    
    const paymentConfig = await PaymentConfig.findById(req.params.id);
    
    if (!paymentConfig) {
      return res.status(404).json({ message: 'Payment configuration not found' });
    }
    
    // Check if name is being changed and if it conflicts with an existing config
    if (name && name !== paymentConfig.name) {
      const existingConfig = await PaymentConfig.findOne({ name });
      if (existingConfig && existingConfig._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'A payment configuration with this name already exists' });
      }
    }
    
    // Update fields
    paymentConfig.name = name || paymentConfig.name;
    paymentConfig.isActive = isActive !== undefined ? isActive : paymentConfig.isActive;
    paymentConfig.gatewayType = gatewayType || paymentConfig.gatewayType;
    
    // Update gateway-specific settings based on gateway type
    if (gatewayType === 'mpesa' || paymentConfig.gatewayType === 'mpesa') {
      paymentConfig.mpesa = mpesa || paymentConfig.mpesa;
    }
    
    if (gatewayType === 'tigopesa' || paymentConfig.gatewayType === 'tigopesa') {
      paymentConfig.tigopesa = tigopesa || paymentConfig.tigopesa;
    }
    
    if (gatewayType === 'airtelmoney' || paymentConfig.gatewayType === 'airtelmoney') {
      paymentConfig.airtelmoney = airtelmoney || paymentConfig.airtelmoney;
    }
    
    if (gatewayType === 'bank' || paymentConfig.gatewayType === 'bank') {
      paymentConfig.bank = bank || paymentConfig.bank;
    }
    
    if (gatewayType === 'card' || paymentConfig.gatewayType === 'card') {
      paymentConfig.card = card || paymentConfig.card;
    }
    
    // Update display settings
    paymentConfig.displayOrder = displayOrder !== undefined ? displayOrder : paymentConfig.displayOrder;
    paymentConfig.displayName = displayName || paymentConfig.displayName;
    paymentConfig.description = description !== undefined ? description : paymentConfig.description;
    paymentConfig.iconClass = iconClass !== undefined ? iconClass : paymentConfig.iconClass;
    
    // Update additional settings
    if (additionalSettings) {
      paymentConfig.additionalSettings = additionalSettings;
    }
    
    const updatedPaymentConfig = await paymentConfig.save();
    
    res.json(updatedPaymentConfig);
  } catch (error) {
    console.error('Error updating payment configuration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a payment configuration
// @route   DELETE /api/payment-config/:id
// @access  Private/Admin
const deletePaymentConfig = async (req, res) => {
  try {
    const paymentConfig = await PaymentConfig.findById(req.params.id);
    
    if (!paymentConfig) {
      return res.status(404).json({ message: 'Payment configuration not found' });
    }
    
    await paymentConfig.deleteOne();
    
    res.json({ message: 'Payment configuration removed' });
  } catch (error) {
    console.error('Error deleting payment configuration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPaymentConfigs,
  getActivePaymentConfigs,
  getPaymentConfigById,
  getPaymentConfigsByType,
  createPaymentConfig,
  updatePaymentConfig,
  deletePaymentConfig,
};
