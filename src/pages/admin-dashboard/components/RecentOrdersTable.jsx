import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentOrdersTable = ({ orders = [], onConfirmOrder, onDeleteOrder }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'ready':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'completed':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev?.includes(orderId) 
        ? prev?.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders?.length === orders?.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders?.map(order => order?.id));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Filter">
              Filter
            </Button>
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">
                <input
                  type="checkbox"
                  checked={selectedOrders?.length === orders?.length && orders?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order ID</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Items</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order?.id} className="border-b border-border hover:bg-muted/30 transition-colors duration-200">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders?.includes(order?.id)}
                    onChange={() => handleSelectOrder(order?.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm text-foreground">#{order?.id}</span>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{order?.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order?.customerEmail}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{order?.itemCount} items</span>
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium text-foreground">${order?.total?.toFixed(2)}</span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order?.status)}`}>
                    {order?.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{formatDate(order?.createdAt)}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {order?.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onConfirmOrder?.(order?.id)}
                        iconName="Check"
                      >
                        Confirm
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteOrder?.(order?.id)}
                      iconName="Trash2"
                      className="text-error hover:text-error"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {orders?.map((order) => (
          <div key={order?.id} className="bg-background border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-foreground">#{order?.id}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order?.status)}`}>
                {order?.status}
              </span>
            </div>
            
            <div>
              <p className="text-sm font-medium text-foreground">{order?.customerName}</p>
              <p className="text-xs text-muted-foreground">{order?.customerEmail}</p>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{order?.itemCount} items</span>
              <span className="font-medium text-foreground">${order?.total?.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{formatDate(order?.createdAt)}</span>
              <div className="flex items-center space-x-2">
                {order?.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onConfirmOrder?.(order?.id)}
                    iconName="Check"
                  >
                    Confirm
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteOrder?.(order?.id)}
                  iconName="Trash2"
                  className="text-error hover:text-error"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {orders?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="ShoppingBag" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">No orders yet</h4>
          <p className="text-sm text-muted-foreground">Orders will appear here once customers start placing them.</p>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;