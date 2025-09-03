import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AdminNavigationSidebar = ({ 
  isCollapsed = false, 
  onToggle,
  pendingOrders = 0,
  lowStockItems = 0,
  onLogout 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleToggle = () => {
    onToggle?.(!isCollapsed);
  };

  const handleLogout = () => {
    onLogout?.();
    navigate('/authentication-dialog');
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/admin-dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview & Analytics'
    },
    {
      label: 'Products',
      path: '/admin-product-management',
      icon: 'Package',
      description: 'Inventory Management',
      badge: lowStockItems > 0 ? lowStockItems : null,
      badgeColor: 'warning'
    },
    {
      label: 'Orders',
      path: '/admin-order-management',
      icon: 'ShoppingBag',
      description: 'Order Processing',
      badge: pendingOrders > 0 ? pendingOrders : null,
      badgeColor: 'primary'
    }
  ];

  const shouldShowContent = !isCollapsed;

  return (
    <>
      {/* Desktop Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full bg-background border-r border-border transition-all duration-300 z-40 flex flex-col ${
          isCollapsed ? 'w-16' : 'w-64'
        } hidden lg:flex`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between min-h-[64px]">
          {shouldShowContent && (
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary">Tipsy Oak</h3>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="hover:bg-accent"
          >
            <Icon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={16} 
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                isActivePath(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon name={item.icon} size={20} className="flex-shrink-0" />
              
              {shouldShowContent && (
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        item.badgeColor === 'warning' 
                          ? 'bg-warning text-warning-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <Icon name="LogOut" size={16} className="flex-shrink-0" />
            {shouldShowContent && (
              <span className="ml-3 text-sm">Sign Out</span>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 bg-background border-b border-border">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
            >
              <Icon name="Menu" size={20} />
            </Button>
            <div>
              <h3 className="text-lg font-semibold text-primary">Tipsy Oak</h3>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isActivePath(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon name={item.icon} size={20} />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.badgeColor === 'warning' 
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          ))}
        </nav>

        {/* Mobile Footer */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Icon name="LogOut" size={16} />
            <span className="ml-3 text-sm">Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminNavigationSidebar;
