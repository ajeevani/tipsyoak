import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavigationHeader from '../components/ui/CustomerNavigationHeader';
import { useCart } from '../components/ui/PersistentCartManager';
import { useAuth } from '../hooks/useAuth';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const ContactPage = () => {
  const navigate = useNavigate();
  const { getCartSummary } = useCart();
  const { user } = useAuth();
  const cartSummary = getCartSummary();

  const handleCartClick = () => {
    navigate('/shopping-cart-dialog');
  };

  const handleAuthClick = () => {
    navigate('/authentication-dialog');
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavigationHeader
        cartCount={cartSummary.itemCount}
        isAuthenticated={!!user}
        onCartClick={handleCartClick}
        onAuthClick={handleAuthClick}
      />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-primary">Contact</span> Us
            </h1>
            <p className="text-xl text-muted-foreground">
              Visit our store or get in touch
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-8 text-primary">Store Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon name="MapPin" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        123 Oak Street<br />
                        Downtown, NY 10001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon name="Phone" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Phone</h3>
                      <p className="text-muted-foreground">(555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon name="Mail" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Email</h3>
                      <p className="text-muted-foreground">info@tipsyoak.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon name="Clock" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Hours</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Monday - Friday: 9:00 AM - 9:00 PM</p>
                        <p>Saturday - Sunday: 10:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button className="w-full">
                      <Icon name="Phone" size={16} className="mr-2" />
                      Call Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Icon name="Navigation" size={16} className="mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="space-y-8">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="aspect-square">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.123456789!2d-73.123456!3d40.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDA3JzI0LjQiTiA3M8KwMDcnMjQuNCJX!5e0!3m2!1sen!2sus!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Tipsy Oak Liquors Location"
                  ></iframe>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Store Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Icon name="Check" size={16} className="text-success" />
                    <span>Free parking available</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="Check" size={16} className="text-success" />
                    <span>Wheelchair accessible</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="Check" size={16} className="text-success" />
                    <span>Pickup orders ready in 15 minutes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="Check" size={16} className="text-success" />
                    <span>Expert staff recommendations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
