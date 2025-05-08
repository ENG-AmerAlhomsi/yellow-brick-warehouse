
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import InventoryPage from "./pages/Inventory";
import OrdersPage from "./pages/Orders";
import ShipmentsPage from "./pages/Shipments";
import SettingsPage from "./pages/Settings";
import WarehouseStructure from "./pages/WarehouseStructure";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/inventory" element={<MainLayout><InventoryPage /></MainLayout>} />
          <Route path="/orders" element={<MainLayout><OrdersPage /></MainLayout>} />
          <Route path="/shipments" element={<MainLayout><ShipmentsPage /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
          <Route path="/warehouse-structure" element={<MainLayout><WarehouseStructure /></MainLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
