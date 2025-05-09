
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Filter, 
  Download,
  Truck,
  BarChart3,
} from "lucide-react";

// Mock shipment data
const shipmentsData = [
  { 
    id: "SHIP-2001", 
    orderId: "ORD-1002", 
    customer: "Global Solutions", 
    carrier: "FedEx", 
    trackingNo: "FDX123456789", 
    dispatchDate: "2025-05-06", 
    deliveryEta: "2025-05-08",
    status: "In Transit" 
  },
  { 
    id: "SHIP-2002", 
    orderId: "ORD-1003", 
    customer: "Tech Unlimited", 
    carrier: "UPS", 
    trackingNo: "1Z9876543210", 
    dispatchDate: "2025-05-05", 
    deliveryEta: "2025-05-07",
    status: "Ready for Pickup" 
  },
  { 
    id: "SHIP-2003", 
    orderId: "ORD-1004", 
    customer: "Moore Supplies", 
    carrier: "DHL", 
    trackingNo: "DHL456789123", 
    dispatchDate: "2025-05-04", 
    deliveryEta: "2025-05-09",
    status: "In Transit" 
  },
  { 
    id: "SHIP-2004", 
    orderId: "ORD-1005", 
    customer: "Eastern Distributors", 
    carrier: "FedEx", 
    trackingNo: "FDX987654321", 
    dispatchDate: "2025-05-03", 
    deliveryEta: "2025-05-05",
    status: "Delivered" 
  },
  { 
    id: "SHIP-2005", 
    orderId: "ORD-1007", 
    customer: "Acme Inc.", 
    carrier: "UPS", 
    trackingNo: "1Z1234567890", 
    dispatchDate: "2025-05-01", 
    deliveryEta: "2025-05-03",
    status: "Delivered" 
  },
  { 
    id: "SHIP-2006", 
    orderId: "ORD-1008", 
    customer: "Tech Unlimited", 
    carrier: "USPS", 
    trackingNo: "9400123456789", 
    dispatchDate: "2025-04-30", 
    deliveryEta: "2025-05-02",
    status: "Delivered" 
  },
];

// Mock carrier performance
const carrierPerformance = [
  { carrier: "FedEx", onTime: 87, delayed: 10, lost: 3 },
  { carrier: "UPS", onTime: 92, delayed: 7, lost: 1 },
  { carrier: "DHL", onTime: 84, delayed: 13, lost: 3 },
  { carrier: "USPS", onTime: 79, delayed: 18, lost: 3 },
];

const ShipmentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState("active");

  // Filter shipments based on search and status
  const filteredShipments = shipmentsData.filter(shipment => {
    const matchesSearch = 
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.trackingNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && shipment.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Filter for active vs. delivered tabs
  const activeShipments = filteredShipments.filter(
    shipment => shipment.status !== "Delivered"
  );
  
  const deliveredShipments = filteredShipments.filter(
    shipment => shipment.status === "Delivered"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Shipment Management</h1>
        <p className="text-muted-foreground">
          Track and manage outbound shipments
        </p>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Shipments</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search shipments..." 
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
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="ready for pickup">Ready for Pickup</SelectItem>
                    <SelectItem value="in transit">In Transit</SelectItem>
                    <SelectItem value="exception">Exception</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              
              <Button className="bg-wms-yellow text-black hover:bg-wms-yellow-dark">
                <Plus className="h-4 w-4 mr-2" />
                Create Shipment
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Tracking</TableHead>
                      <TableHead>Dispatch Date</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeShipments.length > 0 ? (
                      activeShipments.map((shipment) => (
                        <TableRow key={shipment.id} className="hover-row">
                          <TableCell className="font-medium">{shipment.id}</TableCell>
                          <TableCell>{shipment.orderId}</TableCell>
                          <TableCell>{shipment.customer}</TableCell>
                          <TableCell>{shipment.carrier}</TableCell>
                          <TableCell>{shipment.trackingNo}</TableCell>
                          <TableCell>{shipment.dispatchDate}</TableCell>
                          <TableCell>{shipment.deliveryEta}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              shipment.status === "In Transit" ? "bg-blue-100 text-blue-800" :
                              shipment.status === "Ready for Pickup" ? "bg-yellow-100 text-yellow-800" :
                              shipment.status === "Exception" ? "bg-red-100 text-red-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {shipment.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Track</Button>
                            <Button variant="ghost" size="sm">Update</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                          No active shipments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivered" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search completed shipments..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Tracking</TableHead>
                      <TableHead>Dispatch Date</TableHead>
                      <TableHead>Delivered Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveredShipments.length > 0 ? (
                      deliveredShipments.map((shipment) => (
                        <TableRow key={shipment.id} className="hover-row">
                          <TableCell className="font-medium">{shipment.id}</TableCell>
                          <TableCell>{shipment.orderId}</TableCell>
                          <TableCell>{shipment.customer}</TableCell>
                          <TableCell>{shipment.carrier}</TableCell>
                          <TableCell>{shipment.trackingNo}</TableCell>
                          <TableCell>{shipment.dispatchDate}</TableCell>
                          <TableCell>{shipment.deliveryEta}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Details</Button>
                            <Button variant="ghost" size="sm">POD</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                          No delivered shipments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Carrier Performance</h2>
            <div className="flex gap-2">
              <Select defaultValue="last30">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="last7">Last 7 Days</SelectItem>
                    <SelectItem value="last30">Last 30 Days</SelectItem>
                    <SelectItem value="last90">Last 90 Days</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Detailed Reports
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {carrierPerformance.map((carrier, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    {carrier.carrier}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>On-Time Delivery:</span>
                      <span className="font-bold">{carrier.onTime}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${carrier.onTime}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span>Delayed:</span>
                      <span className="font-bold">{carrier.delayed}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full" 
                        style={{ width: `${carrier.delayed}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span>Lost/Damaged:</span>
                      <span className="font-bold">{carrier.lost}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${carrier.lost}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShipmentsPage;
