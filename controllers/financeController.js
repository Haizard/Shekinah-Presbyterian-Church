const Finance = require('../models/Finance');

// @desc    Get all finances
// @route   GET /api/finances
// @access  Private/Admin
const getFinances = async (req, res) => {
  try {
    const finances = await Finance.find({}).sort({ date: -1 });
    res.json(finances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get finances by branch
// @route   GET /api/finances/branch/:branchId
// @access  Private/Admin
const getFinancesByBranch = async (req, res) => {
  try {
    const finances = await Finance.find({ branchId: req.params.branchId }).sort({ date: -1 });
    res.json(finances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get finance by ID
// @route   GET /api/finances/:id
// @access  Private/Admin
const getFinanceById = async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);

    if (finance) {
      res.json(finance);
    } else {
      res.status(404).json({ message: 'Finance record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a finance record
// @route   POST /api/finances
// @access  Private/Admin
const createFinance = async (req, res) => {
  try {
    const { type, category, amount, date, description, reference, approvedBy, branchId } = req.body;

    const finance = new Finance({
      type,
      category,
      amount,
      date,
      description: description || '',
      reference: reference || '',
      approvedBy: approvedBy || '',
      branchId: branchId || null,
    });

    const createdFinance = await finance.save();
    res.status(201).json(createdFinance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a finance record
// @route   PUT /api/finances/:id
// @access  Private/Admin
const updateFinance = async (req, res) => {
  try {
    const { type, category, amount, date, description, reference, approvedBy, branchId } = req.body;

    const finance = await Finance.findById(req.params.id);

    if (finance) {
      finance.type = type || finance.type;
      finance.category = category || finance.category;
      finance.amount = amount !== undefined ? amount : finance.amount;
      finance.date = date || finance.date;
      finance.description = description || finance.description;
      finance.reference = reference || finance.reference;
      finance.approvedBy = approvedBy || finance.approvedBy;
      finance.branchId = branchId !== undefined ? branchId : finance.branchId;

      const updatedFinance = await finance.save();
      res.json(updatedFinance);
    } else {
      res.status(404).json({ message: 'Finance record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a finance record
// @route   DELETE /api/finances/:id
// @access  Private/Admin
const deleteFinance = async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);

    if (finance) {
      await finance.deleteOne();
      res.json({ message: 'Finance record removed' });
    } else {
      res.status(404).json({ message: 'Finance record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get finance summary
// @route   GET /api/finances/summary
// @access  Private/Admin
const getFinanceSummary = async (req, res) => {
  try {
    // Get total income
    const totalIncome = await Finance.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get total expenses
    const totalExpenses = await Finance.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get income by category
    const incomeByCategory = await Finance.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    // Get expenses by category
    const expensesByCategory = await Finance.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalIncome: totalIncome.length > 0 ? totalIncome[0].total : 0,
      totalExpenses: totalExpenses.length > 0 ? totalExpenses[0].total : 0,
      balance: (totalIncome.length > 0 ? totalIncome[0].total : 0) - (totalExpenses.length > 0 ? totalExpenses[0].total : 0),
      incomeByCategory,
      expensesByCategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFinances,
  getFinancesByBranch,
  getFinanceById,
  createFinance,
  updateFinance,
  deleteFinance,
  getFinanceSummary,
};
