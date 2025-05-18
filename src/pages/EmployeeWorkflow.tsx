import React, { useState, useEffect } from "react";
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
  Search, 
  Loader2,
  Package,
  Check,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { orderApi, palletApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Order } from "@/types/order";
import { hasRole } from "@/utils/authHelpers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Interface for product in order
interface OrderProduct {
  product: {
    id: number;
    name: string;
    description?: string;
    unitPrice: number;
  };
  quantity: number;
  checked?: boolean;
}

// Interface for pallet data
interface Pallet {
  id: number;
  palletName: string;
  quantity: number;
  maximumCapacity: number;
  manufacturingDate?: Date;
  expiryDate?: Date;
  supplierName?: string;
  status?: string;
  position: {
    id: number;
    positionName: string;
    level: number;
    bay: {
      id: number;
      bayName: string;
      row_sy: {
        id: number;
        rowName: string;
        area: {
          id: number;
          areaName: string;
        }
      }
    }
  };
  product: {
    id: number;
    name: string;
  };
  selected?: boolean;
}

// Extended Order interface to track product processing
interface ExtendedOrder extends Order {
  products: OrderProduct[];
  productLocations?: Record<number, Pallet[]>;
  completedProducts?: number[];
}

const EmployeeWorkflow = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderForProcess, setSelectedOrderForProcess] = useState<ExtendedOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOrderProcessingDialog, setShowOrderProcessingDialog] = useState(false);
  const [processingProductId, setProcessingProductId] = useState<number | null>(null);
  const [updatingPallet, setUpdatingPallet] = useState(false);
  const { user } = useAuth();

  // Fetch orders from API based on employee role
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const allOrdersResponse = await orderApi.getAll();
        let filteredOrders = allOrdersResponse.data;
        
        // Filter orders based on employee role
        if (hasRole(user, 'Order processing employee')) {
          filteredOrders = filteredOrders.filter(order => order.status === "Pending");
        } else if (hasRole(user, 'Packaging employee')) {
          filteredOrders = filteredOrders.filter(order => order.status === "Ready for Pickup");
        } else if (hasRole(user, 'Shipping employee')) {
          filteredOrders = filteredOrders.filter(order => order.status === "Ready for Shipping");
        }
        
        setOrders(filteredOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Filter orders based on search
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.id?.toString() || '').includes(searchQuery.toLowerCase()) ||
      (order.customer?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Function to fetch all pallet locations for products in an order
  const fetchAllProductLocations = async (order: Order) => {
    if (!order.products || order.products.length === 0) {
      toast.error("No products in this order");
      return null;
    }

    try {
      // Create a copy of the order with extended properties
      const extendedOrder: ExtendedOrder = {
        ...order,
        products: [...order.products],
        productLocations: {},
        completedProducts: []
      };

      // Fetch pallet locations for each product
      const productIds = order.products.map(p => p.product.id);
      
      // Use Promise.all to fetch all products' pallets in parallel
      const palletPromises = productIds.map(productId => 
        palletApi.getPalletsByProductId(productId)
      );
      
      const palletResponses = await Promise.all(palletPromises);
      
      // Create a map of product ID to pallet locations
      productIds.forEach((productId, index) => {
        const pallets = palletResponses[index].data || [];
        
        // Make sure we have all the information and prioritize stored pallets
        // Sort pallets to prioritize those with status "Stored" and valid positions
        const sortedPallets = [...pallets].sort((a, b) => {
          // Prioritize "Stored" status
          if ((a.status === "Stored") && (b.status !== "Stored")) return -1;
          if ((a.status !== "Stored") && (b.status === "Stored")) return 1;
          
          // Then prioritize pallets with position information
          const aHasPosition = a.position && a.position.positionName && a.position.positionName !== "N/A";
          const bHasPosition = b.position && b.position.positionName && b.position.positionName !== "N/A";
          
          if (aHasPosition && !bHasPosition) return -1;
          if (!aHasPosition && bHasPosition) return 1;
          
          // Finally, prioritize by quantity (more quantity first)
          return b.quantity - a.quantity;
        });
        
        extendedOrder.productLocations![productId] = sortedPallets;
      });

      return extendedOrder;
    } catch (error) {
      console.error("Failed to fetch product locations:", error);
      toast.error("Failed to retrieve product locations");
      return null;
    }
  };

  // Handler for processing an order - show dialog with all products
  const handleProcessOrder = async (order: Order) => {
    setIsProcessing(true);
    
    try {
      const extendedOrder = await fetchAllProductLocations(order);
      
      if (extendedOrder) {
        setSelectedOrderForProcess(extendedOrder);
        setShowOrderProcessingDialog(true);
      }
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("Failed to process order");
    } finally {
      setIsProcessing(false);
    }
  };

  // This function is no longer needed as we automatically use the first pallet
  // We're keeping it as a placeholder to avoid changing too much code structure
  const selectPallet = (productId: number, palletId: number, selected: boolean) => {
    // No longer needed as we automatically select the first pallet
    return;
  };

  // Mark a product as processed and update pallet quantities
  const markProductProcessed = async (productId: number) => {
    if (!selectedOrderForProcess) return;

    const productOrder = selectedOrderForProcess.products.find(p => p.product.id === productId);
    if (!productOrder) return;

    const orderQuantity = productOrder.quantity;
    
    // Get the pallets for this product
    const pallets = selectedOrderForProcess.productLocations?.[productId] || [];
    
    // If no pallets available, show error
    if (pallets.length === 0) {
      toast.error("No pallets found for this product");
      return;
    }
    
    // Automatically use the first pallet
    const pallet = pallets[0];
    
    // Check if the pallet has enough quantity
    if (pallet.quantity < orderQuantity) {
      toast.error(`Selected pallet only has ${pallet.quantity} units, but order requires ${orderQuantity}`);
      return;
    }
    
    // Start processing
    setProcessingProductId(productId);
    setUpdatingPallet(true);
    
    try {
      // Update the pallet in the database with reduced quantity
      // Preserve the original pallet information including status
      const newQuantity = pallet.quantity - orderQuantity;
      const updatedPallet = {
        palletName: pallet.palletName,
        quantity: newQuantity,
        maximumCapacity: pallet.maximumCapacity,
        manufacturingDate: pallet.manufacturingDate || new Date(),
        expiryDate: pallet.expiryDate || new Date(),
        supplierName: pallet.supplierName || "Default",
        // If quantity becomes 0, mark as "Empty" otherwise keep original status or use "Stored"
        status: newQuantity === 0 ? "Empty" : (pallet.status || "Stored"),
        position: { id: pallet.position.id }, // Maintain the position
        product: { id: pallet.product.id }
      };
      
      // Call the API to update the pallet
      await palletApi.updatePalletOnly(pallet.id, updatedPallet);
      
      // Mark this product as processed
      setSelectedOrderForProcess(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          completedProducts: [...(prev.completedProducts || []), productId],
          products: prev.products.map(p => 
            p.product.id === productId ? { ...p, checked: true } : p
          )
        };
      });
      
      toast.success(`Product ${productOrder.product.name} processed successfully`);
      
      // Check if all products are processed
      const updatedOrder = {
        ...selectedOrderForProcess,
        completedProducts: [...(selectedOrderForProcess.completedProducts || []), productId],
        products: selectedOrderForProcess.products.map(p => 
          p.product.id === productId ? { ...p, checked: true } : p
        )
      };
      
      setSelectedOrderForProcess(updatedOrder);
      
      // If all products are now processed, enable the complete button
      const allProductsProcessed = updatedOrder.products.every(p => p.checked);
      if (allProductsProcessed) {
        toast.info("All products have been processed. You can now complete the order.");
      }
      
    } catch (error) {
      console.error("Failed to update pallet quantity:", error);
      toast.error("Failed to update pallet. Please try again.");
    } finally {
      setProcessingProductId(null);
      setUpdatingPallet(false);
    }
  };

  // Complete order processing and update order status
  const completeOrderProcessing = async () => {
    if (!selectedOrderForProcess) return;
    
    // Check if all products have been processed
    const allProductsProcessed = selectedOrderForProcess.products.every(p => p.checked);
    
    if (!allProductsProcessed) {
      toast.error("Please process all products before completing the order");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Update order status to "Ready for Pickup"
      const updatedOrder = {
        ...selectedOrderForProcess,
        status: "Ready for Pickup"
      };
      
      await orderApi.updateOrder(Number(updatedOrder.id), updatedOrder);
      
      toast.success("Order has been processed successfully");
      setShowOrderProcessingDialog(false);
      setSelectedOrderForProcess(null);
      fetchOrders(); // Refresh the orders list
      
    } catch (error) {
      console.error("Failed to complete order processing:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle employee actions based on role
  const handleEmployeeAction = (order: Order) => {
    if (hasRole(user, 'Order processing employee') && order.status === "Pending") {
      // Processing employee selecting an order to process
      handleProcessOrder(order);
    } else if (hasRole(user, 'Packaging employee') && order.status === "Ready for Pickup") {
      // Packaging employee marks order as packaged
      processOrder(order, "Ready for Shipping");
    } else if (hasRole(user, 'Shipping employee') && order.status === "Ready for Shipping") {
      // Shipping employee marks order as shipped
      processOrder(order, "Shipped");
    }
  };

  // Update order status
  const processOrder = async (order: Order, newStatus: string) => {
    setIsProcessing(true);
    try {
      const updatedOrder = {
        ...order,
        status: newStatus
      };
      
      await orderApi.updateOrder(Number(order.id), updatedOrder);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error("Failed to process order:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Employee Workflow</h1>
          <p className="text-muted-foreground">
            Process and manage orders based on your role
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search by order ID or customer..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            {hasRole(user, 'Order processing employee') && (
              <span className="badge bg-wms-yellow text-black px-3 py-1 rounded-full text-sm">
                Order Processing
              </span>
            )}
            {hasRole(user, 'Packaging employee') && (
              <span className="badge bg-wms-yellow text-black px-3 py-1 rounded-full text-sm">
                Packaging
              </span>
            )}
            {hasRole(user, 'Shipping employee') && (
              <span className="badge bg-wms-yellow text-black px-3 py-1 rounded-full text-sm">
                Shipping
              </span>
            )}
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-8 w-8 animate-spin mr-2" />
                          <p>Loading orders...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
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
                            order.status === "Ready for Shipping" ? "bg-purple-50 text-purple-800" :
                            order.status === "Ready for Pickup" ? "bg-purple-100 text-purple-800" :
                            order.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                            order.status === "Pending" ? "bg-gray-100 text-gray-800" :
                            order.status === "Canceled" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>{order.shipment}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEmployeeAction(order)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : hasRole(user, 'Order processing employee') ? (
                              <Package className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        <p className="text-muted-foreground">
                          No orders currently assigned to your role.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Order Processing Dialog - For employees to see pallet locations */}
      <Dialog open={showOrderProcessingDialog} onOpenChange={setShowOrderProcessingDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrderForProcess && (
            <>
              <DialogHeader>
                <DialogTitle>Processing Order #{selectedOrderForProcess.id}</DialogTitle>
                <DialogDescription>
                  Pick products from the following locations.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* Pallet Locations */}
                <div>
                  <h3 className="font-semibold text-sm mb-2">Product Locations</h3>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]"></TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Area</TableHead>
                          <TableHead>Row</TableHead>
                          <TableHead>Bay</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead className="text-right">Order Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                                            <TableBody>
                        {selectedOrderForProcess.products && selectedOrderForProcess.products.length > 0 ? (
                          selectedOrderForProcess.products.map((productItem, index) => {
                            const productId = productItem.product.id;
                            // Get first pallet for this product - we only show one location per product
                            const pallets = selectedOrderForProcess.productLocations?.[productId] || [];
                            const pallet = pallets.length > 0 ? pallets[0] : null;
                            
                            // Skip if no pallet found
                            if (!pallet) return null;
                            
                            const isProcessed = selectedOrderForProcess.completedProducts?.includes(productId);
                            
                            return (
                              <TableRow key={index} className={isProcessed ? "bg-green-50" : ""}>
                                <TableCell>
                                  <div className="flex items-center justify-center">
                                    {isProcessed ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-7 w-7 p-0" 
                                        onClick={() => markProductProcessed(productId)}
                                        disabled={processingProductId === productId || updatingPallet}
                                      >
                                        {processingProductId === productId ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Check className="h-4 w-4" />
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{productItem.product.name}</TableCell>
                                <TableCell>{pallet.position?.bay?.row_sy?.area?.areaName || '-'}</TableCell>
                                <TableCell>{pallet.position?.bay?.row_sy?.rowName || '-'}</TableCell>
                                <TableCell>{pallet.position?.bay?.bayName || '-'}</TableCell>
                                <TableCell>{pallet.position?.level}</TableCell>
                                <TableCell>{pallet.position?.positionName || '-'}</TableCell>
                                <TableCell className="text-right font-semibold">{productItem.quantity}</TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              No pallet locations found for this product.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowOrderProcessingDialog(false);
                      setSelectedOrderForProcess(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => completeOrderProcessing()}
                    disabled={isProcessing || !selectedOrderForProcess.completedProducts || 
                              selectedOrderForProcess.completedProducts.length !== selectedOrderForProcess.products.length}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Complete Processing'
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeeWorkflow; 