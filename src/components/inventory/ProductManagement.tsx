
import React, { useState } from "react";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Product } from "@/types/warehouse";

// Mock data for products
const mockProducts: Product[] = [
  { id: 1, name: "Standard Box", description: "Standard shipping box", weight: 0.5, quantityInStock: 1200, unitPrice: 1.99, batchNumber: "B001", category: "Packaging", imageUrl: "/placeholder.svg" },
  { id: 2, name: "Premium Box", description: "Premium packaging solution", weight: 0.8, quantityInStock: 500, unitPrice: 3.99, batchNumber: "B002", category: "Packaging", imageUrl: "/placeholder.svg" },
  { id: 3, name: "Metal Bracket", description: "Multi-purpose metal bracket", weight: 0.2, quantityInStock: 120, unitPrice: 2.5, batchNumber: "H001", category: "Hardware", imageUrl: "/placeholder.svg" },
];

// Product categories
const productCategories = [
  "Packaging", 
  "Hardware", 
  "Electronics", 
  "Textiles", 
  "Home Goods", 
  "Office Supplies", 
  "Food & Beverage", 
  "Chemicals", 
  "Automotive", 
  "Other"
];

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    name: "",
    description: "",
    weight: 0,
    quantityInStock: 0,
    unitPrice: 0,
    batchNumber: "",
    category: "Other",
    imageUrl: "/placeholder.svg",
  });

  const handleOpenDialog = (mode: "add" | "edit" | "view", product?: Product) => {
    setDialogOpen(true);
    setEditMode(mode === "edit");
    setViewMode(mode === "view");
    
    if (product) {
      setCurrentProduct({ ...product });
    } else {
      setCurrentProduct({
        name: "",
        description: "",
        weight: 0,
        quantityInStock: 0,
        unitPrice: 0,
        batchNumber: "",
        category: "Other",
        imageUrl: "/placeholder.svg",
      });
    }
  };

  const handleSave = () => {
    if (!currentProduct.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    
    if (editMode && currentProduct.id) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === currentProduct.id ? { ...currentProduct } : product
      ));
      toast.success("Product updated successfully");
    } else {
      // Add new product
      const newId = Math.max(...products.map(p => p.id || 0), 0) + 1;
      setProducts([...products, { ...currentProduct, id: newId }]);
      toast.success("Product added successfully");
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(product => product.id !== id));
      toast.success("Product deleted successfully");
    }
  };

  // Make these mock products available to other components
  React.useEffect(() => {
    // This is a workaround to share data between components
    // In a real app, this would be handled by a state management library
    (window as any).mockProducts = products;
  }, [products]);

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button 
          className="bg-wms-yellow text-black hover:bg-wms-yellow-dark"
          onClick={() => handleOpenDialog("add")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Weight (kg)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover-row">
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
                <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
                <TableCell>{product.weight}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog("view", product)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog("edit", product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => product.id && handleDelete(product.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit Product" : viewMode ? "View Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="name">Product Name</label>
                <Input
                  id="name"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="category">Category</label>
                <Select 
                  disabled={viewMode}
                  value={currentProduct.category}
                  onValueChange={(value) => setCurrentProduct({ ...currentProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full items-center gap-1.5 col-span-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  readOnly={viewMode}
                  rows={3}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="weight">Weight (kg)</label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={currentProduct.weight}
                  onChange={(e) => setCurrentProduct({ 
                    ...currentProduct, 
                    weight: parseFloat(e.target.value) || 0
                  })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="quantityInStock">Quantity in Stock</label>
                <Input
                  id="quantityInStock"
                  type="number"
                  value={currentProduct.quantityInStock}
                  onChange={(e) => setCurrentProduct({ 
                    ...currentProduct, 
                    quantityInStock: parseInt(e.target.value) || 0
                  })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="unitPrice">Unit Price ($)</label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  value={currentProduct.unitPrice}
                  onChange={(e) => setCurrentProduct({ 
                    ...currentProduct, 
                    unitPrice: parseFloat(e.target.value) || 0
                  })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="batchNumber">Batch Number</label>
                <Input
                  id="batchNumber"
                  value={currentProduct.batchNumber}
                  onChange={(e) => setCurrentProduct({ 
                    ...currentProduct, 
                    batchNumber: e.target.value
                  })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="imageUrl">Image URL</label>
                <Input
                  id="imageUrl"
                  value={currentProduct.imageUrl}
                  onChange={(e) => setCurrentProduct({ 
                    ...currentProduct, 
                    imageUrl: e.target.value
                  })}
                  readOnly={viewMode}
                />
              </div>
              {viewMode && (
                <div className="col-span-2">
                  <img 
                    src={currentProduct.imageUrl} 
                    alt={currentProduct.name}
                    className="w-32 h-32 object-contain mx-auto border rounded"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            {!viewMode && (
              <Button
                className="bg-wms-yellow text-black hover:bg-wms-yellow-dark"
                onClick={handleSave}
              >
                Save
              </Button>
            )}
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {viewMode ? "Close" : "Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
