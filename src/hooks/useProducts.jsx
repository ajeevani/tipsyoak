import { useState, useEffect } from 'react';
import { db } from '../services/supabase';
import { storage } from '../services/storage';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Try to load from Supabase first
      try {
        const { data, error: dbError } = await db.products.getAll();
        
        if (dbError) {
          throw dbError;
        } else {
          setProducts(data || []);
          // Sync with local storage
          storage.setProducts(data || []);
        }
      } catch (dbError) {
        // Fallback to local storage
        console.log('Using local storage for products');
        const localProducts = storage.getProducts();
        setProducts(localProducts);
      }
    } catch (err) {
      console.error('Error loading products:', err);
      // Use local storage as fallback
      const localProducts = storage.getProducts();
      setProducts(localProducts);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      const newProduct = {
        ...productData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        isActive: true
      };

      // Try to save to Supabase
      try {
        const { data, error: dbError } = await db.products.create(newProduct);
        
        if (dbError) {
          throw dbError;
        } else {
          // Reload products to get the latest data
          await loadProducts();
          return { data, error: null };
        }
      } catch (dbError) {
        // Save to local storage
        const currentProducts = storage.getProducts();
        const updatedProducts = [...currentProducts, newProduct];
        storage.setProducts(updatedProducts);
        setProducts(updatedProducts);
        return { data: newProduct, error: null };
      }
    } catch (err) {
      console.error('Error adding product:', err);
      return { data: null, error: err };
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      // Try to update in Supabase
      try {
        const { data, error: dbError } = await db.products.update(id, updates);
        
        if (dbError) {
          throw dbError;
        } else {
          // Reload products
          await loadProducts();
          return { data, error: null };
        }
      } catch (dbError) {
        // Update in local storage
        const currentProducts = storage.getProducts();
        const updatedProducts = currentProducts.map(p => 
          p.id === id ? { ...p, ...updates } : p
        );
        storage.setProducts(updatedProducts);
        setProducts(updatedProducts);
        return { data: { ...updates, id }, error: null };
      }
    } catch (err) {
      console.error('Error updating product:', err);
      return { data: null, error: err };
    }
  };

  const deleteProduct = async (id) => {
    try {
      // Try to delete from Supabase
      try {
        const { error: dbError } = await db.products.delete(id);
        
        if (dbError) {
          throw dbError;
        } else {
          // Reload products
          await loadProducts();
        }
      } catch (dbError) {
        // Remove from local storage
        const currentProducts = storage.getProducts();
        const updatedProducts = currentProducts.filter(p => p.id !== id);
        storage.setProducts(updatedProducts);
        setProducts(updatedProducts);
      }
      
      return { error: null };
    } catch (err) {
      console.error('Error deleting product:', err);
      return { error: err };
    }
  };

  const getProductsByCategory = (category) => {
    return products.filter(product => 
      product.category === category && product.isActive !== false
    );
  };

  const searchProducts = (searchTerm) => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    searchProducts,
    refreshProducts: loadProducts
  };
};

export default useProducts;
