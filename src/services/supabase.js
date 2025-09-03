import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Error initializing Supabase:', error);
  }
} else {
  console.log('Supabase credentials not found, running in offline mode');
}

// Auth functions
export const auth = {
  signUp: async (email, password, userData = {}) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  signIn: async (email, password) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  signOut: async () => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    try {
      return await supabase.auth.signOut();
    } catch (error) {
      return { error };
    }
  },

  getCurrentUser: async () => {
    if (!supabase) return { data: { user: null } };
    try {
      return await supabase.auth.getUser();
    } catch (error) {
      return { data: { user: null } };
    }
  },

  onAuthStateChange: (callback) => {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    try {
      return supabase.auth.onAuthStateChange(callback);
    } catch (error) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};

// Database functions
export const db = {
  // Products
  products: {
    getAll: async () => {
      if (!supabase) return { data: [], error: { message: 'Supabase not configured' } };
      try {
        return await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
      } catch (error) {
        return { data: [], error };
      }
    },

    getByCategory: async (category) => {
      if (!supabase) return { data: [], error: { message: 'Supabase not configured' } };
      try {
        return await supabase
          .from('products')
          .select('*')
          .eq('category', category)
          .eq('is_active', true)
          .order('name');
      } catch (error) {
        return { data: [], error };
      }
    },

    create: async (product) => {
      if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
      try {
        return await supabase
          .from('products')
          .insert([product])
          .select()
          .single();
      } catch (error) {
        return { data: null, error };
      }
    },

    update: async (id, updates) => {
      if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
      try {
        return await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
      } catch (error) {
        return { data: null, error };
      }
    },

    delete: async (id) => {
      if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
      try {
        return await supabase
          .from('products')
          .update({ is_active: false })
          .eq('id', id);
      } catch (error) {
        return { data: null, error };
      }
    }
  },

  // Orders
  orders: {
    getAll: async () => {
      if (!supabase) return { data: [], error: { message: 'Supabase not configured' } };
      try {
        return await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (*)
            )
          `)
          .order('created_at', { ascending: false });
      } catch (error) {
        return { data: [], error };
      }
    },

    create: async (orderData, items) => {
      if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
      
      try {
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
          .single();

        if (orderError) return { data: null, error: orderError };

        const orderItems = items.map(item => ({
          ...item,
          order_id: order.id
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) return { data: null, error: itemsError };

        return { data: order, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    updateStatus: async (id, status) => {
      if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
      try {
        return await supabase
          .from('orders')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
      } catch (error) {
        return { data: null, error };
      }
    },

    delete: async (id) => {
      if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
      try {
        return await supabase
          .from('orders')
          .delete()
          .eq('id', id);
      } catch (error) {
        return { data: null, error };
      }
    }
  }
};

export default supabase;
