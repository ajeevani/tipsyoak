import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderTable = ({ 
  orders = [], 
  onViewOrder, 
  onConfirmOrder, 
  onDeleteOrder,
  onUpdateStatus 
}) => {
  const [sortField, setSortField] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      confirmed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      ready: 'bg-success/10 text-success border-success/20',
      completed: 'bg-muted text-muted-foreground border-border',
      cancelled: 'bg-destructive/10 text-destructive border-destructive/20'
    };
    return colors?.[status] || colors?.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: 'Clock',
      confirmed: 'CheckCircle',
      ready: 'Package',
      completed: 'Check',
      cancelled: 'X'
    };
    return icons?.[status] || 'Clock';
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOrders = [...orders]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'orderDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortField === 'total') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors duration-200"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          <Icon 
            name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
            size={14} 
          />
        )}
      </div>
    </th>
  );

  if (orders?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="ShoppingBag" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-card-foreground mb-2">No Orders Found</h3>
        <p className="text-muted-foreground">
          No orders match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <SortableHeader field="orderId">Order ID</SortableHeader>
              <SortableHeader field="customerName">Customer</SortableHeader>
              <SortableHeader field="orderDate">Date</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Items
              </th>
              <SortableHeader field="total">Total</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedOrders?.map((order) => (
              <tr key={order?.id} className="hover:bg-muted/30 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-card-foreground">
                    #{order?.orderId}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-card-foreground">
                      {order?.customerName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order?.customerEmail}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-card-foreground">
                    {formatDate(order?.orderDate)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-card-foreground">
                    {order?.items?.length} item{order?.items?.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {order?.items?.slice(0, 2)?.map(item => item?.name)?.join(', ')}
                    {order?.items?.length > 2 && ` +${order?.items?.length - 2} more`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-card-foreground">
                    {formatCurrency(order?.total)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order?.status)}`}>
                    <Icon name={getStatusIcon(order?.status)} size={12} />
                    {order?.status?.charAt(0)?.toUpperCase() + order?.status?.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewOrder?.(order)}
                      iconName="Eye"
                      iconPosition="left"
                    >
                      View
                    </Button>
                    
                    {order?.status === 'pending' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onConfirmOrder?.(order?.id)}
                        iconName="Check"
                        iconPosition="left"
                      >
                        Confirm
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteOrder?.(order?.id)}
                      iconName="Trash2"
                      className="text-destructive hover:text-destructive"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {sortedOrders?.map((order) => (
          <div key={order?.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium text-card-foreground">
                  Order #{order?.orderId}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(order?.orderDate)}
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order?.status)}`}>
                <Icon name={getStatusIcon(order?.status)} size={12} />
                {order?.status?.charAt(0)?.toUpperCase() + order?.status?.slice(1)}
              </span>
            </div>
            
            <div>
              <div className="text-sm font-medium text-card-foreground">
                {order?.customerName}
              </div>
              <div className="text-xs text-muted-foreground">
                {order?.customerEmail}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-card-foreground">
                  {order?.items?.length} item{order?.items?.length !== 1 ? 's' : ''}
                </div>
                <div className="text-sm font-medium text-card-foreground">
                  {formatCurrency(order?.total)}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewOrder?.(order)}
                  iconName="Eye"
                />
                
                {order?.status === 'pending' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onConfirmOrder?.(order?.id)}
                    iconName="Check"
                  />
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteOrder?.(order?.id)}
                  iconName="Trash2"
                  className="text-destructive hover:text-destructive"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTable;