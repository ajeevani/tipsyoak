import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { PersistentCartManager } from "components/ui/PersistentCartManager";
import NotFound from "pages/NotFound";
import AdminDashboard from './pages/admin-dashboard';
import AdminProductManagement from './pages/admin-product-management';
import AdminOrderManagement from './pages/admin-order-management';
import ShoppingCartDialog from './pages/shopping-cart-dialog';
import AuthenticationDialog from './pages/authentication-dialog';
import ProductsCatalog from './pages/products-catalog';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <PersistentCartManager>
          <ScrollToTop />
          <RouterRoutes>
            {/* Define your route here */}
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-product-management" element={<AdminProductManagement />} />
            <Route path="/admin-order-management" element={<AdminOrderManagement />} />
            <Route path="/shopping-cart-dialog" element={<ShoppingCartDialog />} />
            <Route path="/authentication-dialog" element={<AuthenticationDialog />} />
            <Route path="/products-catalog" element={<ProductsCatalog />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </PersistentCartManager>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;