import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DialogOverlaySystem from '../../components/ui/DialogOverlaySystem';
import AuthenticationForm from './components/AuthenticationForm';
import AuthenticationSuccess from './components/AuthenticationSuccess';

const AuthenticationDialog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // Mock credentials for testing
  const mockCredentials = {
    customer: {
      email: 'customer@tipsyoak.com',
      password: 'customer123',
      name: 'John Smith'
    },
    admin: {
      email: 'admin@tipsyoak.com',
      password: 'admin123',
      name: 'Admin User'
    }
  };

  // Check if dialog should be open based on route
  const isOpen = location?.pathname === '/authentication-dialog';

  // Load existing authentication state
  useEffect(() => {
    const savedAuth = localStorage.getItem('tipsy_oak_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setAuthenticatedUser(authData);
      } catch (error) {
        console.error('Error loading auth data:', error);
        localStorage.removeItem('tipsy_oak_auth');
      }
    }
  }, []);

  const handleClose = () => {
    setShowSuccess(false);
    setError(null);
    navigate(-1); // Go back to previous page
  };

  const handleModeToggle = (newMode) => {
    setMode(newMode);
    setError(null);
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (mode === 'login') {
        // Validate login credentials
        const isCustomer = formData?.email === mockCredentials?.customer?.email && 
                          formData?.password === mockCredentials?.customer?.password;
        const isAdmin = formData?.email === mockCredentials?.admin?.email && 
                       formData?.password === mockCredentials?.admin?.password;

        if (isCustomer || isAdmin) {
          const userData = {
            id: isAdmin ? 'admin-001' : 'customer-001',
            name: isAdmin ? mockCredentials?.admin?.name : mockCredentials?.customer?.name,
            email: formData?.email,
            role: isAdmin ? 'admin' : 'customer',
            authenticatedAt: new Date()?.toISOString(),
            rememberMe: formData?.rememberMe
          };

          // Save authentication state
          localStorage.setItem('tipsy_oak_auth', JSON.stringify(userData));
          setAuthenticatedUser(userData);
          setShowSuccess(true);

          // Redirect admin users to dashboard
          if (isAdmin) {
            setTimeout(() => {
              navigate('/admin-dashboard');
            }, 2000);
          }
        } else {
          throw new Error('Invalid email or password. Please try again.');
        }
      } else {
        // Handle registration
        if (formData?.email === mockCredentials?.customer?.email || 
            formData?.email === mockCredentials?.admin?.email) {
          throw new Error('An account with this email already exists.');
        }

        const userData = {
          id: `user-${Date.now()}`,
          name: formData?.name,
          email: formData?.email,
          address: formData?.address,
          phone: formData?.phone,
          role: 'customer',
          authenticatedAt: new Date()?.toISOString(),
          createdAt: new Date()?.toISOString()
        };

        // Save authentication state
        localStorage.setItem('tipsy_oak_auth', JSON.stringify(userData));
        setAuthenticatedUser(userData);
        setShowSuccess(true);
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    handleClose();
  };

  return (
    <DialogOverlaySystem
      isOpen={isOpen}
      onClose={handleClose}
      title={showSuccess ? null : "Account Access"}
      description={showSuccess ? null : "Sign in to your account or create a new one"}
      size="default"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="min-h-[400px] flex items-center justify-center">
        {showSuccess ? (
          <AuthenticationSuccess
            mode={mode}
            userName={authenticatedUser?.name}
            onClose={handleSuccessClose}
            autoCloseDelay={3000}
          />
        ) : (
          <AuthenticationForm
            mode={mode}
            onModeToggle={handleModeToggle}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        )}
      </div>

      {/* Mock Credentials Helper */}
      {!showSuccess && (
        <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <span className="w-2 h-2 bg-warning rounded-full mr-2"></span>
            Demo Credentials
          </h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div>
              <strong>Customer:</strong> customer@tipsyoak.com / customer123
            </div>
            <div>
              <strong>Admin:</strong> admin@tipsyoak.com / admin123
            </div>
          </div>
        </div>
      )}
    </DialogOverlaySystem>
  );
};

export default AuthenticationDialog;