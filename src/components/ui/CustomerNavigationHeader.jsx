import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const CustomerNavigationHeader = ({ 
  cartCount = 0, 
  isAuthenticated = false, 
  onCartClick, 
  onAuthClick,
  onMenuToggle 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    onAuthClick?.();
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const navigationItems = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Products', path: '/products-catalog', icon: 'Package' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-navigation bg-background transition-all duration-200 ${
        isScrolled ? 'nav-shadow' : ''
      }`}
    >
      <div className="w-full px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - No left padding */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Wine" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-primary">
              Tipsy Oak
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item?.path)
                    ? 'text-primary bg-accent' :'text-foreground hover:text-primary hover:bg-accent'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCartClick}
              className="relative touch-target"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <Icon name="ShoppingCart" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center animate-fade-in">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>

            {/* Auth Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAuthClick}
              className="touch-target"
              aria-label={isAuthenticated ? 'User account' : 'Sign in'}
            >
              <Icon name={isAuthenticated ? "User" : "LogIn"} size={20} />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobileMenuToggle}
              className="md:hidden touch-target"
              aria-label="Toggle menu"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-slide-up">
            <nav className="py-4 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors duration-200 touch-target ${
                    isActivePath(item?.path)
                      ? 'text-primary bg-accent' :'text-foreground hover:text-primary hover:bg-accent'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-border pt-4 mt-4">
                <div className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Account
                </div>
                <button
                  onClick={() => {
                    handleAuthClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-accent transition-colors duration-200 w-full text-left touch-target"
                >
                  <Icon name={isAuthenticated ? "User" : "LogIn"} size={18} />
                  <span>{isAuthenticated ? 'My Account' : 'Sign In'}</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default CustomerNavigationHeader;