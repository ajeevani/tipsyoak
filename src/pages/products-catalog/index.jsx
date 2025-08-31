import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import CustomerNavigationHeader from '../../components/ui/CustomerNavigationHeader';
import { CartDialog } from '../../components/ui/DialogOverlaySystem';
import { AuthDialog } from '../../components/ui/DialogOverlaySystem';
import { useCart } from '../../components/ui/PersistentCartManager';
import CategoryTabs from './components/CategoryTabs';
import FilterSortControls from './components/FilterSortControls';
import ProductGrid from './components/ProductGrid';
import PaginationControls from './components/PaginationControls';
import { CartItem } from '../../components/ui/PersistentCartManager';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ProductsCatalog = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [activeCategory, setActiveCategory] = useState('liquors');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filters, setFilters] = useState({
    priceRange: 'all',
    strengthRange: 'all'
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const itemsPerPage = 10;

  // Mock product data
  const allProducts = [
    // Liquors
    {
      id: 'liq-001',
      name: 'Premium Whiskey Reserve',
      category: 'liquors',
      price: 89.99,
      percentage: 40,
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop'
    },
    {
      id: 'liq-002',
      name: 'Artisan Vodka Crystal',
      category: 'liquors',
      price: 45.50,
      percentage: 37.5,
      image: 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg?w=400&h=400&fit=crop'
    },
    {
      id: 'liq-003',
      name: 'Single Malt Scotch',
      category: 'liquors',
      price: 125.00,
      percentage: 43,
      image: 'https://images.pixabay.com/photo/2016/07/26/16/16/whisky-1543304_1280.jpg?w=400&h=400&fit=crop'
    },
    {
      id: 'liq-004',
      name: 'Aged Bourbon Classic',
      category: 'liquors',
      price: 67.75,
      percentage: 45,
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop'
    },
    {
      id: 'liq-005',
      name: 'Premium Gin Botanical',
      category: 'liquors',
      price: 52.25,
      percentage: 41,
      image: 'https://images.pexels.com/photos/5946965/pexels-photo-5946965.jpeg?w=400&h=400&fit=crop'
    },
    {
      id: 'liq-006',
      name: 'Craft Rum Gold',
      category: 'liquors',
      price: 38.90,
      percentage: 40,
      image: 'https://images.pixabay.com/photo/2017/01/20/15/06/cocktail-1995574_1280.jpg?w=400&h=400&fit=crop'
    },
    {
      id: 'liq-007',
      name: 'Tequila Blanco Premium',
      category: 'liquors',
      price: 74.50,
      percentage: 38,
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop'
    },
    {
      id: 'liq-008',
      name: 'Cognac VSOP Reserve',
      category: 'liquors',
      price: 156.00,
      percentage: 40,
      image: 'https://images.pexels.com/photos/5946729/pexels-photo-5946729.jpeg?w=400&h=400&fit=crop'
    },
    {
      id: 'liq-009',
      name: 'Irish Whiskey Smooth',
      category: 'liquors',
      price: 58.75,
      percentage: 40,
      image: 'https://images.pixabay.com/photo/2018/02/21/08/40/whiskey-3169273_1280.jpg?w=400&h=400&fit=crop'
    },
    {
      id: 'liq-010',
      name: 'Brandy Napoleon XO',
      category: 'liquors',
      price: 198.25,
      percentage: 42,
      image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop'
    },
    {
      id: 'liq-011',
      name: 'Rye Whiskey Heritage',
      category: 'liquors',
      price: 82.50,
      percentage: 46,
      image: 'https://images.pexels.com/photos/5946962/pexels-photo-5946962.jpeg?w=400&h=400&fit=crop'
    },
    {
      id: 'liq-012',
      name: 'Mezcal Artisanal',
      category: 'liquors',
      price: 95.00,
      percentage: 48,
      image: 'https://images.pixabay.com/photo/2017/05/12/08/29/cocktail-2304389_1280.jpg?w=400&h=400&fit=crop'
    },

    // Vapes
    {
      id: 'vap-001',
      name: 'Premium Vape Pod System',
      category: 'vapes',
      price: 29.99,
      percentage: 5,
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop'
    },
    {
      id: 'vap-002',
      name: 'Disposable Vape Mint',
      category: 'vapes',
      price: 12.50,
      percentage: 2,
      image: 'https://images.pexels.com/photos/7148621/pexels-photo-7148621.jpeg?w=400&h=400&fit=crop'
    },
    {
      id: 'vap-003',
      name: 'Refillable Vape Kit Pro',
      category: 'vapes',
      price: 45.75,
      percentage: 6,
      image: 'https://images.pixabay.com/photo/2017/11/22/00/33/vape-2969124_1280.jpg?w=400&h=400&fit=crop'
    },
    {
      id: 'vap-004',
      name: 'Compact Vape Starter',
      category: 'vapes',
      price: 18.25,
      percentage: 3,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop'
    },
    {
      id: 'vap-005',
      name: 'Advanced Vape Mod',
      category: 'vapes',
      price: 67.90,
      percentage: 8,
      image: 'https://images.pexels.com/photos/7148623/pexels-photo-7148623.jpeg?w=400&h=400&fit=crop'
    },
    {
      id: 'vap-006',
      name: 'Fruit Flavor Vape',
      category: 'vapes',
      price: 22.00,
      percentage: 4,
      image: 'https://images.pixabay.com/photo/2018/05/15/21/52/vaping-3404373_1280.jpg?w=400&h=400&fit=crop'
    },
    {
      id: 'vap-007',
      name: 'High Capacity Vape',
      category: 'vapes',
      price: 38.50,
      percentage: 7,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    },
    {
      id: 'vap-008',
      name: 'Sleek Vape Pen',
      category: 'vapes',
      price: 25.75,
      percentage: 3.5,
      image: 'https://images.pexels.com/photos/7148622/pexels-photo-7148622.jpeg?w=400&h=400&fit=crop'
    },
    {
      id: 'vap-009',
      name: 'Premium Vape Juice',
      category: 'vapes',
      price: 15.99,
      percentage: 6,
      image: 'https://images.pixabay.com/photo/2017/11/22/00/33/vape-2969125_1280.jpg?w=400&h=400&fit=crop'
    },
    {
      id: 'vap-010',
      name: 'Temperature Control Vape',
      category: 'vapes',
      price: 89.25,
      percentage: 9,
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop'
    },

    // Cigars
    {
      id: 'cig-001',
      name: 'Cuban Heritage Cigar',
      category: 'cigars',
      price: 24.99,
      percentage: 12,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    },
    {
      id: 'cig-002',
      name: 'Premium Corona Cigar',
      category: 'cigars',
      price: 18.50,
      percentage: 10,
      image: 'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?w=400&h=400&fit=crop'
    },
    {
      id: 'cig-003',
      name: 'Robusto Classic Blend',
      category: 'cigars',
      price: 32.75,
      percentage: 15,
      image: 'https://images.pixabay.com/photo/2016/11/29/13/39/cigar-1869350_1280.jpg?w=400&h=400&fit=crop'
    },
    {
      id: 'cig-004',
      name: 'Churchill Reserve',
      category: 'cigars',
      price: 45.00,
      percentage: 18,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
    },
    {
      id: 'cig-005',
      name: 'Torpedo Premium',
      category: 'cigars',
      price: 28.25,
      percentage: 13,
      image: 'https://images.pexels.com/photos/1435753/pexels-photo-1435753.jpeg?w=400&h=400&fit=crop'
    },
    {
      id: 'cig-006',
      name: 'Maduro Wrapper Cigar',
      category: 'cigars',
      price: 36.90,
      percentage: 16,
      image: 'https://images.pixabay.com/photo/2017/08/07/14/02/cigar-2604246_1280.jpg?w=400&h=400&fit=crop'
    },
    {
      id: 'cig-007',
      name: 'Connecticut Shade',
      category: 'cigars',
      price: 22.50,
      percentage: 9,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    },
    {
      id: 'cig-008',
      name: 'Habano Wrapper Elite',
      category: 'cigars',
      price: 52.75,
      percentage: 20,
      image: 'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?w=400&h=400&fit=crop'
    },
    {
      id: 'cig-009',
      name: 'Petit Corona Bundle',
      category: 'cigars',
      price: 15.99,
      percentage: 8,
      image: 'https://images.pixabay.com/photo/2016/11/29/13/39/cigar-1869351_1280.jpg?w=400&h=400&fit=crop'
    },
    {
      id: 'cig-010',
      name: 'Double Corona Luxury',
      category: 'cigars',
      price: 68.50,
      percentage: 22,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
    }
  ];

  const categories = [
    { id: 'liquors', name: 'Liquors' },
    { id: 'vapes', name: 'Vapes' },
    { id: 'cigars', name: 'Cigars' }
  ];

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts?.filter(product => product?.category === activeCategory);

    // Apply search filter
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(product =>
        product?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply price filter
    if (filters?.priceRange !== 'all') {
      filtered = filtered?.filter(product => {
        const price = product?.price;
        switch (filters?.priceRange) {
          case '0-25':
            return price < 25;
          case '25-50':
            return price >= 25 && price < 50;
          case '50-100':
            return price >= 50 && price < 100;
          case '100-200':
            return price >= 100 && price < 200;
          case '200+':
            return price >= 200;
          default:
            return true;
        }
      });
    }

    // Apply strength filter
    if (filters?.strengthRange !== 'all') {
      filtered = filtered?.filter(product => {
        const percentage = product?.percentage;
        switch (filters?.strengthRange) {
          case '0-10':
            return percentage < 10;
          case '10-25':
            return percentage >= 10 && percentage < 25;
          case '25-40':
            return percentage >= 25 && percentage < 40;
          case '40+':
            return percentage >= 40;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a?.name?.localeCompare(b?.name);
        case 'name-desc':
          return b?.name?.localeCompare(a?.name);
        case 'price-asc':
          return a?.price - b?.price;
        case 'price-desc':
          return b?.price - a?.price;
        case 'percentage-asc':
          return a?.percentage - b?.percentage;
        case 'percentage-desc':
          return b?.percentage - a?.percentage;
        default:
          return 0;
      }
    });

    return filtered;
  }, [activeCategory, searchQuery, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts?.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when category or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, filters, sortBy]);

  // Simulate loading when changing category
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: 'all',
      strengthRange: 'all'
    });
    setSearchQuery('');
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleAuthClick = () => {
    setIsAuthOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Products Catalog - Tipsy Oak</title>
        <meta name="description" content="Browse our extensive collection of premium liquors, vapes, and cigars. Find the perfect products for your taste and preferences." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Navigation Header */}
        <CustomerNavigationHeader
          cartCount={cart?.totalItems}
          isAuthenticated={isAuthenticated}
          onCartClick={handleCartClick}
          onAuthClick={handleAuthClick}
          onMenuToggle={() => {}} // Add required onMenuToggle prop
        />

        {/* Main Content */}
        <main className="pt-16">
          {/* Category Tabs */}
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
          />

          {/* Filter and Sort Controls */}
          <FilterSortControls
            filters={filters}
            onFiltersChange={handleFiltersChange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearFilters={handleClearFilters}
          />

          {/* Products Grid */}
          <div className="w-full px-4 lg:px-6 py-6">
            <ProductGrid
              products={paginatedProducts}
              loading={loading}
            />

            {/* Pagination */}
            {!loading && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredAndSortedProducts?.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>
        </main>

        {/* Cart Dialog */}
        <CartDialog isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}>
          <div className="space-y-4">
            {cart?.items?.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="ShoppingCart" size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground">Add some products to get started!</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cart?.items?.map((item) => (
                    <CartItem
                      key={item?.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
                
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${cart?.subtotal?.toFixed(2)}</span>
                  </div>
                  {cart?.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Discount:</span>
                      <span>-${cart?.discountAmount?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                    <span>Total:</span>
                    <span>${cart?.total?.toFixed(2)}</span>
                  </div>
                  
                  <Button variant="default" fullWidth className="mt-4">
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </CartDialog>

        {/* Auth Dialog */}
        <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)}>
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Authentication functionality will be implemented in the authentication dialog page.
            </p>
            <Button 
              variant="outline" 
              fullWidth 
              onClick={() => setIsAuthOpen(false)}
            >
              Close
            </Button>
          </div>
        </AuthDialog>
      </div>
    </>
  );
};

export default ProductsCatalog;