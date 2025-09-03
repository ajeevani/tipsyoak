import { useState, useEffect } from 'react';
import { db } from '../services/supabase';
import { storage } from '../services/storage';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Try to load from Supabase first
      try {
        const { data, error: dbError } = await db.orders.getAll();
        
        if (dbError) {
          throw dbError;
        } else {
          setOrders(data || []);
          // Sync with local storage
          storage.setOrders(data || []);
        }
      } catch (dbError) {
        // Fallback to local storage
        console.log('Using local storage for orders');
        const localOrders = storage.getOrders();
        setOrders(localOrders);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      // Use local storage as fallback
      const localOrders = storage.getOrders();
      setOrders(localOrders);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData, items) => {
    try {
      const newOrder = {
        ...orderData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        status: 'pending'
      };

      const orderWithItems = {
        ...newOrder,
        items: items.map(item => ({
          ...item,
          order_id: newOrder.id
        }))
      };

      // Try to save to Supabase
      try {
        const { data, error: dbError } = await db.orders.create(orderData, items);
        
        if (dbError) {
          throw dbError;
        } else {
          // Reload orders to get the latest data
          await loadOrders();
          return { data, error: null };
        }
      } catch (dbError) {
        // Save to local storage
        const currentOrders = storage.getOrders();
        const updatedOrders = [...currentOrders, orderWithItems];
        storage.setOrders(updatedOrders);
        setOrders(updatedOrders);
        return { data: orderWithItems, error: null };
      }
    } catch (err) {
      console.error('Error creating order:', err);
      return { data: null, error: err };
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      // Try to update in Supabase
      try {
        const { data, error: dbError } = await db.orders.updateStatus(orderId, status);
        
        if (dbError) {
          throw dbError;
        } else {
          // Reload orders
          await loadOrders();
          return { data, error: null };
        }
      } catch (dbError) {
        // Update in local storage
        const currentOrders = storage.getOrders();
        const updatedOrders = currentOrders.map(order => 
          order.id === orderId ? { ...order, status } : order
        );
        storage.setOrders(updatedOrders);
        setOrders(updatedOrders);
        return { data: { id: orderId, status }, error: null };
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      return { data: null, error: err };
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      // Try to delete from Supabase
      try {
        const { error: dbError } = await db.orders.delete(orderId);
        
        if (dbError) {
          throw dbError;
        } else {
          // Reload orders
          await loadOrders();
        }
      } catch (dbError) {
        // Remove from local storage
        const currentOrders = storage.getOrders();
        const updatedOrders = currentOrders.filter(order => order.id !== orderId);
        storage.setOrders(updatedOrders);
        setOrders(updatedOrders);
      }
      
      return { error: null };
    } catch (err) {
      console.error('Error deleting order:', err);
      return { error: err };
    }
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const getOrdersByDateRange = (startDate, endDate) => {
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const exportOrdersToCSV = (ordersToExport = orders) => {
    const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Total', 'Status', 'Date', 'Items'];
    
    const csvData = ordersToExport.map(order => [
      order.id,
      order.customer_name,
      order.customer_email,
      order.customer_phone || '',
      order.total,
      order.status,
      new Date(order.created_at).toLocaleDateString(),
      order.items ? order.items.map(item => `${item.name} (${item.quantity})`).join('; ') : ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrdersByStatus,
    getOrdersByDateRange,
    exportOrdersToCSV,
    refreshOrders: loadOrders
  };
};

export default useOrders;
