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
    const Finance = require('../models/Finance');

    // Find the budget
    const query = {
      year: parseInt(year),
      branchId: branchId === 'null' ? null : branchId
    };

    const budget = await Budget.findOne(query);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Get all transactions for this year and branch
    const startDate = `${year}-01-01`; // Jan 1
    const endDate = `${year}-12-31`;   // Dec 31

    const transactionQuery = {
      date: { $gte: startDate, $lte: endDate }
    };

    // Add branch filter if specified
    if (branchId !== 'null') {
      transactionQuery.branchId = branchId;
    } else {
      // For main church (null branchId), only include transactions with null branchId
      transactionQuery.branchId = null;
    }

    const transactions = await Finance.find(transactionQuery);

    // Group transactions by category and type
    const actualsByCategory = {};

    transactions.forEach(transaction => {
      const key = `${transaction.type}-${transaction.category}`;
      if (!actualsByCategory[key]) {
        actualsByCategory[key] = 0;
      }
      actualsByCategory[key] += transaction.amount;
    });

    // Update budget items with actual values
    const updatedItems = budget.items.map(item => {
      const key = `${item.type}-${item.category}`;
      const actual = actualsByCategory[key] || 0;

      // Create a new object to ensure the change is detected
      return {
        ...item.toObject(),
        actual: actual
      };
    });

    // Update the budget with new actuals
    budget.items = updatedItems;
    budget.updatedBy = req.user._id;

    // Save updated budget
    const updatedBudget = await budget.save();

    res.json({
      success: true,
      message: 'Budget actuals updated successfully',
      budget: updatedBudget,
      transactionsProcessed: transactions.length
    });
  } catch (error) {
    console.error('Error updating budget actuals:', error);
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
