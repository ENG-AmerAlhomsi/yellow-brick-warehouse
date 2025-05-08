
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  Search, 
  User, 
  LayoutGrid, 
  Package, 
  Truck, 
  ClipboardList, 
  Settings,
  Menu,
  ChevronRight,
  ChevronLeft,
  Warehouse
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
}

const NavItem = ({ icon: Icon, label, to, isActive }: NavItemProps) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`w-full justify-start mb-1 ${
          isActive ? "bg-wms-yellow text-black" : ""
        }`}
      >
        <Icon className="mr-2 h-5 w-5" />
        {label}
      </Button>
    </Link>
  );
};

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { icon: LayoutGrid, label: "Dashboard", to: "/" },
    { icon: Package, label: "Inventory", to: "/inventory" },
    { icon: Warehouse, label: "Warehouse Structure", to: "/warehouse-structure" },
    { icon: ClipboardList, label: "Orders", to: "/orders" },
    { icon: Truck, label: "Shipments", to: "/shipments" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 h-16 flex items-center px-4">
            <div className="flex items-center">
              <img
                src="/favicon.ico"
                alt="WMS Logo"
                className="w-8 h-8 mr-2"
              />
              {!isCollapsed && (
                <span className="font-bold text-lg">Yellow Brick WMS</span>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                isActive={location.pathname === item.to}
              />
            ))}
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
              {!isCollapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-wms-yellow p-4 flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
