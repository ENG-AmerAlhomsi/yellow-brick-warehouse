
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
import { SidebarProvider } from "./components/ui/sidebar";

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
                {/* Auth routes */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Main app routes */}
                <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
                <Route path="/inventory" element={<MainLayout><InventoryPage /></MainLayout>} />
                <Route path="/orders" element={<MainLayout><OrdersPage /></MainLayout>} />
                <Route path="/shipments" element={<MainLayout><ShipmentsPage /></MainLayout>} />
                <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
                <Route path="/warehouse-structure" element={<MainLayout><WarehouseStructure /></MainLayout>} />
                <Route path="/profile" element={<MainLayout><UserProfile /></MainLayout>} />
                
                {/* Customer shop routes */}
                <Route path="/shop" element={<MainLayout><ShopPage /></MainLayout>} />
                <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
                <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
                <Route path="/order-confirmation" element={<MainLayout><OrderConfirmation /></MainLayout>} />
                
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
