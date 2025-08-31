import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  description,
  className = '' 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 shadow-subtle hover:shadow-contextual transition-shadow duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        </div>
      </div>
      
      {change && (
        <div className="flex items-center space-x-2">
          <Icon name={getChangeIcon()} size={16} className={getChangeColor()} />
          <span className={`text-sm font-medium ${getChangeColor()}`}>
            {change}
          </span>
          {description && (
            <span className="text-sm text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricsCard;