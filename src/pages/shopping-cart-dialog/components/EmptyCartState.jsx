import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyCartState = ({ onClose }) => {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-24 h-24 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
        <Icon name="ShoppingCart" size={32} className="text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Your cart is empty
      </h3>
      
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        Looks like you haven't added any items to your cart yet. 
        Start exploring our premium selection of liquors, vapes, and cigars.
      </p>

      <div className="space-y-3">
        <Link to="/products-catalog" onClick={onClose}>
          <Button variant="default" className="w-full sm:w-auto">
            <Icon name="Package" size={16} className="mr-2" />
            Browse Products
          </Button>
        </Link>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link to="/products-catalog?category=liquors" onClick={onClose}>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Liquors
            </Button>
          </Link>
          
          <Link to="/products-catalog?category=vapes" onClick={onClose}>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Vapes
            </Button>
          </Link>
          
          <Link to="/products-catalog?category=cigars" onClick={onClose}>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Cigars
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyCartState;