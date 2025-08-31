import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = ({ 
  pendingOrdersCount = 0, 
  lowStockCount = 0,
  onExportData,
  onViewReports 
}) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Add products to inventory',
      icon: 'Plus',
      color: 'bg-primary text-primary-foreground',
      onClick: () => navigate('/admin-product-management')
    },
    {
      title: 'Manage Orders',
      description: `${pendingOrdersCount} pending orders`,
      icon: 'ShoppingBag',
      color: 'bg-warning text-warning-foreground',
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      onClick: () => navigate('/admin-order-management')
    },
    {
      title: 'Inventory Alerts',
      description: `${lowStockCount} low stock items`,
      icon: 'AlertTriangle',
      color: 'bg-error text-error-foreground',
      badge: lowStockCount > 0 ? lowStockCount : null,
      onClick: () => navigate('/admin-product-management')
    },
    {
      title: 'Export Data',
      description: 'Download reports & data',
      icon: 'Download',
      color: 'bg-secondary text-secondary-foreground',
      onClick: onExportData
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'order',
      message: 'New order #1234 received',
      time: '2 minutes ago',
      icon: 'ShoppingBag',
      color: 'text-primary'
    },
    {
      id: 2,
      type: 'inventory',
      message: 'Jack Daniels stock running low',
      time: '15 minutes ago',
      icon: 'AlertTriangle',
      color: 'text-warning'
    },
    {
      id: 3,
      type: 'product',
      message: 'Added new product: Premium Cigars',
      time: '1 hour ago',
      icon: 'Package',
      color: 'text-success'
    },
    {
      id: 4,
      type: 'order',
      message: 'Order #1230 marked as ready',
      time: '2 hours ago',
      icon: 'Check',
      color: 'text-success'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions?.map((action, index) => (
            <button
              key={index}
              onClick={action?.onClick}
              className="relative p-4 bg-background border border-border rounded-lg hover:shadow-contextual transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action?.color}`}>
                  <Icon name={action?.icon} size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                    {action?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {action?.description}
                  </p>
                </div>
                {action?.badge && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                    {action?.badge > 99 ? '99+' : action?.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <Button variant="ghost" size="sm" onClick={onViewReports}>
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {recentActivities?.map((activity) => (
            <div key={activity?.id} className="flex items-center space-x-3 p-3 bg-background rounded-lg border border-border">
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${activity?.color}`}>
                <Icon name={activity?.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">
                  {activity?.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity?.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* System Status */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Database</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-success">Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Payment Gateway</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-success">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Inventory Sync</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-sm text-warning">Syncing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;