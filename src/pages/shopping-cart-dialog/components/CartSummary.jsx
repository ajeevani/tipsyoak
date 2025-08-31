import React from 'react';

const CartSummary = ({ 
  subtotal = 0, 
  tax = 0, 
  total = 0,
  itemCount = 0 
}) => {
  const taxRate = 0.0875; // 8.75% tax rate
  const calculatedTax = subtotal * taxRate;
  const calculatedTotal = subtotal + calculatedTax;

  return (
    <div className="space-y-3 p-4 bg-card/30 rounded-lg border border-border/50 backdrop-blur-sm">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
        <span className="font-medium text-foreground">
          ${subtotal?.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          Tax (8.75%)
        </span>
        <span className="font-medium text-foreground">
          ${calculatedTax?.toFixed(2)}
        </span>
      </div>
      <div className="border-t border-border/50 pt-3">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-foreground">
            Total
          </span>
          <span className="text-lg font-bold text-primary">
            ${calculatedTotal?.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        <p>* Pickup only - No delivery charges</p>
        <p>* Tax calculated at checkout</p>
      </div>
    </div>
  );
};

export default CartSummary;