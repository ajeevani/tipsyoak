import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useCart } from '../../../components/ui/PersistentCartManager';

const ProductCard = ({ product }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const currentQuantity = getItemQuantity(product?.id);

  const handleAddToCart = () => {
    setIsAnimating(true);
    addToCart(product, 1);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(product?.id, newQuantity);
  };

  const getPercentageLabel = (category) => {
    switch (category) {
      case 'liquors':
        return 'ABV';
      case 'vapes':
        return 'Nicotine';
      case 'cigars':
        return 'Tobacco';
      default:
        return 'Strength';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-subtle hover:shadow-contextual transition-all duration-200 micro-interaction">
      {/* Product Image */}
      <div className="aspect-square bg-muted overflow-hidden">
        <Image
          src={product?.image}
          alt={product?.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-foreground mb-2 line-clamp-2">
          {product?.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-muted-foreground">
            {getPercentageLabel(product?.category)}: {product?.percentage}%
          </div>
          <div className="text-lg font-semibold text-foreground">
            ${product?.price?.toFixed(2)}
          </div>
        </div>

        {/* Add to Cart / Quantity Controls */}
        <div className="space-y-2">
          {currentQuantity === 0 ? (
            <Button
              variant="default"
              fullWidth
              onClick={handleAddToCart}
              className={`transition-all duration-300 ${
                isAnimating ? 'scale-95 bg-success' : ''
              }`}
              iconName={isAnimating ? "Check" : "Plus"}
              iconPosition="left"
            >
              {isAnimating ? 'Added!' : 'Add to Cart'}
            </Button>
          ) : (
            <div className="flex items-center justify-between bg-accent rounded-lg p-2 animate-fade-in">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(currentQuantity - 1)}
                className="h-8 w-8"
              >
                <Icon name="Minus" size={16} />
              </Button>
              
              <span className="text-sm font-medium px-3">
                {currentQuantity}
              </span>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(currentQuantity + 1)}
                className="h-8 w-8"
              >
                <Icon name="Plus" size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;