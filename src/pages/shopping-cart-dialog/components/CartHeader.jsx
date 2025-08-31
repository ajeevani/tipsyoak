import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CartHeader = ({ 
  itemCount = 0, 
  onClose, 
  onClearCart,
  showClearButton = true 
}) => {
  const handleClearCart = () => {
    if (itemCount > 0) {
      const confirmed = window.confirm(
        `Are you sure you want to remove all ${itemCount} ${itemCount === 1 ? 'item' : 'items'} from your cart?`
      );
      
      if (confirmed) {
        onClearCart();
      }
    }
  };

  return (
    <div className="flex items-center justify-between p-6 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="ShoppingCart" size={18} className="text-primary" />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Shopping Cart
          </h2>
          <p className="text-sm text-muted-foreground">
            {itemCount === 0 
              ? 'No items' 
              : `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
            }
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Clear Cart Button */}
        {showClearButton && itemCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCart}
            className="text-muted-foreground hover:text-destructive"
          >
            <Icon name="Trash2" size={16} className="mr-1" />
            Clear
          </Button>
        )}

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full hover:bg-accent"
          aria-label="Close cart"
        >
          <Icon name="X" size={18} />
        </Button>
      </div>
    </div>
  );
};

export default CartHeader;