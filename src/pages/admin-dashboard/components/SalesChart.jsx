import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';


const SalesChart = () => {
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('7days');

  // Mock sales data
  const salesData = {
    '7days': [
      { name: 'Mon', sales: 1200, orders: 15 },
      { name: 'Tue', sales: 1900, orders: 22 },
      { name: 'Wed', sales: 800, orders: 12 },
      { name: 'Thu', sales: 2400, orders: 28 },
      { name: 'Fri', sales: 3200, orders: 35 },
      { name: 'Sat', sales: 4100, orders: 42 },
      { name: 'Sun', sales: 2800, orders: 31 }
    ],
    '30days': [
      { name: 'Week 1', sales: 8500, orders: 95 },
      { name: 'Week 2', sales: 12200, orders: 134 },
      { name: 'Week 3', sales: 9800, orders: 108 },
      { name: 'Week 4', sales: 15600, orders: 167 }
    ],
    '90days': [
      { name: 'Month 1', sales: 45000, orders: 504 },
      { name: 'Month 2', sales: 52000, orders: 578 },
      { name: 'Month 3', sales: 48000, orders: 532 }
    ]
  };

  const categoryData = [
    { name: 'Liquors', value: 45, color: '#DC2626' },
    { name: 'Vapes', value: 35, color: '#374151' },
    { name: 'Cigars', value: 20, color: '#F3F4F6' }
  ];

  const currentData = salesData?.[timeRange];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-medium text-popover-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {entry?.name}: <span className="font-medium text-foreground">
                {entry?.name === 'sales' ? `$${entry?.value?.toLocaleString()}` : entry?.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Share']}
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="sales" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-foreground">Sales Analytics</h3>
        
        <div className="flex items-center space-x-2">
          {/* Time Range Selector */}
          <div className="flex bg-muted rounded-lg p-1">
            {[
              { key: '7days', label: '7D' },
              { key: '30days', label: '30D' },
              { key: '90days', label: '90D' }
            ]?.map((range) => (
              <button
                key={range?.key}
                onClick={() => setTimeRange(range?.key)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                  timeRange === range?.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range?.label}
              </button>
            ))}
          </div>
          
          {/* Chart Type Selector */}
          <div className="flex bg-muted rounded-lg p-1">
            {[
              { key: 'bar', icon: 'BarChart3' },
              { key: 'line', icon: 'TrendingUp' },
              { key: 'pie', icon: 'PieChart' }
            ]?.map((type) => (
              <button
                key={type?.key}
                onClick={() => setChartType(type?.key)}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  chartType === type?.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={type?.icon} size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Chart Container */}
      <div className="w-full">
        {renderChart()}
      </div>
      {/* Chart Legend for Pie Chart */}
      {chartType === 'pie' && (
        <div className="flex justify-center mt-4 space-x-6">
          {categoryData?.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item?.color }}
              ></div>
              <span className="text-sm text-muted-foreground">
                {item?.name} ({item?.value}%)
              </span>
            </div>
          ))}
        </div>
      )}
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">
            ${currentData?.reduce((sum, item) => sum + item?.sales, 0)?.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Total Sales</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">
            {currentData?.reduce((sum, item) => sum + item?.orders, 0)}
          </p>
          <p className="text-xs text-muted-foreground">Total Orders</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">
            ${Math.round(currentData?.reduce((sum, item) => sum + item?.sales, 0) / currentData?.reduce((sum, item) => sum + item?.orders, 0))}
          </p>
          <p className="text-xs text-muted-foreground">Avg Order</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-success">+12.5%</p>
          <p className="text-xs text-muted-foreground">Growth</p>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;