import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const CustomerNavigationHeader = ({ 
  cartCount = 0, 
  isAuthenticated = false, 
  onCartClick, 
  onAuthClick,
  onMenuToggle,
  onContactClick
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    onMenuToggle?.(!isMobileMenuOpen);
  };

  const handleCartClick = () => {
    onCartClick?.();
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      onAuthClick?.();
    }
  };

  // FIXED: Contact navigation logic
  const handleContactClick = () => {
    if (location.pathname === '/') {
      // On homepage - scroll to contact section
      onContactClick?.();
    } else {
      // On other pages - navigate to homepage and then scroll
      navigate('/', { state: { scrollToContact: true } });
    }
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const navigationItems = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Products', path: '/products-catalog', icon: 'Package' },
    { label: 'Contact', action: handleContactClick, icon: 'MapPin' }
  ];

  // FIXED: Profile menu for authenticated users
  const ProfileMenu = () => (
    <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
      <div className="px-4 py-2 border-b border-border">
        <p className="text-sm font-medium">Account</p>
        <p className="text-xs text-muted-foreground">Manage your profile</p>
      </div>
      <button className="w-full text-left px-4 py-2 text-sm hover:bg-accent">
        <Icon name="User" size={14} className="mr-2 inline" />
        Profile Settings
      </button>
      <button className="w-full text-left px-4 py-2 text-sm hover:bg-accent">
        <Icon name="ShoppingBag" size={14} className="mr-2 inline" />
        Order History
      </button>
      <hr className="my-1" />
      <button 
        className="w-full text-left px-4 py-2 text-sm hover:bg-accent text-destructive"
        onClick={() => {
          setShowProfileMenu(false);
          // Add sign out logic here
        }}
      >
        <Icon name="LogOut" size={14} className="mr-2 inline" />
        Sign Out
      </button>
    </div>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-background'
    } border-b border-border`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-primary">Tipsy Oak</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              item.path ? (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              )
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Auth Button - FIXED PROFILE MENU */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAuthClick}
                className="relative"
              >
                <Icon name={isAuthenticated ? "User" : "UserCircle"} size={20} />
              </Button>
              
              {/* Profile Menu */}
              {showProfileMenu && isAuthenticated && <ProfileMenu />}
            </div>

            {/* Cart Button - FIXED */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCartClick}
              className="relative"
            >
              <Icon name="ShoppingCart" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobileMenuToggle}
              className="md:hidden"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* FIXED: Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => (
              item.path ? (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                    isActivePath(item.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent w-full text-left"
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              )
            ))}
            
            {/* Mobile Auth Section */}
            {isAuthenticated && (
              <div className="border-t pt-2 mt-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">Logged in</p>
                  <p className="text-xs text-muted-foreground">Tap to manage account</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside handler for profile menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
};

export default CustomerNavigationHeader;
