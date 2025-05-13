const Budget = require('../models/Budget');

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private/Finance
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({}).sort({ year: -1 });
    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get budget by year and branch
// @route   GET /api/budgets/year/:year/branch/:branchId
// @access  Private/Finance
const getBudgetByYearAndBranch = async (req, res) => {
  try {
    const { year, branchId } = req.params;
    
    // If branchId is 'null', search for null branchId (main church)
    const query = { 
      year: parseInt(year),
      branchId: branchId === 'null' ? null : branchId
    };
    
    const budget = await Budget.findOne(query);
    
    if (budget) {
      res.json(budget);
    } else {
      // Return an empty budget structure if none exists
      res.json({
        year: parseInt(year),
        branchId: branchId === 'null' ? null : branchId,
        items: [],
        status: 'draft'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get budget by ID
// @route   GET /api/budgets/:id
// @access  Private/Finance
const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (budget) {
      res.json(budget);
    } else {
      res.status(404).json({ message: 'Budget not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a budget
// @route   POST /api/budgets
// @access  Private/Finance
const createBudget = async (req, res) => {
  try {
    const { year, branchId, items, notes, status } = req.body;

    // Check if a budget already exists for this year and branch
    const existingBudget = await Budget.findOne({ 
      year, 
      branchId: branchId || null 
    });

    if (existingBudget) {
      return res.status(400).json({ 
        message: 'A budget already exists for this year and branch' 
      });
    }

    const budget = new Budget({
      year,
      branchId: branchId || null,
      items: items || [],
      notes: notes || '',
      status: status || 'draft',
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    const createdBudget = await budget.save();
    res.status(201).json(createdBudget);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // Duplicate key error (unique constraint violation)
      res.status(400).json({ message: 'A budget already exists for this year and branch' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private/Finance
const updateBudget = async (req, res) => {
  try {
    const { items, notes, status } = req.body;

    const budget = await Budget.findById(req.params.id);

    if (budget) {
      budget.items = items || budget.items;
      budget.notes = notes !== undefined ? notes : budget.notes;
      budget.status = status || budget.status;
      budget.updatedBy = req.user._id;

      const updatedBudget = await budget.save();
      res.json(updatedBudget);
    } else {
      res.status(404).json({ message: 'Budget not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private/Finance
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (budget) {
      await budget.deleteOne();
      res.json({ message: 'Budget removed' });
    } else {
      res.status(404).json({ message: 'Budget not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update budget actual values based on transactions
// @route   GET /api/budgets/update-actuals/:year/:branchId
// @access  Private/Finance
const updateBudgetActuals = async (req, res) => {
  try {
    const { year, branchId } = req.params;
    
    // Find the budget
    const query = { 
      year: parseInt(year),
      branchId: branchId === 'null' ? null : branchId
    };
    
    const budget = await Budget.findOne(query);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    // This would normally calculate actuals from transactions
    // For now, we'll just return the budget
    res.json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBudgets,
  getBudgetByYearAndBranch,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  updateBudgetActuals,
};
