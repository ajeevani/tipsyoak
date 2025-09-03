import React, { useState, useEffect, useMemo } from 'react';
import AdminNavigationSidebar from '../../components/ui/AdminNavigationSidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProductFormModal from './components/ProductFormModal';
import ProductTable from './components/ProductTable';
import ProductStats from './components/ProductStats';
import BulkActionsPanel from './components/BulkActionsPanel';

const AdminProductManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentView, setCurrentView] = useState('table'); // 'table' or 'stats'

  // Mock products data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Jack Daniel\'s Old No. 7",
      category: "liquors",
      price: 24.99,
      stock: 45,
      alcoholPercentage: 40,
      nicotinePercentage: null,
      tobaccoPercentage: null,
      description: "Tennessee Whiskey with a smooth, mellow taste and distinctive charcoal mellowing process.",
      image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop",
      isActive: true,
      createdAt: "2024-08-15T10:30:00Z",
      updatedAt: "2024-08-30T14:20:00Z"
    },
    {
      id: 2,
      name: "JUUL Classic Tobacco",
      category: "vapes",
      price: 15.99,
      stock: 8,
      alcoholPercentage: null,
      nicotinePercentage: 5,
      tobaccoPercentage: null,
      description: "Classic tobacco flavor with smooth nicotine delivery system.",
      image: "https://images.pexels.com/photos/7148621/pexels-photo-7148621.jpeg?w=400&h=400&fit=crop",
      isActive: true,
      createdAt: "2024-08-20T09:15:00Z",
      updatedAt: "2024-08-29T16:45:00Z"
    },
    {
      id: 3,
      name: "Romeo y Julieta Churchill",
      category: "cigars",
      price: 12.50,
      stock: 0,
      alcoholPercentage: null,
      nicotinePercentage: null,
      tobaccoPercentage: 85,
      description: "Premium Cuban-style cigar with rich, complex flavors and excellent construction.",
      image: "https://images.pixabay.com/photo/2016/03/27/21/34/cigar-1284459_960_720.jpg?w=400&h=400&fit=crop",
      isActive: true,
      createdAt: "2024-08-18T11:00:00Z",
      updatedAt: "2024-08-31T08:30:00Z"
    },
    {
      id: 4,
      name: "Grey Goose Vodka",
      category: "liquors",
      price: 39.99,
      stock: 22,
      alcoholPercentage: 40,
      nicotinePercentage: null,
      tobaccoPercentage: null,
      description: "Premium French vodka distilled from the finest wheat with exceptional smoothness.",
      image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop",
      isActive: true,
      createdAt: "2024-08-12T14:22:00Z",
      updatedAt: "2024-08-28T12:10:00Z"
    },
    {
      id: 5,
      name: "SMOK Nord 4",
      category: "vapes",
      price: 32.99,
      stock: 15,
      alcoholPercentage: null,
      nicotinePercentage: 3,
      tobaccoPercentage: null,
      description: "Advanced pod system with adjustable wattage and long-lasting battery life.",
      image: "https://images.pexels.com/photos/7148618/pexels-photo-7148618.jpeg?w=400&h=400&fit=crop",
      isActive: true,
      createdAt: "2024-08-25T13:45:00Z",
      updatedAt: "2024-08-30T17:20:00Z"
    },
    {
      id: 6,
      name: "Montecristo No. 2",
      category: "cigars",
      price: 18.75,
      stock: 6,
      alcoholPercentage: null,
      nicotinePercentage: null,
      tobaccoPercentage: 90,
      description: "Iconic torpedo-shaped cigar with medium to full body and complex flavor profile.",
      image: "https://images.pixabay.com/photo/2017/08/07/19/45/cigar-2607246_960_720.jpg?w=400&h=400&fit=crop",
      isActive: true,
      createdAt: "2024-08-22T10:15:00Z",
      updatedAt: "2024-08-31T09:45:00Z"
    }
  ]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products?.filter(product => {
      const matchesSearch = product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           product?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesCategory = !categoryFilter || product?.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'category':
          return a?.category?.localeCompare(b?.category);
        case 'price':
          return a?.price - b?.price;
        case 'stock':
          return a?.stock - b?.stock;
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, categoryFilter, sortBy]);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const handleLogout = () => {
    // Handle admin logout
    console.log('Admin logout');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev?.map(p => 
        p?.id === editingProduct?.id ? { ...productData, id: editingProduct?.id } : p
      ));
    } else {
      // Add new product
      setProducts(prev => [...prev, { ...productData, id: Date.now() }]);
    }
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev?.filter(p => p?.id !== productId));
    setSelectedProducts(prev => prev?.filter(id => id !== productId));
  };

  const handleBulkAction = (actionData) => {
    const { action, productIds, value } = actionData;

    switch (action) {
      case 'updateCategory':
        setProducts(prev => prev?.map(p => 
          productIds?.includes(p?.id) ? { ...p, category: value, updatedAt: new Date()?.toISOString() } : p
        ));
        break;
      case 'updatePrice':
        setProducts(prev => prev?.map(p => 
          productIds?.includes(p?.id) ? { ...p, price: parseFloat(value), updatedAt: new Date()?.toISOString() } : p
        ));
        break;
      case 'updateStock':
        setProducts(prev => prev?.map(p => 
          productIds?.includes(p?.id) ? { ...p, stock: parseInt(value), updatedAt: new Date()?.toISOString() } : p
        ));
        break;
      case 'toggleStatus':
        setProducts(prev => prev?.map(p => 
          productIds?.includes(p?.id) ? { ...p, isActive: !p?.isActive, updatedAt: new Date()?.toISOString() } : p
        ));
        break;
      case 'delete':
        setProducts(prev => prev?.filter(p => !productIds?.includes(p?.id)));
        break;
      default:
        break;
    }
  };

  const handleClearSelection = (specificIds = null) => {
    if (specificIds) {
      setSelectedProducts(prev => prev?.filter(id => !specificIds?.includes(id)));
    } else {
      setSelectedProducts([]);
    }
  };

  // Calculate stats for sidebar badges
  const lowStockCount = products?.filter(p => p?.stock <= 10 && p?.stock > 0)?.length;
  const pendingOrdersCount = 3; // Mock data

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Sidebar */}
      <AdminNavigationSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        pendingOrders={pendingOrdersCount}
        lowStockItems={lowStockCount}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage your inventory with advanced editing and AI-powered features
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('table')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    currentView === 'table' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name="Table" size={16} className="mr-1.5" />
                  Table
                </button>
                <button
                  onClick={() => setCurrentView('stats')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    currentView === 'stats' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name="BarChart3" size={16} className="mr-1.5" />
                  Stats
                </button>
              </div>

              <Button
                onClick={handleAddProduct}
                iconName="Plus"
                iconPosition="left"
                className="whitespace-nowrap"
              >
                Add Product
              </Button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-background border-b border-border">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Icon name="Menu" size={20} />
              </Button>
              <h1 className="text-xl font-semibold">Product Management</h1>
            </div>
          </div>


          {/* Content based on current view */}
          {currentView === 'stats' ? (
            <ProductStats products={products} />
          ) : (
            <>
              {/* Bulk Actions Panel */}
              <BulkActionsPanel
                selectedProducts={selectedProducts}
                onBulkAction={handleBulkAction}
                onClearSelection={handleClearSelection}
                products={products}
              />

              {/* Products Table */}
              <ProductTable
                products={filteredAndSortedProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onBulkAction={handleBulkAction}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
        existingProducts={products}
      />
    </div>
  );
};

export default AdminProductManagement;