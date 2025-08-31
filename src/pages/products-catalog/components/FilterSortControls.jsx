import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';


const FilterSortControls = ({ 
  filters, 
  onFiltersChange, 
  sortBy, 
  onSortChange,
  searchQuery,
  onSearchChange,
  onClearFilters 
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'percentage-asc', label: 'Strength (Low to High)' },
    { value: 'percentage-desc', label: 'Strength (High to Low)' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-25', label: 'Under $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200+', label: 'Over $200' }
  ];

  const strengthRanges = [
    { value: 'all', label: 'All Strengths' },
    { value: '0-10', label: 'Low (0-10%)' },
    { value: '10-25', label: 'Medium (10-25%)' },
    { value: '25-40', label: 'High (25-40%)' },
    { value: '40+', label: 'Very High (40%+)' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = filters?.priceRange !== 'all' || filters?.strengthRange !== 'all' || searchQuery?.trim() !== '';

  return (
    <div className="bg-background border-b border-border">
      <div className="w-full px-4 lg:px-6 py-4">
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            iconName="Filter"
            iconPosition="left"
          >
            Filters
            {hasActiveFilters && (
              <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
            )}
          </Button>
          
          <div className="flex items-center space-x-2">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={onSortChange}
              placeholder="Sort by"
              className="w-40"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select
              label="Price Range"
              options={priceRanges}
              value={filters?.priceRange}
              onChange={(value) => handleFilterChange('priceRange', value)}
              className="w-48"
            />
            
            <Select
              label="Strength"
              options={strengthRanges}
              value={filters?.strengthRange}
              onChange={(value) => handleFilterChange('strengthRange', value)}
              className="w-48"
            />
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={onClearFilters}
                iconName="X"
                iconPosition="left"
              >
                Clear Filters
              </Button>
            )}
          </div>
          
          <Select
            label="Sort by"
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            className="w-48"
          />
        </div>

        {/* Mobile Filters Dropdown */}
        {isFilterOpen && (
          <div className="lg:hidden space-y-4 pt-4 border-t border-border animate-slide-up">
            <Select
              label="Price Range"
              options={priceRanges}
              value={filters?.priceRange}
              onChange={(value) => handleFilterChange('priceRange', value)}
            />
            
            <Select
              label="Strength"
              options={strengthRanges}
              value={filters?.strengthRange}
              onChange={(value) => handleFilterChange('strengthRange', value)}
            />
            
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                iconName="X"
                iconPosition="left"
                fullWidth
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSortControls;