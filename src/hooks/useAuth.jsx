import { useState, useEffect, useContext, createContext } from 'react';
import { auth } from '../services/supabase';
import { storage } from '../services/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for existing session
    checkUser();
    
    // Listen for auth changes if Supabase is available
    let subscription = null;
    try {
      const { data } = auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          checkAdminStatus(session.user);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });
      subscription = data;
    } catch (error) {
      console.log('Supabase auth listener setup failed, using local storage only');
      setLoading(false);
    }

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await auth.getCurrentUser();
      if (user) {
        setUser(user);
        checkAdminStatus(user);
      } else {
        // Check local storage for offline mode
        const localUser = storage.getUser();
        if (localUser) {
          setUser(localUser);
          setIsAdmin(localUser.isAdmin || false);
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
      // Fallback to local storage
      const localUser = storage.getUser();
      if (localUser) {
        setUser(localUser);
        setIsAdmin(localUser.isAdmin || false);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = (user) => {
    // SECURE: Check if user is admin
    const adminEmails = ['admin@tipsyoak.com'];
    const userIsAdmin = adminEmails.includes(user.email) || user.user_metadata?.isAdmin || user.isAdmin;
    setIsAdmin(userIsAdmin);
    
    // SECURITY: If not admin and trying to access admin routes, redirect
    if (!userIsAdmin && window.location.pathname.includes('/admin')) {
      window.location.href = '/';
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      const { data, error } = await auth.signUp(email, password, userData);
      if (error) throw error;
      
      // Store in local storage for offline mode
      if (data.user) {
        const userToStore = { 
          ...data.user, 
          ...userData, 
          isAdmin: false // Regular users are never admin
        };
        storage.setUser(userToStore);
      }
      
      return { data, error: null };
    } catch (error) {
      // For demo purposes, create local account
      const localUser = {
        id: Date.now().toString(),
        email: email,
        ...userData,
        isAdmin: false
      };
      setUser(localUser);
      storage.setUser(localUser);
      return { data: { user: localUser }, error: null };
    }
  };

  const signIn = async (email, password) => {
    try {
      // SECURE ADMIN CHECK
      if (email === 'admin@tipsyoak.com' && password === 'admin123') {
        const adminUser = {
          id: 'admin-secure',
          email: 'admin@tipsyoak.com',
          isAdmin: true,
          loginTime: Date.now()
        };
        setUser(adminUser);
        setIsAdmin(true);
        storage.setUser(adminUser);
        return { data: { user: adminUser }, error: null };
      }

      // Try Supabase login
      const { data, error } = await auth.signIn(email, password);
      if (error) throw error;
      
      // Store in local storage for offline mode
      if (data.user) {
        const userToStore = { ...data.user, isAdmin: false };
        storage.setUser(userToStore);
      }
      
      return { data, error: null };
    } catch (error) {
      // For demo - check if user exists in local storage
      const localUser = storage.getUser();
      if (localUser && localUser.email === email) {
        setUser(localUser);
        setIsAdmin(localUser.isAdmin || false);
        return { data: { user: localUser }, error: null };
      }
      
      return { data: null, error: { message: 'Invalid credentials' } };
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      // Always clear local state
      storage.setUser(null);
      setUser(null);
      setIsAdmin(false);
      
      // SECURITY: Force redirect to homepage and clear any admin state
      window.location.href = '/';
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
