import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { PersistentCartManager } from "components/ui/PersistentCartManager";
import { AuthProvider } from "./hooks/useAuth";
import AdminRoute from "./components/AdminRoute";
import NotFound from "pages/NotFound";
import HomePage from "pages/HomePage";
import ContactPage from "pages/ContactPage";
import AdminDashboard from './pages/admin-dashboard';
import AdminProductManagement from './pages/admin-product-management';
import AdminOrderManagement from './pages/admin-order-management';
import ShoppingCartDialog from './pages/shopping-cart-dialog';
import AuthenticationDialog from './pages/authentication-dialog';
import ProductsCatalog from './pages/products-catalog';

const Routes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <AuthProvider>
          <PersistentCartManager>
            <RouterRoutes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/products-catalog" element={<ProductsCatalog />} />
              <Route path="/shopping-cart-dialog" element={<ShoppingCartDialog />} />
              <Route path="/authentication-dialog" element={<AuthenticationDialog />} />
              
              {/* SECURE Admin Routes */}
              <Route path="/admin-dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin-product-management" element={
                <AdminRoute>
                  <AdminProductManagement />
                </AdminRoute>
              } />
              <Route path="/admin-order-management" element={
                <AdminRoute>
                  <AdminOrderManagement />
                </AdminRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </RouterRoutes>
          </PersistentCartManager>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
