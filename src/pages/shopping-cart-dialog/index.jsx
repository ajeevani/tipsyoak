import React, { useState, useEffect } from 'react';
import DialogOverlaySystem from '../../components/ui/DialogOverlaySystem';
import CartHeader from './components/CartHeader';
import CartItemCard from './components/CartItemCard';
import CartSummary from './components/CartSummary';
import EmptyCartState from './components/EmptyCartState';
import CheckoutSection from './components/CheckoutSection';

const ShoppingCartDialog = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock cart data
  const mockCartItems = [
    {
      id: 1,
      name: "Johnnie Walker Blue Label",
      price: 189.99,
      quantity: 1,
      category: "liquors",
      image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "JUUL Mint Pods",
      price: 24.99,
      quantity: 2,
      category: "vapes",
      image: "https://images.pexels.com/photos/7148621/pexels-photo-7148621.jpeg?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Cohiba Robusto Cigars",
      price: 45.00,
      quantity: 1,
      category: "cigars",
      image: "https://images.pixabay.com/photo/2016/03/27/19/43/cigar-1283292_1280.jpg?w=400&h=400&fit=crop"
    }
  ];

  // Load cart data on component mount
  useEffect(() => {
    // Simulate loading cart from localStorage
    const savedCart = localStorage.getItem('tipsy_oak_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart?.items || []);
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems(mockCartItems);
      }
    } else {
      // Use mock data for demonstration
      setCartItems(mockCartItems);
    }

    // Check authentication status
    const authStatus = localStorage.getItem('tipsy_oak_auth');
    setIsAuthenticated(!!authStatus);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (cartItems?.length >= 0) {
      const cartData = {
        items: cartItems,
        lastUpdated: new Date()?.toISOString()
      };
      localStorage.setItem('tipsy_oak_cart', JSON.stringify(cartData));
    }
  }, [cartItems]);

  const handleClose = () => {
    setIsOpen(false);
    // In a real app, this would be handled by parent component
    window.history?.back();
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    setIsUpdating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCartItems(prevItems =>
        prevItems?.map(item =>
          item?.id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    const item = cartItems?.find(item => item?.id === itemId);
    if (!item) return;

    const confirmed = window.confirm(
      `Remove "${item?.name}" from your cart?`
    );

    if (!confirmed) return;

    setIsUpdating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCartItems(prevItems =>
        prevItems?.filter(item => item?.id !== itemId)
      );
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    setIsUpdating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCartItems([]);
      localStorage.removeItem('tipsy_oak_cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  const itemCount = cartItems?.reduce((sum, item) => sum + item?.quantity, 0);
  const taxRate = 0.0875;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-background">
      <DialogOverlaySystem
        isOpen={isOpen}
        onClose={handleClose}
        size="lg"
        showCloseButton={false}
        className="max-h-[90vh] flex flex-col glass-effect"
        title="Shopping Cart"
        description="Review and manage items in your shopping cart"
      >
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <CartHeader
            itemCount={itemCount}
            onClose={handleClose}
            onClearCart={handleClearCart}
            showClearButton={cartItems?.length > 0}
          />

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {cartItems?.length === 0 ? (
              <EmptyCartState onClose={handleClose} />
            ) : (
              <div className="p-6 space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems?.map((item) => (
                    <CartItemCard
                      key={item?.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                      isUpdating={isUpdating}
                    />
                  ))}
                </div>

                {/* Cart Summary */}
                <CartSummary
                  subtotal={subtotal}
                  tax={tax}
                  total={total}
                  itemCount={itemCount}
                />
              </div>
            )}
          </div>

          {/* Checkout Section */}
          <CheckoutSection
            total={total}
            itemCount={itemCount}
            onClose={handleClose}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </DialogOverlaySystem>
    </div>
  );
};

export default ShoppingCartDialog;