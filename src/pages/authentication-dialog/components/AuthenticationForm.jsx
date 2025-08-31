import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AuthenticationForm = ({ 
  mode, 
  onModeToggle, 
  onSubmit, 
  loading = false, 
  error = null 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors?.[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData?.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData?.password) {
      errors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Registration-specific validations
    if (mode === 'signup') {
      if (!formData?.name?.trim()) {
        errors.name = 'Full name is required';
      }

      if (!formData?.address?.trim()) {
        errors.address = 'Address is required';
      }

      if (!formData?.phone?.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!/^\(\d{3}\) \d{3}-\d{4}$/?.test(formData?.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value?.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits?.length >= 6) {
      return `(${digits?.slice(0, 3)}) ${digits?.slice(3, 6)}-${digits?.slice(6, 10)}`;
    } else if (digits?.length >= 3) {
      return `(${digits?.slice(0, 3)}) ${digits?.slice(3)}`;
    } else {
      return digits;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e?.target?.value);
    handleInputChange('phone', formatted);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex bg-muted rounded-lg p-1">
          <button
            type="button"
            onClick={() => onModeToggle('login')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              mode === 'login' ?'bg-background text-foreground shadow-subtle' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => onModeToggle('signup')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              mode === 'signup' ?'bg-background text-foreground shadow-subtle' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field - Signup Only */}
        {mode === 'signup' && (
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={validationErrors?.name}
            required
            disabled={loading}
          />
        )}

        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={validationErrors?.email}
          required
          disabled={loading}
        />

        {/* Password Field */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={validationErrors?.password}
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors duration-200"
            disabled={loading}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
          </button>
        </div>

        {/* Address Field - Signup Only */}
        {mode === 'signup' && (
          <Input
            label="Address"
            type="text"
            placeholder="Enter your address"
            value={formData?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            error={validationErrors?.address}
            required
            disabled={loading}
          />
        )}

        {/* Phone Field - Signup Only */}
        {mode === 'signup' && (
          <Input
            label="Phone Number"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData?.phone}
            onChange={handlePhoneChange}
            error={validationErrors?.phone}
            required
            disabled={loading}
          />
        )}

        {/* Remember Me - Login Only */}
        {mode === 'login' && (
          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              checked={formData?.rememberMe}
              onChange={(e) => handleInputChange('rememberMe', e?.target?.checked)}
              disabled={loading}
            />
            <button
              type="button"
              className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <p className="text-sm text-error">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={loading}
          disabled={loading}
          className="mt-6"
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
      {/* Social Authentication */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-popover px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            className="w-full"
          >
            <Icon name="Mail" size={16} className="mr-2" />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            className="w-full"
          >
            <Icon name="Facebook" size={16} className="mr-2" />
            Facebook
          </Button>
        </div>
      </div>
      {/* Terms and Privacy - Signup Only */}
      {mode === 'signup' && (
        <p className="mt-4 text-xs text-center text-muted-foreground">
          By creating an account, you agree to our{' '}
          <button className="text-primary hover:text-primary/80 transition-colors duration-200">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-primary hover:text-primary/80 transition-colors duration-200">
            Privacy Policy
          </button>
        </p>
      )}
    </div>
  );
};

export default AuthenticationForm;