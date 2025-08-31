import React from 'react';
import Icon from '../../../components/AppIcon';

const ProductStats = ({ products }) => {
  const totalProducts = products?.length;
  const activeProducts = products?.filter(p => p?.isActive !== false)?.length;
  const lowStockProducts = products?.filter(p => p?.stock <= 10 && p?.stock > 0)?.length;
  const outOfStockProducts = products?.filter(p => p?.stock === 0)?.length;
  
  const categoryBreakdown = products?.reduce((acc, product) => {
    acc[product.category] = (acc?.[product?.category] || 0) + 1;
    return acc;
  }, {});

  const totalValue = products?.reduce((sum, product) => sum + (product?.price * product?.stock), 0);

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: 'Package',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Active Products',
      value: activeProducts,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Low Stock',
      value: lowStockProducts,
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Out of Stock',
      value: outOfStockProducts,
      icon: 'XCircle',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat?.label}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stat?.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
                <Icon name={stat?.icon} size={24} className={stat?.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="BarChart3" size={20} className="mr-2" />
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown)?.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    category === 'liquors' ? 'bg-blue-500' :
                    category === 'vapes' ? 'bg-green-500' :
                    category === 'cigars' ? 'bg-amber-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm font-medium text-foreground capitalize">
                    {category}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {count} products
                </span>
              </div>
            ))}
            {Object.keys(categoryBreakdown)?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No products added yet
              </p>
            )}
          </div>
        </div>

        {/* Inventory Value */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="DollarSign" size={20} className="mr-2" />
            Inventory Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Inventory Value</span>
              <span className="text-lg font-bold text-foreground">
                ${totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Product Price</span>
              <span className="text-sm font-medium text-foreground">
                ${totalProducts > 0 ? (products?.reduce((sum, p) => sum + p?.price, 0) / totalProducts)?.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Stock Units</span>
              <span className="text-sm font-medium text-foreground">
                {products?.reduce((sum, p) => sum + p?.stock, 0)?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Zap" size={20} className="mr-2" />
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lowStockProducts > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-warning/10 rounded-lg">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {lowStockProducts} products need restocking
                </p>
                <p className="text-xs text-muted-foreground">Stock level ≤ 10 units</p>
              </div>
            </div>
          )}
          
          {outOfStockProducts > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-destructive/10 rounded-lg">
              <Icon name="XCircle" size={16} className="text-destructive" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {outOfStockProducts} products out of stock
                </p>
                <p className="text-xs text-muted-foreground">Immediate attention required</p>
              </div>
            </div>
          )}
          
          {totalProducts > 0 && lowStockProducts === 0 && outOfStockProducts === 0 && (
            <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  All products well stocked
                </p>
                <p className="text-xs text-muted-foreground">No immediate action needed</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductStats;