import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const OrderFilters = ({ 
  onDateRangeChange, 
  onStatusFilter, 
  onSearchChange,
  onExportCSV,
  totalOrders = 0,
  filteredOrders = 0
}) => {
  const [dateRange, setDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const dateRangeOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'ready', label: 'Ready for Pickup' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    
    const today = new Date();
    let startDate = null;
    let endDate = null;

    switch (value) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart?.setDate(today?.getDate() - today?.getDay());
        weekStart?.setHours(0, 0, 0, 0);
        startDate = weekStart;
        endDate = new Date();
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date();
        break;
      case 'custom':
        startDate = customStartDate ? new Date(customStartDate) : null;
        endDate = customEndDate ? new Date(customEndDate) : null;
        break;
      default:
        startDate = null;
        endDate = null;
    }

    onDateRangeChange?.({ startDate, endDate, range: value });
  };

  const handleCustomDateChange = () => {
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      onDateRangeChange?.({
        startDate: new Date(customStartDate),
        endDate: new Date(customEndDate),
        range: 'custom'
      });
    }
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    onStatusFilter?.(value);
  };

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleClearFilters = () => {
    setDateRange('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setStatusFilter('all');
    setSearchQuery('');
    onDateRangeChange?.({ startDate: null, endDate: null, range: 'all' });
    onStatusFilter?.('all');
    onSearchChange?.('');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Order Filters</h2>
          <p className="text-sm text-muted-foreground">
            Showing {filteredOrders} of {totalOrders} orders
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            iconName="RotateCcw"
            iconPosition="left"
            size="sm"
          >
            Clear Filters
          </Button>
          
          <Button
            variant="default"
            onClick={onExportCSV}
            iconName="Download"
            iconPosition="left"
            size="sm"
          >
            Export CSV
          </Button>
        </div>
      </div>
      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search by customer name, email, or order ID..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        {/* Date Range */}
        <div>
          <Select
            options={dateRangeOptions}
            value={dateRange}
            onChange={handleDateRangeChange}
            placeholder="Select date range"
          />
        </div>

        {/* Status Filter */}
        <div>
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={handleStatusChange}
            placeholder="Filter by status"
          />
        </div>
      </div>
      {/* Custom Date Range */}
      {dateRange === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <Input
            type="date"
            label="Start Date"
            value={customStartDate}
            onChange={(e) => {
              setCustomStartDate(e?.target?.value);
              setTimeout(handleCustomDateChange, 100);
            }}
          />
          <Input
            type="date"
            label="End Date"
            value={customEndDate}
            onChange={(e) => {
              setCustomEndDate(e?.target?.value);
              setTimeout(handleCustomDateChange, 100);
            }}
          />
        </div>
      )}
      {/* Active Filters Display */}
      {(dateRange !== 'all' || statusFilter !== 'all' || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {dateRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              <Icon name="Calendar" size={12} />
              {dateRangeOptions?.find(opt => opt?.value === dateRange)?.label}
            </span>
          )}
          
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              <Icon name="Filter" size={12} />
              {statusOptions?.find(opt => opt?.value === statusFilter)?.label}
            </span>
          )}
          
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              <Icon name="Search" size={12} />
              "{searchQuery}"
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderFilters;