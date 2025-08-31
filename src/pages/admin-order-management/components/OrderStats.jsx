import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderStats = ({ orders = [] }) => {
  const calculateStats = () => {
    const totalOrders = orders?.length;
    const pendingOrders = orders?.filter(order => order?.status === 'pending')?.length;
    const completedOrders = orders?.filter(order => order?.status === 'completed')?.length;
    const totalRevenue = orders?.filter(order => order?.status === 'completed')?.reduce((sum, order) => sum + order?.total, 0);

    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayOrders = orders?.filter(order => 
      new Date(order.orderDate) >= todayStart
    )?.length;

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      todayOrders
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders,
      icon: 'ShoppingBag',
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      title: 'Completed Orders',
      value: stats?.completedOrders,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue),
      icon: 'DollarSign',
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Today\'s Orders',
      value: stats?.todayOrders,
      icon: 'Calendar',
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className={`bg-card border rounded-lg p-6 ${stat?.borderColor} hover:shadow-subtle transition-shadow duration-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat?.title}
              </p>
              <p className="text-2xl font-bold text-card-foreground">
                {stat?.value}
              </p>
            </div>
            
            <div className={`w-12 h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
              <Icon 
                name={stat?.icon} 
                size={24} 
                className={stat?.color}
              />
            </div>
          </div>
          
          {/* Progress indicator for pending orders */}
          {stat?.title === 'Pending Orders' && stats?.totalOrders > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Completion Rate</span>
                <span>{Math.round((stats?.completedOrders / stats?.totalOrders) * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(stats?.completedOrders / stats?.totalOrders) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderStats;