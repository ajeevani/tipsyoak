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

  const shouldShowContent = !isCollapsed || isHovered;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-navigation h-full bg-card border-r border-border transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        } hidden lg:block`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className={`flex items-center space-x-3 transition-opacity duration-200 ${
              shouldShowContent ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Wine" size={20} color="white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Tipsy Oak</h2>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
              className="h-8 w-8"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-subtle'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <div className="flex-shrink-0">
                  <Icon name={item?.icon} size={18} />
                </div>
                
                <div className={`flex-1 transition-opacity duration-200 ${
                  shouldShowContent ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item?.label}</div>
                      <div className="text-xs opacity-75">{item?.description}</div>
                    </div>
                    
                    {item?.badge && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item?.badgeColor === 'warning' ?'bg-warning text-warning-foreground' :'bg-primary text-primary-foreground'
                      }`}>
                        {item?.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tooltip for collapsed state */}
                {isCollapsed && !isHovered && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-elevated opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-dropdown">
                    {item?.label}
                    {item?.badge && (
                      <span className="ml-2 px-1.5 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                        {item?.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={`w-full justify-start space-x-3 text-sm font-medium ${
                shouldShowContent ? '' : 'px-3'
              }`}
            >
              <Icon name="LogOut" size={18} />
              <span className={`transition-opacity duration-200 ${
                shouldShowContent ? 'opacity-100' : 'opacity-0'
              }`}>
                Sign Out
              </span>
            </Button>
            
            {isCollapsed && !isHovered && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-elevated opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-dropdown bottom-4">
                Sign Out
              </div>
            )}
          </div>
        </div>
      </aside>
      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden fixed inset-0 z-dialog-backdrop bg-black/50 transition-opacity duration-300 ${
        !isCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <aside className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 ${
          !isCollapsed ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Wine" size={20} color="white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Tipsy Oak</h2>
                  <p className="text-xs text-muted-foreground">Admin Panel</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                className="h-8 w-8"
                aria-label="Close sidebar"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={handleToggle}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 touch-target ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item?.label}</div>
                        <div className="text-xs opacity-75">{item?.description}</div>
                      </div>
                      
                      {item?.badge && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item?.badgeColor === 'warning' ?'bg-warning text-warning-foreground' :'bg-primary text-primary-foreground'
                        }`}>
                          {item?.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </nav>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start space-x-3 text-sm font-medium touch-target"
              >
                <Icon name="LogOut" size={18} />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default AdminNavigationSidebar;