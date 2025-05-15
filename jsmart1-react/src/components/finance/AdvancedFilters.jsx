import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/finance/AdvancedFilters.css';

const AdvancedFilters = ({ 
  budget, 
  onFilterChange, 
  initialFilters = { 
    categoryTypes: [], 
    categories: [], 
    minAmount: '', 
    maxAmount: '',
    varianceThreshold: 0,
    sortBy: 'category',
    sortDirection: 'asc'
  } 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  
  // Get unique categories from budget items
  const getUniqueCategories = () => {
    if (!budget || !budget.items || budget.items.length === 0) return [];
    
    return [...new Set(budget.items.map(item => item.category))].sort();
  };
  
  // Handle filter changes
  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Handle category type selection
  const handleCategoryTypeChange = (type) => {
    const newCategoryTypes = filters.categoryTypes.includes(type)
      ? filters.categoryTypes.filter(t => t !== type)
      : [...filters.categoryTypes, type];
    
    handleFilterChange('categoryTypes', newCategoryTypes);
  };
  
  // Handle category selection
  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    handleFilterChange('categories', newCategories);
  };
  
  // Handle reset filters
  const handleResetFilters = () => {
    const resetFilters = { 
      categoryTypes: [], 
      categories: [], 
      minAmount: '', 
      maxAmount: '',
      varianceThreshold: 0,
      sortBy: 'category',
      sortDirection: 'asc'
    };
    
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const uniqueCategories = getUniqueCategories();
  
  return (
    <div className="advanced-filters">
      <div className="filters-header" onClick={toggleExpanded}>
        <h3>
          <FontAwesomeIcon icon="filter" />
          Advanced Filters
        </h3>
        <button type="button" className="toggle-btn">
          <FontAwesomeIcon icon={isExpanded ? 'chevron-up' : 'chevron-down'} />
        </button>
      </div>
      
      {isExpanded && (
        <div className="filters-content">
          <div className="filters-section">
            <h4>Filter by Type</h4>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.categoryTypes.includes('income')}
                  onChange={() => handleCategoryTypeChange('income')}
                />
                Income
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.categoryTypes.includes('expense')}
                  onChange={() => handleCategoryTypeChange('expense')}
                />
                Expense
              </label>
            </div>
          </div>
          
          {uniqueCategories.length > 0 && (
            <div className="filters-section">
              <h4>Filter by Category</h4>
              <div className="checkbox-group categories">
                {uniqueCategories.map(category => (
                  <label key={category} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>
          )}
          
          <div className="filters-section">
            <h4>Filter by Amount</h4>
            <div className="range-inputs">
              <div className="input-group">
                <label htmlFor="minAmount">Min Amount</label>
                <input
                  type="number"
                  id="minAmount"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                  placeholder="Min"
                />
              </div>
              <div className="input-group">
                <label htmlFor="maxAmount">Max Amount</label>
                <input
                  type="number"
                  id="maxAmount"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
          
          <div className="filters-section">
            <h4>Variance Threshold</h4>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={filters.varianceThreshold}
                onChange={(e) => handleFilterChange('varianceThreshold', parseInt(e.target.value))}
              />
              <span className="slider-value">{filters.varianceThreshold}%</span>
            </div>
            <p className="slider-description">
              Show items with variance greater than {filters.varianceThreshold}% between budget and actual
            </p>
          </div>
          
          <div className="filters-section">
            <h4>Sort By</h4>
            <div className="sort-options">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="category">Category</option>
                <option value="amount">Budget Amount</option>
                <option value="actual">Actual Amount</option>
                <option value="variance">Variance</option>
                <option value="variancePercentage">Variance %</option>
              </select>
              
              <button
                type="button"
                className="sort-direction-btn"
                onClick={() => handleFilterChange('sortDirection', filters.sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                <FontAwesomeIcon icon={filters.sortDirection === 'asc' ? 'sort-up' : 'sort-down'} />
                {filters.sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </div>
          </div>
          
          <div className="filters-actions">
            <button type="button" className="btn-reset" onClick={handleResetFilters}>
              <FontAwesomeIcon icon="undo" /> Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
