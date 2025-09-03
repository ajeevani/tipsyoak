import React, { useState, useEffect } from 'react';
import AdminNavigationSidebar from '../../components/ui/AdminNavigationSidebar';
import OrderFilters from './components/OrderFilters';
import OrderTable from './components/OrderTable';
import OrderDetailsModal from './components/OrderDetailsModal';
import OrderStats from './components/OrderStats';
import Icon from '../../components/AppIcon';


const AdminOrderManagement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: null,
    status: 'all',
    search: ''
  });

  // Mock orders data
  const mockOrders = [
    {
      id: 1,
      orderId: 'ORD-2025-001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '(555) 123-4567',
      orderDate: '2025-01-30T14:30:00Z',
      status: 'pending',
      total: 89.97,
      items: [
        {
          id: 1,
          name: 'Johnnie Walker Black Label',
          price: 45.99,
          quantity: 1,
          category: 'whiskey',
          image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400'
        },
        {
          id: 2,
          name: 'Grey Goose Vodka',
          price: 43.98,
          quantity: 1,
          category: 'vodka',
          image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400'
        }
      ],
      notes: 'Please call when ready for pickup'
    },
    {
      id: 2,
      orderId: 'ORD-2025-002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '(555) 234-5678',
      orderDate: '2025-01-30T10:15:00Z',
      status: 'confirmed',
      total: 156.47,
      items: [
        {
          id: 3,
          name: 'Macallan 18 Year',
          price: 125.00,
          quantity: 1,
          category: 'whiskey',
          image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'
        },
        {
          id: 4,
          name: 'Cuban Cigars Premium',
          price: 31.47,
          quantity: 1,
          category: 'cigars',
          image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400'
        }
      ]
    },
    {
      id: 3,
      orderId: 'ORD-2025-003',
      customerName: 'Michael Chen',
      customerEmail: 'mchen@email.com',
      customerPhone: '(555) 345-6789',
      orderDate: '2025-01-29T16:45:00Z',
      status: 'ready',
      total: 67.98,
      items: [
        {
          id: 5,
          name: 'JUUL Starter Kit',
          price: 29.99,
          quantity: 1,
          category: 'vapes',
          image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400'
        },
        {
          id: 6,
          name: 'Tito\'s Handmade Vodka',
          price: 37.99,
          quantity: 1,
          category: 'vodka',
          image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400'
        }
      ]
    },
    {
      id: 4,
      orderId: 'ORD-2025-004',
      customerName: 'Emily Rodriguez',
      customerEmail: 'emily.r@email.com',
      customerPhone: '(555) 456-7890',
      orderDate: '2025-01-29T11:20:00Z',
      status: 'completed',
      total: 234.95,
      items: [
        {
          id: 7,
          name: 'Dom Pérignon Champagne',
          price: 199.99,
          quantity: 1,
          category: 'champagne',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
        },
        {
          id: 8,
          name: 'Montecristo Cigars',
          price: 34.96,
          quantity: 1,
          category: 'cigars',
          image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400'
        }
      ]
    },
    {
      id: 5,
      orderId: 'ORD-2025-005',
      customerName: 'David Wilson',
      customerEmail: 'david.wilson@email.com',
      customerPhone: '(555) 567-8901',
      orderDate: '2025-01-28T13:10:00Z',
      status: 'cancelled',
      total: 78.99,
      items: [
        {
          id: 9,
          name: 'Jack Daniel\'s Tennessee Whiskey',
          price: 32.99,
          quantity: 1,
          category: 'whiskey',
          image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400'
        },
        {
          id: 10,
          name: 'Vape Mod Kit',
          price: 46.00,
          quantity: 1,
          category: 'vapes',
          image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400'
        }
      ]
    },
    {
      id: 6,
      orderId: 'ORD-2025-006',
      customerName: 'Lisa Thompson',
      customerEmail: 'lisa.t@email.com',
      customerPhone: '(555) 678-9012',
      orderDate: '2025-01-31T09:30:00Z',
      status: 'pending',
      total: 92.48,
      items: [
        {
          id: 11,
          name: 'Hennessy VS Cognac',
          price: 54.99,
          quantity: 1,
          category: 'cognac',
          image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400'
        },
        {
          id: 12,
          name: 'Romeo y Julieta Cigars',
          price: 37.49,
          quantity: 1,
          category: 'cigars',
          image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400'
        }
      ]
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...orders];

    // Date range filter
    if (filters?.dateRange?.startDate && filters?.dateRange?.endDate) {
      filtered = filtered?.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= filters?.dateRange?.startDate && orderDate <= filters?.dateRange?.endDate;
      });
    }

    // Status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(order => order?.status === filters?.status);
    }

    // Search filter
    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      filtered = filtered?.filter(order =>
        order?.customerName?.toLowerCase()?.includes(searchLower) ||
        order?.customerEmail?.toLowerCase()?.includes(searchLower) ||
        order?.orderId?.toLowerCase()?.includes(searchLower)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, filters]);

  const handleDateRangeChange = (dateRange) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleSearchChange = (search) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleExportCSV = () => {
    const csvHeaders = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Order Date',
      'Status',
      'Total',
      'Items Count',
      'Items'
    ];

    const csvData = filteredOrders?.map(order => [
      order?.orderId,
      order?.customerName,
      order?.customerEmail,
      order?.customerPhone,
      new Date(order.orderDate)?.toLocaleDateString('en-US'),
      order?.status,
      order?.total?.toFixed(2),
      order?.items?.length,
      order?.items?.map(item => `${item?.name} (${item?.quantity})`)?.join('; ')
    ]);

    const csvContent = [csvHeaders, ...csvData]?.map(row => row?.map(field => `"${field}"`)?.join(','))?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', `orders-export-${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleConfirmOrder = (orderId) => {
    setOrders(prev => prev?.map(order =>
      order?.id === orderId
        ? { ...order, status: 'confirmed' }
        : order
    ));
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prev => prev?.map(order =>
      order?.id === orderId
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const handleDeleteOrder = (orderId) => {
    setOrders(prev => prev?.filter(order => order?.id !== orderId));
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Admin logged out');
  };

  const pendingOrdersCount = orders?.filter(order => order?.status === 'pending')?.length;
  const lowStockItems = 3; // Mock low stock count

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={setIsSidebarCollapsed}
        pendingOrders={pendingOrdersCount}
        lowStockItems={lowStockItems}
        onLogout={handleLogout}
      />
      <main className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
              <p className="text-muted-foreground">
                Manage customer orders and track pickup status
              </p>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <Icon name="Menu" size={20} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-background border-b border-border sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                <Icon name="Menu" size={20} />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Order Management</h1>
                <p className="text-sm text-muted-foreground">Manage customer orders</p>
              </div>
            </div>
          </div>


          {/* Order Statistics */}
          <OrderStats orders={orders} />

          {/* Filters */}
          <OrderFilters
            onDateRangeChange={handleDateRangeChange}
            onStatusFilter={handleStatusFilter}
            onSearchChange={handleSearchChange}
            onExportCSV={handleExportCSV}
            totalOrders={orders?.length}
            filteredOrders={filteredOrders?.length}
          />

          {/* Orders Table */}
          <OrderTable
            orders={filteredOrders}
            onViewOrder={handleViewOrder}
            onConfirmOrder={handleConfirmOrder}
            onDeleteOrder={handleDeleteOrder}
            onUpdateStatus={handleUpdateStatus}
          />

          {/* Order Details Modal */}
          <OrderDetailsModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
            order={selectedOrder}
            onUpdateStatus={handleUpdateStatus}
            onDeleteOrder={handleDeleteOrder}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminOrderManagement;