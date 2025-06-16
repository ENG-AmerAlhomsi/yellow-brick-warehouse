import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PurchaseOrder, PurchaseOrderProduct } from '../types/purchaseOrder';
import { purchaseOrderApi, userApi, productApi } from '../services/api';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const PurchaseOrders: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);
  
  // New purchase order form state
  const [newPurchaseOrder, setNewPurchaseOrder] = useState<Partial<PurchaseOrder>>({
    supplierName: '',
    expectedArrivalTime: '',
    totalPrice: 0,
    products: [],
    pallets: []
  });
  
  // Product to add to purchase order
  const [productToAdd, setProductToAdd] = useState<Partial<PurchaseOrderProduct>>({
    productId: 0,
    productName: '',
    quantity: 0,
    expectedPallets: '',
    price: 0
  });

  // Products list for dropdown
  const [products, setProducts] = useState<{id: number, name: string, price: number}[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  
  // Suppliers list for dropdown
  const [suppliers, setSuppliers] = useState<{id: string, name: string}[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState<boolean>(false);

  useEffect(() => {
    fetchPurchaseOrders();
    fetchProducts();
    fetchSuppliers();
  }, [activeTab, user]);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      let orders: PurchaseOrder[] = [];
      
      if (user?.roles.includes('Supplier')) {
        orders = await purchaseOrderApi.getBySupplier(user.username);
      } else if (activeTab !== 'all') {
        orders = await purchaseOrderApi.getByStatus(activeTab as any);
      } else {
        orders = await purchaseOrderApi.getAll();
      }
      
      setPurchaseOrders(orders);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch purchase orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await productApi.getAll();
      
      if (response.data) {
        // Map the API response to the format we need - use unitPrice as that's the correct field name
        const productList = response.data.map(product => {
          return {
            id: product.id,
            name: product.name,
            price: product.unitPrice || 0
          };
        });
        
        setProducts(productList);
      } else {
        toast({
          title: 'Warning',
          description: 'Could not load products',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      setLoadingSuppliers(true);
      const response = await userApi.getUsersByRole('Supplier');
      
      if (response.data && response.data.length > 0) {
        // Map the API response to the format we need
        const supplierList = response.data.map(supplier => ({
          id: supplier.id,
          name: `${supplier.firstName} ${supplier.lastName} (${supplier.username})`
        }));
        setSuppliers(supplierList);
      } else {
        console.warn("Could not get suppliers from API");
        toast({
          title: 'Warning',
          description: 'Could not load suppliers',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch suppliers',
        variant: 'destructive',
      });
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const handleViewPurchaseOrder = (purchaseOrder: PurchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder);
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatus = async (id: number | undefined, newStatus: string) => {
    if (!id) return;
    
    try {
      await purchaseOrderApi.updateStatus(id, newStatus as any);
      toast({
        title: 'Success',
        description: `Purchase order status updated to ${newStatus}`,
      });
      fetchPurchaseOrders();
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error('Error updating purchase order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update purchase order status',
        variant: 'destructive',
      });
    }
  };

  const handleAddProduct = () => {
    if (!productToAdd.productId || !productToAdd.quantity || !productToAdd.expectedPallets || !productToAdd.price) {
      toast({
        title: 'Error',
        description: 'Please fill in all product fields',
        variant: 'destructive',
      });
      return;
    }
    
    const product = products.find(p => p.id === productToAdd.productId);
    if (!product) return;
    
    const newProduct: PurchaseOrderProduct = {
      productId: productToAdd.productId,
      productName: product.name,
      quantity: productToAdd.quantity,
      expectedPallets: productToAdd.expectedPallets,
      price: productToAdd.price
    };
    
    const updatedProducts = [...(newPurchaseOrder.products || []), newProduct];
    
    // Calculate new total
    const newTotal = updatedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    
    setNewPurchaseOrder({
      ...newPurchaseOrder,
      products: updatedProducts,
      totalPrice: newTotal
    });
    
    // Reset product form
    setProductToAdd({
      productId: 0,
      productName: '',
      quantity: 0,
      expectedPallets: '',
      price: 0
    });
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...(newPurchaseOrder.products || [])];
    updatedProducts.splice(index, 1);
    
    // Recalculate total after removing product
    const newTotal = updatedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    
    setNewPurchaseOrder({
      ...newPurchaseOrder,
      products: updatedProducts,
      totalPrice: newTotal
    });
  };

  const handleCreatePurchaseOrder = async () => {
    if (!newPurchaseOrder.supplierName || !newPurchaseOrder.expectedArrivalTime || 
        !newPurchaseOrder.products?.length) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields and add at least one product',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Transform product structure to match what the backend expects
      const formattedOrder = {
        ...newPurchaseOrder,
        products: newPurchaseOrder.products.map(product => ({
          ...product,
          product: { id: product.productId }  // Add this nested product object structure
        }))
      };
      
      await purchaseOrderApi.create(formattedOrder as any);
      toast({
        title: 'Success',
        description: 'Purchase order created successfully',
      });
      
      // Reset form and close dialog
      setNewPurchaseOrder({
        supplierName: '',
        expectedArrivalTime: '',
        totalPrice: 0,
        products: [],
        pallets: []
      });
      setIsCreateDialogOpen(false);
      
      // Refresh purchase orders
      fetchPurchaseOrders();
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast({
        title: 'Error',
        description: 'Failed to create purchase order',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Ready to Ship':
        return 'bg-green-100 text-green-800';
      case 'Shipping':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle product selection
  const handleProductChange = (productId: string) => {
    const selectedProduct = products.find(p => p.id === parseInt(productId));
    
    if (selectedProduct) {
      setProductToAdd({
        ...productToAdd,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        price: selectedProduct.price
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        {user?.roles.includes('Supply Manager') || user?.roles.includes('admin')&& (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Create Purchase Order
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Processing">Processing</TabsTrigger>
          <TabsTrigger value="Ready to Ship">Ready to Ship</TabsTrigger>
          <TabsTrigger value="Shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Expected Arrival</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : purchaseOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No purchase orders found</TableCell>
                  </TableRow>
                ) : (
                  purchaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.supplierName}</TableCell>
                      <TableCell>{new Date(order.expectedArrivalTime).toLocaleDateString()}</TableCell>
                      <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewPurchaseOrder(order)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Purchase Order Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new purchase order
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[65vh]">
            <div className="grid grid-cols-2 gap-4 px-1 py-2">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Supplier</Label>
                  <Select 
                    value={newPurchaseOrder.supplierName} 
                    onValueChange={(value) => setNewPurchaseOrder({...newPurchaseOrder, supplierName: value})}
                    disabled={loadingSuppliers}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingSuppliers ? "Loading suppliers..." : "Select supplier"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingSuppliers ? (
                        <SelectItem value="loading" disabled>Loading suppliers...</SelectItem>
                      ) : suppliers.length === 0 ? (
                        <SelectItem value="none" disabled>No suppliers found</SelectItem>
                      ) : (
                        suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.name}>
                            {supplier.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Expected Arrival Date</Label>
                  <Input 
                    type="date" 
                    value={newPurchaseOrder.expectedArrivalTime} 
                    onChange={(e) => setNewPurchaseOrder({...newPurchaseOrder, expectedArrivalTime: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Total Price</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={newPurchaseOrder.totalPrice} 
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add Products</h3>
                
                <div className="grid gap-2">
                  <Label>Product</Label>
                  <Select 
                    value={productToAdd.productId?.toString()} 
                    onValueChange={handleProductChange}
                    disabled={loadingProducts}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingProducts ? "Loading products..." : "Select product"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingProducts ? (
                        <SelectItem value="loading" disabled>Loading products...</SelectItem>
                      ) : products.length === 0 ? (
                        <SelectItem value="none" disabled>No products found</SelectItem>
                      ) : (
                        products.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name} - ${product.price.toFixed(2)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Quantity</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={productToAdd.quantity} 
                    onChange={(e) => setProductToAdd({...productToAdd, quantity: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Expected Pallets</Label>
                  <Input 
                    type="text" 
                    value={productToAdd.expectedPallets} 
                    onChange={(e) => setProductToAdd({...productToAdd, expectedPallets: e.target.value})}
                    placeholder="e.g., 3-4 pallets"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Price per Unit</Label>
                  <Input 
                    type="number" 
                    min="0.01" 
                    step="0.01"
                    value={productToAdd.price || ''} 
                    onChange={(e) => setProductToAdd({...productToAdd, price: parseFloat(e.target.value)})}
                    placeholder="Price will auto-populate when product is selected"
                  />
                </div>
                
                <Button type="button" onClick={handleAddProduct}>
                  Add Product
                </Button>
              </div>
            </div>
            
            {newPurchaseOrder.products && newPurchaseOrder.products.length > 0 && (
              <div className="mt-4 px-1">
                <h3 className="text-lg font-medium mb-2">Products</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price per Unit</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>Expected Pallets</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newPurchaseOrder.products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>${product.price?.toFixed(2)}</TableCell>
                        <TableCell>${(product.price * product.quantity).toFixed(2)}</TableCell>
                        <TableCell>{product.expectedPallets}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveProduct(index)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePurchaseOrder}>
              Create Purchase Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Purchase Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected purchase order
            </DialogDescription>
          </DialogHeader>
          
          {selectedPurchaseOrder && (
            <div>
              <ScrollArea className="h-[65vh]">
                <div className="space-y-6 px-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">ID</h3>
                      <p>{selectedPurchaseOrder.id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <Badge className={getStatusBadgeColor(selectedPurchaseOrder.status)}>
                        {selectedPurchaseOrder.status}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
                      <p>{selectedPurchaseOrder.supplierName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Expected Arrival</h3>
                      <p>{new Date(selectedPurchaseOrder.expectedArrivalTime).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total Price</h3>
                      <p>${selectedPurchaseOrder.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Products</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price per Unit</TableHead>
                          <TableHead>Subtotal</TableHead>
                          <TableHead>Expected Pallets</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPurchaseOrder.products.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>${product.price?.toFixed(2)}</TableCell>
                            <TableCell>${(product.price * product.quantity).toFixed(2)}</TableCell>
                            <TableCell>{product.expectedPallets}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                          <TableCell className="font-bold">${selectedPurchaseOrder.totalPrice.toFixed(2)}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  {selectedPurchaseOrder.pallets.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Pallets</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Max Capacity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Manufacturing Date</TableHead>
                            <TableHead>Expiry Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedPurchaseOrder.pallets.map((pallet, index) => (
                            <TableRow key={index}>
                              <TableCell>{pallet.palletName}</TableCell>
                              <TableCell>{pallet.productName}</TableCell>
                              <TableCell>{pallet.quantity}</TableCell>
                              <TableCell>{pallet.maximumCapacity}</TableCell>
                              <TableCell>{pallet.status}</TableCell>
                              <TableCell>{new Date(pallet.manufacturingDate).toLocaleDateString()}</TableCell>
                              <TableCell>{new Date(pallet.expiryDate).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <DialogFooter>
                {user?.roles.includes('Supply Manager') && selectedPurchaseOrder.status === 'Pending' && (
                  <Button variant="destructive" onClick={() => handleUpdateStatus(selectedPurchaseOrder.id, 'Processing')}>
                    Cancel Order
                  </Button>
                )}
                
                {user?.roles.includes('supplier') && selectedPurchaseOrder.status === 'Pending' && (
                  <Button onClick={() => handleUpdateStatus(selectedPurchaseOrder.id, 'Processing')}>
                    Approve Order
                  </Button>
                )}
                
                {user?.roles.includes('supplier') && selectedPurchaseOrder.status === 'Processing' && (
                  <Button onClick={() => handleUpdateStatus(selectedPurchaseOrder.id, 'Ready to Ship')}>
                    Mark as Ready to Ship
                  </Button>
                )}
                
                {user?.roles.includes('supplier') && selectedPurchaseOrder.status === 'Ready to Ship' && (
                  <Button onClick={() => handleUpdateStatus(selectedPurchaseOrder.id, 'Shipping')}>
                    Start Shipping
                  </Button>
                )}
                
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrders;