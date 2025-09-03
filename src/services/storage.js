// Local storage utilities for offline functionality

export const storage = {
  // Products
  getProducts: () => {
    try {
      const products = localStorage.getItem('tipsy_oak_products');
      return products ? JSON.parse(products) : getDefaultProducts();
    } catch (error) {
      console.error('Error loading products:', error);
      return getDefaultProducts();
    }
  },

  setProducts: (products) => {
    try {
      localStorage.setItem('tipsy_oak_products', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products:', error);
    }
  },

  // Orders
  getOrders: () => {
    try {
      const orders = localStorage.getItem('tipsy_oak_orders');
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  },

  setOrders: (orders) => {
    try {
      localStorage.setItem('tipsy_oak_orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  },

  // User data
  getUser: () => {
    try {
      const user = localStorage.getItem('tipsy_oak_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  },

  setUser: (user) => {
    try {
      if (user) {
        localStorage.setItem('tipsy_oak_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('tipsy_oak_user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }
};

const getDefaultProducts = () => [
  {
    id: 1,
    name: "Jack Daniel's Old No. 7",
    category: "liquors",
    price: 29.99,
    alcoholPercentage: 40,
    description: "Tennessee Whiskey with smooth, mellow taste",
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop",
    stock: 25,
    isActive: true
  },
  {
    id: 2,
    name: "JUUL Classic Pod",
    category: "vapes",
    price: 15.99,
    nicotinePercentage: 5,
    description: "Classic tobacco flavor pod system",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
    stock: 50,
    isActive: true
  },
  {
    id: 3,
    name: "Romeo y Julieta Churchill",
    category: "cigars",
    price: 12.50,
    tobaccoPercentage: 85,
    description: "Premium Cuban-style cigar with rich flavors",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    stock: 30,
    isActive: true
  }
];

export default storage;
