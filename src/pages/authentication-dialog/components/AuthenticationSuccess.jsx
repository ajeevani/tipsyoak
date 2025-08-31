import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AuthenticationSuccess = ({ 
  mode, 
  userName, 
  onClose, 
  autoCloseDelay = 3000 
}) => {
  useEffect(() => {
    if (autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoCloseDelay, onClose]);

  const getSuccessMessage = () => {
    if (mode === 'login') {
      return {
        title: 'Welcome back!',
        message: `You have successfully signed in${userName ? ` as ${userName}` : ''}.`,
        icon: 'CheckCircle'
      };
    } else {
      return {
        title: 'Account created!',
        message: `Welcome to Tipsy Oak${userName ? `, ${userName}` : ''}! Your account has been successfully created.`,
        icon: 'UserCheck'
      };
    }
  };

  const { title, message, icon } = getSuccessMessage();

  return (
    <div className="w-full max-w-md mx-auto text-center">
      {/* Success Icon */}
      <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4 animate-fade-in">
        <Icon name={icon} size={32} className="text-success" />
      </div>

      {/* Success Message */}
      <div className="space-y-2 mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {message}
        </p>
      </div>

      {/* Auto-close Indicator */}
      {autoCloseDelay > 0 && (
        <div className="mb-4">
          <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full animate-pulse"
              style={{
                animation: `shrink ${autoCloseDelay}ms linear forwards`
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This dialog will close automatically in {Math.ceil(autoCloseDelay / 1000)} seconds
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          fullWidth
          onClick={onClose}
        >
          Continue Shopping
        </Button>
        
        {mode === 'signup' && (
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              // Navigate to profile or account settings
              onClose?.();
            }}
          >
            Complete Profile
          </Button>
        )}
      </div>

      {/* Welcome Benefits - New Users Only */}
      {mode === 'signup' && (
        <div className="mt-6 p-4 bg-accent rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Welcome Benefits
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={12} className="text-success" />
              <span>Faster checkout process</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={12} className="text-success" />
              <span>Order history tracking</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={12} className="text-success" />
              <span>Exclusive member offers</span>
            </li>
          </ul>
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthenticationSuccess;