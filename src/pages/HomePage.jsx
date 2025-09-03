import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavigationHeader from '../components/ui/CustomerNavigationHeader';
import SplashScreen from '../components/ui/SplashScreen';
import { useCart } from '../components/ui/PersistentCartManager';
import { useAuth } from '../hooks/useAuth';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const HomePage = () => {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('hasSeenSplash');
  });
  const navigate = useNavigate();
  const { getCartSummary } = useCart();
  const { user } = useAuth();
  const cartSummary = getCartSummary();

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  const handleCartClick = () => {
    navigate('/shopping-cart-dialog');
  };

  const handleAuthClick = () => {
    if (user) {
      // Show profile dialog/menu
      navigate('/profile'); // or show profile dropdown
    } else {
      navigate('/authentication-dialog');
    }
  };

  const categories = [
    {
      id: 'liquors',
      name: 'Liquors',
      description: 'Premium spirits and fine wines',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&h=400&fit=crop&q=80',
      icon: 'Wine'
    },
    {
      id: 'vapes',
      name: 'Vapes',
      description: 'Modern vaping devices',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=400&fit=crop&q=80',
      icon: 'Zap'
    },
    {
      id: 'cigars',
      name: 'Cigars',
      description: 'Hand-rolled premium cigars',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80',
      icon: 'Cigarette'
    }
  ];

  // FIXED: Proper category navigation
  const handleCategoryClick = (categoryId) => {
    navigate(`/products-catalog`, { 
      state: { selectedCategory: categoryId }
    });
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavigationHeader
        cartCount={cartSummary.itemCount}
        isAuthenticated={!!user}
        onCartClick={handleCartClick}
        onAuthClick={handleAuthClick}
        onContactClick={scrollToContact}
      />

      {/* Hero Section */}
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-primary">Tipsy Oak</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Discover premium liquors, modern vapes, and hand-rolled cigars
          </p>
        </div>
      </div>

      {/* Category Cards - FIXED NAVIGATION */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group cursor-pointer transform transition-transform hover:scale-105"
              >
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Icon name={category.icon} size={32} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-muted-foreground mb-4">{category.description}</p>
                    <Button variant="outline" className="w-full">
                      Browse {category.name}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section - ONLY ON HOMEPAGE */}
      <div id="contact-section" className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Store Info */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-primary">Tipsy Oak Liquors</h2>
              
              <div className="space-y-4 text-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="MapPin" className="text-primary" />
                  <span>123 Oak Street, Downtown, NY 10001</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Phone" className="text-primary" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Mail" className="text-primary" />
                  <span>info@tipsyoak.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Clock" className="text-primary" />
                  <div>
                    <div>Mon-Fri: 9am - 9pm</div>
                    <div>Sat-Sun: 10am - 6pm</div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/contact')}
                className="mt-6"
              >
                Visit Store
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </div>

            {/* Map */}
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
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
        </div>
      </div>
    </div>
  );
};

export default HomePage;
