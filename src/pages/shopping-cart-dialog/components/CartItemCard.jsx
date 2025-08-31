import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CartItemCard = ({ 
  item, 
  onUpdateQuantity, 
  onRemove,
  isUpdating = false 
}) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      onRemove(item?.id);
    } else {
      onUpdateQuantity(item?.id, newQuantity);
    }
  };

  const itemTotal = (item?.price * item?.quantity)?.toFixed(2);

  return (
    <div className="flex items-start space-x-4 p-4 bg-card/50 rounded-lg border border-border/50 backdrop-blur-sm">
      {/* Product Image */}
      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg overflow-hidden">
        <Image
          src={item?.image}
          alt={item?.name}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm sm:text-base font-medium text-foreground truncate">
          {item?.name}
        </h4>
        <p className="text-sm text-muted-foreground capitalize mt-1">
          {item?.category}
        </p>
        <p className="text-sm font-medium text-foreground mt-1">
          ${item?.price?.toFixed(2)} each
        </p>
        
        {/* Mobile: Show total price */}
        <div className="sm:hidden mt-2">
          <p className="text-base font-semibold text-foreground">
            ${itemTotal}
          </p>
        </div>
      </div>
      {/* Quantity Controls */}
      <div className="flex flex-col items-end space-y-3">
        <div className="flex items-center space-x-2 bg-background/80 rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(item?.quantity - 1)}
            disabled={isUpdating}
            className="h-8 w-8 rounded-md hover:bg-accent"
            aria-label="Decrease quantity"
          >
            <Icon name="Minus" size={14} />
          </Button>
          
          <span className="w-8 text-center text-sm font-medium text-foreground">
            {item?.quantity}
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(item?.quantity + 1)}
            disabled={isUpdating}
            className="h-8 w-8 rounded-md hover:bg-accent"
            aria-label="Increase quantity"
          >
            <Icon name="Plus" size={14} />
          </Button>
        </div>

        {/* Desktop: Show total price */}
        <div className="hidden sm:block text-right">
          <p className="text-base font-semibold text-foreground">
            ${itemTotal}
          </p>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item?.id)}
          disabled={isUpdating}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors duration-200"
        >
          <Icon name="Trash2" size={14} className="mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItemCard;