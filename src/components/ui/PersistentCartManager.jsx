import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Icon from '../AppIcon';


// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
  LOAD_CART: 'LOAD_CART',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  APPLY_DISCOUNT: 'APPLY_DISCOUNT',
  REMOVE_DISCOUNT: 'REMOVE_DISCOUNT'
};

// Initial cart state
const initialCartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  discount: null,
  discountAmount: 0,
  total: 0,
  lastUpdated: null
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action?.type) {
    case CART_ACTIONS?.LOAD_CART:
      return {
        ...state,
        ...action?.payload
      };

    case CART_ACTIONS?.ADD_ITEM: {
      const { product, quantity = 1 } = action?.payload;
      const existingItemIndex = state?.items?.findIndex(item => item?.id === product?.id);
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state?.items?.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item?.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state?.items, {
          id: product?.id,
          name: product?.name,
          price: product?.price,
          image: product?.image,
          category: product?.category,
          quantity: quantity,
          addedAt: new Date()?.toISOString()
        }];
      }

      return calculateCartTotals({
        ...state,
        items: newItems,
        lastUpdated: new Date()?.toISOString()
      });
    }

    case CART_ACTIONS?.REMOVE_ITEM: {
      let newItems = state?.items?.filter(item => item?.id !== action?.payload?.itemId);
      return calculateCartTotals({
        ...state,
        items: newItems,
        lastUpdated: new Date()?.toISOString()
      });
    }

    case CART_ACTIONS?.UPDATE_QUANTITY: {
      const { itemId, quantity } = action?.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        let newItems = state?.items?.filter(item => item?.id !== itemId);
        return calculateCartTotals({
          ...state,
          items: newItems,
          lastUpdated: new Date()?.toISOString()
        });
      }

      let newItems = state?.items?.map(item =>
        item?.id === itemId
          ? { ...item, quantity: quantity }
          : item
      );

      return calculateCartTotals({
        ...state,
        items: newItems,
        lastUpdated: new Date()?.toISOString()
      });
    }

    case CART_ACTIONS?.CLEAR_CART:
      return {
        ...initialCartState,
        lastUpdated: new Date()?.toISOString()
      };

    case CART_ACTIONS?.APPLY_DISCOUNT: {
      const { code, type, value } = action?.payload;
      return calculateCartTotals({
        ...state,
        discount: { code, type, value },
        lastUpdated: new Date()?.toISOString()
      });
    }

    case CART_ACTIONS?.REMOVE_DISCOUNT:
      return calculateCartTotals({
        ...state,
        discount: null,
        lastUpdated: new Date()?.toISOString()
      });

    default:
      return state;
  }
};

// Helper function to calculate cart totals
const calculateCartTotals = (state) => {
  const subtotal = state?.items?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  const totalItems = state?.items?.reduce((sum, item) => sum + item?.quantity, 0);
  
  let discountAmount = 0;
  if (state?.discount) {
    if (state?.discount?.type === 'percentage') {
      discountAmount = subtotal * (state?.discount?.value / 100);
    } else if (state?.discount?.type === 'fixed') {
      discountAmount = Math.min(state?.discount?.value, subtotal);
    }
  }

  const total = Math.max(0, subtotal - discountAmount);

  return {
    ...state,
    totalItems,
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

// Local storage key
const CART_STORAGE_KEY = 'tipsy_oak_cart';

// Cart Provider Component
export const PersistentCartManager = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate cart structure and recalculate totals
        if (parsedCart?.items && Array.isArray(parsedCart?.items)) {
          dispatch({
            type: CART_ACTIONS?.LOAD_CART,
            payload: calculateCartTotals(parsedCart)
          });
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Clear corrupted cart data
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartState?.lastUpdated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartState]);

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS?.ADD_ITEM,
      payload: { product, quantity }
    });
  };

  const removeFromCart = (itemId) => {
    dispatch({
      type: CART_ACTIONS?.REMOVE_ITEM,
      payload: { itemId }
    });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({
      type: CART_ACTIONS?.UPDATE_QUANTITY,
      payload: { itemId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS?.CLEAR_CART });
  };

  const applyDiscount = (code, type, value) => {
    dispatch({
      type: CART_ACTIONS?.APPLY_DISCOUNT,
      payload: { code, type, value }
    });
  };

  const removeDiscount = () => {
    dispatch({ type: CART_ACTIONS?.REMOVE_DISCOUNT });
  };

  // Helper functions
  const getItemQuantity = (productId) => {
    const item = cartState?.items?.find(item => item?.id === productId);
    return item ? item?.quantity : 0;
  };

  const isInCart = (productId) => {
    return cartState?.items?.some(item => item?.id === productId);
  };

  const getCartSummary = () => ({
    itemCount: cartState?.totalItems,
    subtotal: cartState?.subtotal,
    discount: cartState?.discount,
    discountAmount: cartState?.discountAmount,
    total: cartState?.total,
    isEmpty: cartState?.items?.length === 0
  });

  // Context value
  const contextValue = {
    // State
    cart: cartState,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyDiscount,
    removeDiscount,
    
    // Helpers
    getItemQuantity,
    isInCart,
    getCartSummary
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a PersistentCartManager');
  }
  return context;
};

// Cart item component for consistent rendering
export const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  showImage = true,
  showControls = true,
  className = '' 
}) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      onRemove?.(item?.id);
    } else {
      onUpdateQuantity?.(item?.id, newQuantity);
    }
  };

  return (
    <div className={`flex items-center space-x-4 p-4 bg-card rounded-lg border border-border ${className}`}>
      {showImage && (
        <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg overflow-hidden">
          <img
            src={item?.image || '/assets/images/no_image.png'}
            alt={item?.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/assets/images/no_image.png';
            }}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">
          {item?.name}
        </h4>
        <p className="text-sm text-muted-foreground">
          ${item?.price?.toFixed(2)} each
        </p>
        {item?.category && (
          <p className="text-xs text-muted-foreground capitalize">
            {item?.category}
          </p>
        )}
      </div>
      {showControls && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(item?.quantity - 1)}
            className="w-8 h-8 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors duration-200"
            aria-label="Decrease quantity"
          >
            <Icon name="Minus" size={14} />
          </button>
          
          <span className="w-8 text-center text-sm font-medium">
            {item?.quantity}
          </span>
          
          <button
            onClick={() => handleQuantityChange(item?.quantity + 1)}
            className="w-8 h-8 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors duration-200"
            aria-label="Increase quantity"
          >
            <Icon name="Plus" size={14} />
          </button>
        </div>
      )}
      <div className="text-right">
        <p className="text-sm font-medium text-foreground">
          ${(item?.price * item?.quantity)?.toFixed(2)}
        </p>
        {showControls && (
          <button
            onClick={() => onRemove?.(item?.id)}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors duration-200 mt-1"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default PersistentCartManager;