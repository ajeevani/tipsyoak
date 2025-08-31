import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CheckoutSection = ({ 
  total = 0, 
  itemCount = 0, 
  onClose,
  isAuthenticated = false 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!isAuthenticated) {
        // Redirect to authentication for guest users
        onClose();
        navigate('/authentication-dialog');
      } else {
        // Process order for authenticated users
        // This would typically involve API calls
        console.log('Processing order for authenticated user');
        
        // Show success message and redirect
        alert('Order placed successfully! You will receive a confirmation email shortly.');
        onClose();
        navigate('/');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/products-catalog');
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="space-y-4 p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
      {/* Checkout Button */}
      <Button
        variant="default"
        onClick={handleCheckout}
        disabled={isProcessing}
        loading={isProcessing}
        className="w-full h-12 text-base font-semibold"
      >
        {isProcessing ? (
          'Processing...'
        ) : (
          <>
            <Icon name="CreditCard" size={18} className="mr-2" />
            {isAuthenticated ? 'Place Order' : 'Proceed to Checkout'}
          </>
        )}
      </Button>

      {/* Continue Shopping */}
      <Button
        variant="outline"
        onClick={handleContinueShopping}
        className="w-full"
        disabled={isProcessing}
      >
        <Icon name="ArrowLeft" size={16} className="mr-2" />
        Continue Shopping
      </Button>

      {/* Order Info */}
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          {!isAuthenticated && 'Sign in required for checkout • '}
          Pickup only • No delivery available
        </p>
        
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} />
            <span>Secure checkout</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>Ready in 15-30 min</span>
          </div>
        </div>
      </div>

      {/* Minimum Age Notice */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
          <div className="text-xs text-foreground">
            <p className="font-medium mb-1">Age Verification Required</p>
            <p className="text-muted-foreground">
              You must be 21+ to purchase these products. Valid ID required at pickup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSection;