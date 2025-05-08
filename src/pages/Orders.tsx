
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Filter, 
  Download,
  FileText,
} from "lucide-react";

// Mock orders data
const ordersData = [
  { 
    id: "ORD-1001", 
    customer: "Acme Inc.", 
    date: "2025-05-07", 
    items: 12, 
    value: "$1,245.00", 
    status: "Pending", 
    shipment: "Not Assigned" 
  },
  { 
    id: "ORD-1002", 
    customer: "Global Solutions", 
    date: "2025-05-06", 
    items: 5, 
    value: "$780.50", 
    status: "Processing", 
    shipment: "SHIP-2001" 
  },
  { 
    id: "ORD-1003", 
    customer: "Tech Unlimited", 
    date: "2025-05-05", 
    items: 8, 
    value: "$2,340.75", 
    status: "Ready for Pickup", 
    shipment: "SHIP-2002" 
  },
  { 
    id: "ORD-1004", 
    customer: "Moore Supplies", 
    date: "2025-05-04", 
    items: 3, 
    value: "$356.25", 
    status: "Shipped", 
    shipment: "SHIP-2003" 
  },
  { 
    id: "ORD-1005", 
    customer: "Eastern Distributors", 
    date: "2025-05-03", 
    items: 22, 
    value: "$4,532.00", 
    status: "Delivered", 
    shipment: "SHIP-2004" 
  },
  { 
    id: "ORD-1006", 
    customer: "City Hardware", 
    date: "2025-05-02", 
    items: 7, 
    value: "$943.50", 
    status: "Canceled", 
    shipment: "N/A" 
  },
  { 
    id: "ORD-1007", 
    customer: "Acme Inc.", 
    date: "2025-05-01", 
    items: 9, 
    value: "$1,120.00", 
    status: "Delivered", 
    shipment: "SHIP-2005" 
  },
  { 
    id: "ORD-1008", 
    customer: "Tech Unlimited", 
    date: "2025-04-30", 
    items: 15, 
    value: "$3,675.25", 
    status: "Delivered", 
    shipment: "SHIP-2006" 
  },
];

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter orders based on search and status filter
  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && order.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Order Management</h1>
        <p className="text-muted-foreground">
          Track and manage customer orders
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search by order ID or customer..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="ready for pickup">Ready for Pickup</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
          
          <Button className="bg-wms-yellow text-black hover:bg-wms-yellow-dark">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shipment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover-row">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">{order.items}</TableCell>
                    <TableCell className="text-right">{order.value}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "Delivered" ? "bg-green-100 text-green-800" :
                        order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                        order.status === "Ready for Pickup" ? "bg-purple-100 text-purple-800" :
                        order.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                        order.status === "Pending" ? "bg-gray-100 text-gray-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{order.shipment}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {ordersData.length} orders
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default OrdersPage;
