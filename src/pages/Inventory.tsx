
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
  Package, 
  Search, 
  Plus, 
  Filter, 
  ArrowUpDown,
  Download,
} from "lucide-react";
import ProductManagement from "@/components/inventory/ProductManagement";
import PalletManagement from "@/components/inventory/PalletManagement";

// Mock inventory data
const inventoryItems = [
  { id: 1, sku: "SKU-1001", name: "Standard Box", category: "Packaging", quantity: 1256, location: "A-01-B-03", status: "In Stock" },
  { id: 2, sku: "SKU-1002", name: "Premium Box", category: "Packaging", quantity: 532, location: "A-01-C-02", status: "In Stock" },
  { id: 3, sku: "SKU-2001", name: "Metal Bracket", category: "Hardware", quantity: 123, location: "B-03-A-01", status: "Low Stock" },
  { id: 4, sku: "SKU-2002", name: "Plastic Connector", category: "Hardware", quantity: 5689, location: "B-03-A-02", status: "In Stock" },
  { id: 5, sku: "SKU-3001", name: "Power Supply", category: "Electronics", quantity: 78, location: "C-02-D-04", status: "Low Stock" },
  { id: 6, sku: "SKU-3002", name: "Circuit Board", category: "Electronics", quantity: 0, location: "C-02-D-05", status: "Out of Stock" },
  { id: 7, sku: "SKU-4001", name: "Cotton Fabric", category: "Textiles", quantity: 853, location: "D-04-B-01", status: "In Stock" },
  { id: 8, sku: "SKU-4002", name: "Polyester Blend", category: "Textiles", quantity: 42, location: "D-04-B-02", status: "Low Stock" },
  { id: 9, sku: "SKU-5001", name: "Glass Vase", category: "Home Goods", quantity: 351, location: "A-02-C-03", status: "In Stock" },
  { id: 10, sku: "SKU-5002", name: "Ceramic Plate", category: "Home Goods", quantity: 0, location: "A-02-C-04", status: "Out of Stock" },
];

// Mock warehouse structure
const warehouseStructure = [
  {
    area: "Area A",
    rows: [
      {
        row: "Row 01",
        bays: [
          { bay: "Bay A", positions: 6 },
          { bay: "Bay B", positions: 8 },
          { bay: "Bay C", positions: 4 },
        ],
      },
      {
        row: "Row 02",
        bays: [
          { bay: "Bay A", positions: 6 },
          { bay: "Bay B", positions: 5 },
          { bay: "Bay C", positions: 7 },
        ],
      },
    ],
  },
  {
    area: "Area B",
    rows: [
      {
        row: "Row 03",
        bays: [
          { bay: "Bay A", positions: 10 },
          { bay: "Bay B", positions: 8 },
        ],
      },
      {
        row: "Row 04",
        bays: [
          { bay: "Bay A", positions: 5 },
          { bay: "Bay B", positions: 5 },
        ],
      },
    ],
  },
  {
    area: "Area C",
    rows: [
      {
        row: "Row 02",
        bays: [
          { bay: "Bay D", positions: 8 },
          { bay: "Bay E", positions: 8 },
        ],
      },
    ],
  },
  {
    area: "Area D",
    rows: [
      {
        row: "Row 04",
        bays: [
          { bay: "Bay A", positions: 4 },
          { bay: "Bay B", positions: 6 },
        ],
      },
    ],
  },
];

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState("inventory");

  // Filter inventory based on search and filter
  const filteredInventory = inventoryItems.filter(item => {
    const matchesSearch = 
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "low") return matchesSearch && item.status === "Low Stock";
    if (filter === "out") return matchesSearch && item.status === "Out of Stock";
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Inventory Management</h1>
        <p className="text-muted-foreground">
          Manage your warehouse inventory and locations
        </p>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="pallets">Pallets</TabsTrigger>
          <TabsTrigger value="locations">Warehouse Structure</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search by SKU, name, or location..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter Items" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              
              <Button className="bg-wms-yellow text-black hover:bg-wms-yellow-dark">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id} className="hover-row">
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "In Stock" ? "bg-green-100 text-green-800" :
                            item.status === "Low Stock" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">History</Button>
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
              Showing {filteredInventory.length} of {inventoryItems.length} items
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <ProductManagement />
        </TabsContent>
        
        <TabsContent value="pallets" className="space-y-4">
          <PalletManagement />
        </TabsContent>
        
        <TabsContent value="locations" className="space-y-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Warehouse Structure</h2>
            <Button className="bg-wms-yellow text-black hover:bg-wms-yellow-dark">
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warehouseStructure.map((area, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <CardTitle>{area.area}</CardTitle>
                </CardHeader>
                <CardContent>
                  {area.rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="mb-4">
                      <h4 className="font-semibold mb-2">{row.row}</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {row.bays.map((bay, bayIndex) => (
                          <div key={bayIndex} className="bg-gray-100 p-3 rounded">
                            <div className="text-sm font-medium">{bay.bay}</div>
                            <div className="text-xs text-muted-foreground">
                              {bay.positions} positions
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="adjustments" className="space-y-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Inventory Adjustments</h2>
            <Button className="bg-wms-yellow text-black hover:bg-wms-yellow-dark">
              <Plus className="h-4 w-4 mr-2" />
              New Adjustment
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <p className="text-center py-10 text-muted-foreground">
                Recent inventory adjustments will appear here.
                <br />
                Click "New Adjustment" to record changes to inventory.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryPage;
