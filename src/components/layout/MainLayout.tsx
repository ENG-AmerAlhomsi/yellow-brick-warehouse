import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Search, User, LayoutGrid, Package, Truck, ClipboardList, Settings, Menu, ChevronRight, ChevronLeft, Warehouse, LogOut, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
}
const NavItem = ({
  icon: Icon,
  label,
  to,
  isActive
}: NavItemProps) => {
  return <Link to={to} className="w-full">
      <Button variant={isActive ? "default" : "ghost"} className={`w-full justify-start mb-1 ${isActive ? "bg-wms-yellow text-black" : ""}`}>
        <Icon className="mr-2 h-5 w-5" />
        {label}
      </Button>
    </Link>;
};
export const MainLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    logout,
    isAuthenticated
  } = useAuth();
  const {
    cartItemsCount
  } = useCart();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navItems = [{
    icon: LayoutGrid,
    label: "Dashboard",
    to: "/"
  }, {
    icon: Package,
    label: "Inventory",
    to: "/inventory"
  }, {
    icon: Warehouse,
    label: "Warehouse Structure",
    to: "/warehouse-structure"
  }, {
    icon: ClipboardList,
    label: "Orders",
    to: "/orders"
  }, {
    icon: Truck,
    label: "Shipments",
    to: "/shipments"
  }, {
    icon: ShoppingCart,
    label: "Shop",
    to: "/shop"
  }, {
    icon: Settings,
    label: "Settings",
    to: "/settings"
  }];
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };
  return;
};