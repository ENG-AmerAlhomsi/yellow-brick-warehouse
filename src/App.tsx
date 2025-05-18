import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import InventoryPage from "./pages/Inventory";
import OrdersPage from "./pages/Orders";
import ShipmentsPage from "./pages/Shipments";
import SettingsPage from "./pages/Settings";
import WarehouseStructure from "./pages/WarehouseStructure";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import UserProfile from "./pages/UserProfile";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./hooks/useCart";
import { ProductProvider } from "./contexts/ProductContext";
import ShopPage from "./pages/Shop";
import CartPage from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import EmployeeWorkflow from "./pages/EmployeeWorkflow";
import { SidebarProvider } from "./components/ui/sidebar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";

// Helper function to determine where to redirect users based on their role
const RoleBasedRedirect = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  useEffect(() => {
  }, [user, isAuthenticated, isLoading]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If not authenticated, go to shop
  if (!isAuthenticated) {
    return <Navigate to="/shop" replace />;
  }
  
  // Check user roles to determine redirect
  if (user?.roles?.some(r => 
    r.toLowerCase() === 'customer' || 
    r.toLowerCase().includes('customer')
  )) {
    return <Navigate to="/shop" replace />;
  }

  if (user?.roles?.some(r => 
    r.toLowerCase().includes('employee')
  )) {
    return <Navigate to="/employee-workflow" replace />;
  }
  
  if (user?.roles?.some(r => 
    r.toLowerCase() === 'admin' || 
    r.toLowerCase().includes('admin') ||
    r.toLowerCase() === 'warehouse manager' ||
    r.toLowerCase().includes('manager') 
  )) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Default redirect
  return <Navigate to="/shop" replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SidebarProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
            <BrowserRouter>
              <Routes>
                {/* Root redirect based on role */}
                <Route path="/" element={<RoleBasedRedirect />} />
                
                {/* Auth routes - accessible to everyone */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Public routes */}
                <Route path="/shop" element={
                  <ProtectedRoute requiredRoles={['admin', 'customer', 'Shipping Manager' ,'warehouse manager' , 'General Manager']}>
                  <MainLayout><ShopPage /></MainLayout>
                  </ProtectedRoute>
                  } />
                
                {/* Dashboard - admin and employee route */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'warehouse manager', 'Supply Manager', 'General Manager']}>
                      <MainLayout><Dashboard /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin, Warehouse Manager and Supply Manager routes */}
                <Route 
                  path="/inventory" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'warehouse manager', 'Supply Manager']}>
                      <MainLayout><InventoryPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin and Warehouse Manager routes */}
                <Route 
                  path="/warehouse-structure" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'warehouse manager']}>
                      <MainLayout><WarehouseStructure /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin, Customer, and Order-related employee routes */}
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'customer']}>
                      <MainLayout><OrdersPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Employee workflow route */}
                <Route 
                  path="/employee-workflow" 
                  element={
                    <ProtectedRoute requiredRoles={['Order processing employee', 'Packaging employee', 'Shipping employee']}>
                      <MainLayout><EmployeeWorkflow /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin, Customer, and Shipping-related employee routes */}
                <Route 
                  path="/shipments" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'customer', 'Shipping employee', 'Shipping Manager']}>
                      <MainLayout><ShipmentsPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin-only route */}
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute requiredRoles={['admin']}>
                      <MainLayout><SettingsPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* User profile - for any authenticated user */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <MainLayout><UserProfile /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected customer routes */}
                <Route 
                  path="/cart" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'customer']}>
                      <MainLayout><CartPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'customer']}>
                      <MainLayout><Checkout /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/order-confirmation" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'customer']}>
                      <MainLayout><OrderConfirmation /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </TooltipProvider>
    </SidebarProvider>
  </QueryClientProvider>
);

export default App;
