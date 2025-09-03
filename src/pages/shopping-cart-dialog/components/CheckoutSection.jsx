import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../hooks/useAuth';
import { useOrders } from '../../../hooks/useOrders';

const CheckoutSection = ({ 
  items, 
  subtotal, 
  tax, 
  total, 
  onOrderComplete 
}) => {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    if (user) {
      // Pre-fill form with user data
      setFormData({
        name: user.user_metadata?.name || user.email,
        email: user.email,
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address || ''
      });
    }
    
    setShowCheckoutForm(true);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        subtotal: subtotal,
        tax: tax,
        total: total,
        user_id: user?.id || null
      };
      
      const orderItems = items.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { data, error } = await createOrder(orderData, orderItems);
      
      if (error) {
        console.error('Error creating order:', error);
        return;
      }
      
      // Order created successfully
      onOrderComplete?.();
      setShowCheckoutForm(false);
      
      // Show success message or redirect
      alert('Order placed successfully! We\'ll prepare your order for pickup.');
      
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showCheckoutForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCheckoutForm(false)}
          >
            <Icon name="ArrowLeft" size={16} />
          </Button>
          <h3 className="text-lg font-semibold">Checkout Details</h3>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-4">
          <Input
            label="Full Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />
          
          <Input
            label="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />
          
          <Input
            label="Phone Number *"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            required
          />
          
          <Input
            label="Address (Optional)"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          {/* Order Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCheckoutForm(false)}
              className="flex-1"
            >
              Back to Cart
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              <Icon name="Check" size={16} className="mr-2" />
              Place Order
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cart Summary */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (8.5%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button - FIXED */}
      <Button 
        onClick={handleCheckout}
        disabled={items.length === 0}
        className="w-full"
        size="lg"
      >
        <Icon name="CreditCard" size={16} className="mr-2" />
        Proceed to Checkout ({items.length} items)
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Pickup only • Ready in 15 minutes
      </p>
    </div>
  );
};

export default CheckoutSection;
