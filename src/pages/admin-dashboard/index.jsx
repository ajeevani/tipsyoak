import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigationSidebar from '../../components/ui/AdminNavigationSidebar';
import MetricsCard from './components/MetricsCard';
import RecentOrdersTable from './components/RecentOrdersTable';
import QuickActionsPanel from './components/QuickActionsPanel';
import SalesChart from './components/SalesChart';
import { ConfirmDialog } from '../../components/ui/DialogOverlaySystem';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Mock data
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      dailySales: 2450.00,
      dailySalesChange: '+12.5%',
      pendingOrders: 8,
      pendingOrdersChange: '+3',
      lowStockItems: 5,
      lowStockChange: '-2',
      totalCustomers: 1247,
      customersChange: '+8.2%'
    },
    recentOrders: [
      {
        id: '1234',
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        itemCount: 3,
        total: 89.97,
        status: 'pending',
        createdAt: '2025-08-31T02:20:00Z'
      },
      {
        id: '1235',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        itemCount: 2,
        total: 156.50,
        status: 'confirmed',
        createdAt: '2025-08-31T01:45:00Z'
      },
      {
        id: '1236',
        customerName: 'Mike Wilson',
        customerEmail: 'mike.wilson@email.com',
        itemCount: 5,
        total: 234.75,
        status: 'ready',
        createdAt: '2025-08-31T01:15:00Z'
      },
      {
        id: '1237',
        customerName: 'Emily Davis',
        customerEmail: 'emily.davis@email.com',
        itemCount: 1,
        total: 45.99,
        status: 'completed',
        createdAt: '2025-08-31T00:30:00Z'
      },
      {
        id: '1238',
        customerName: 'Robert Brown',
        customerEmail: 'robert.brown@email.com',
        itemCount: 4,
        total: 178.25,
        status: 'pending',
        createdAt: '2025-08-30T23:45:00Z'
      }
    ]
  });

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        type: 'order',
        message: `New order #${Math.floor(Math.random() * 9000) + 1000} received`,
        timestamp: new Date()?.toISOString()
      };
      
      setNotifications(prev => [newNotification, ...prev?.slice(0, 4)]);
      
      // Play notification sound (optional)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Tipsy Oak - New Order', {
          body: newNotification.message,
          icon: '/favicon.ico'
        });
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleConfirmOrder = (orderId) => {
    setDashboardData(prev => ({
      ...prev,
      recentOrders: prev?.recentOrders?.map(order =>
        order?.id === orderId
          ? { ...order, status: 'confirmed' }
          : order
      )
    }));
    
    setNotifications(prev => [{
      id: Date.now(),
      type: 'success',
      message: `Order #${orderId} confirmed successfully`,
      timestamp: new Date()?.toISOString()
    }, ...prev?.slice(0, 4)]);
  };

  const handleDeleteOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteOrder = () => {
    setDashboardData(prev => ({
      ...prev,
      recentOrders: prev?.recentOrders?.filter(order => order?.id !== selectedOrderId)
    }));
    
    setNotifications(prev => [{
      id: Date.now(),
      type: 'warning',
      message: `Order #${selectedOrderId} deleted`,
      timestamp: new Date()?.toISOString()
    }, ...prev?.slice(0, 4)]);
    
    setSelectedOrderId(null);
  };

  const handleExportData = () => {
    // Mock CSV export
    const csvData = dashboardData?.recentOrders?.map(order => ({
      'Order ID': order?.id,
      'Customer': order?.customerName,
      'Email': order?.customerEmail,
      'Items': order?.itemCount,
      'Total': order?.total,
      'Status': order?.status,
      'Date': new Date(order.createdAt)?.toLocaleDateString()
    }));
    
    console.log('Exporting CSV data:', csvData);
    
    setNotifications(prev => [{
      id: Date.now(),
      type: 'success',
      message: 'Data exported successfully',
      timestamp: new Date()?.toISOString()
    }, ...prev?.slice(0, 4)]);
  };

  const handleLogout = () => {
    navigate('/authentication-dialog');
  };

  const pendingOrdersCount = dashboardData?.recentOrders?.filter(order => order?.status === 'pending')?.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Sidebar */}
      <AdminNavigationSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
        pendingOrders={pendingOrdersCount}
        lowStockItems={dashboardData?.metrics?.lowStockItems}
        onLogout={handleLogout}
      />
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Header */}
        <header className="bg-card border-b border-border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back! Here's what's happening at Tipsy Oak today.
              </p>
            </div>
            
            {/* Mobile Sidebar Toggle */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden"
              >
                <Icon name="Menu" size={20} />
              </Button>
              
              {/* Notifications */}
              {notifications?.length > 0 && (
                <div className="relative">
                  <Button variant="ghost" size="icon">
                    <Icon name="Bell" size={20} />
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications?.length}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricsCard
              title="Daily Sales"
              value={`$${dashboardData?.metrics?.dailySales?.toLocaleString()}`}
              change={dashboardData?.metrics?.dailySalesChange}
              changeType="positive"
              icon="DollarSign"
              description="vs yesterday"
            />
            <MetricsCard
              title="Pending Orders"
              value={dashboardData?.metrics?.pendingOrders}
              change={dashboardData?.metrics?.pendingOrdersChange}
              changeType="positive"
              icon="ShoppingBag"
              description="new orders"
            />
            <MetricsCard
              title="Low Stock Items"
              value={dashboardData?.metrics?.lowStockItems}
              change={dashboardData?.metrics?.lowStockChange}
              changeType="negative"
              icon="AlertTriangle"
              description="need attention"
            />
            <MetricsCard
              title="Total Customers"
              value={dashboardData?.metrics?.totalCustomers?.toLocaleString()}
              change={dashboardData?.metrics?.customersChange}
              changeType="positive"
              icon="Users"
              description="growth rate"
            />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Orders and Chart Section */}
            <div className="xl:col-span-2 space-y-6">
              {/* Sales Chart */}
              <SalesChart />
              
              {/* Recent Orders Table */}
              <RecentOrdersTable
                orders={dashboardData?.recentOrders}
                onConfirmOrder={handleConfirmOrder}
                onDeleteOrder={handleDeleteOrder}
              />
            </div>

            {/* Quick Actions Panel */}
            <div className="xl:col-span-1">
              <QuickActionsPanel
                pendingOrdersCount={pendingOrdersCount}
                lowStockCount={dashboardData?.metrics?.lowStockItems}
                onExportData={handleExportData}
                onViewReports={() => navigate('/admin-order-management')}
              />
            </div>
          </div>

          {/* Recent Notifications */}
          {notifications?.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Notifications</h3>
              <div className="space-y-3">
                {notifications?.slice(0, 3)?.map((notification) => (
                  <div key={notification?.id} className="flex items-center space-x-3 p-3 bg-background rounded-lg border border-border">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{notification?.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp)?.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteOrder}
        title="Delete Order"
        message={`Are you sure you want to delete order #${selectedOrderId}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default AdminDashboard;