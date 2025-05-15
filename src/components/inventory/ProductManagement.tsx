
import React, { useState } from "react";
import { Plus, Edit, Trash, Eye, Search, Filter } from "lucide-react";
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
  SelectGroup,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Product } from "@/types/warehouse";
import { productApi } from "@/services/api";
import { useProducts } from "@/contexts/ProductContext";

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
  const { products, refreshProducts, loading, error } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
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

  const handleSave = async () => {
    if (!currentProduct.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    
    try {
      if (editMode && currentProduct.id) {
        await productApi.update(currentProduct.id, currentProduct);
        toast.success("Product updated successfully");
      } else {
        await productApi.create(currentProduct);
        toast.success("Product added successfully");
      }
      await refreshProducts();
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await productApi.delete(id);
        toast.success("Product deleted successfully");
        await refreshProducts();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  // Filter products based on search and category filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.batchNumber && product.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (categoryFilter === "all") return matchesSearch;
    return matchesSearch && product.category === categoryFilter;
  });

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
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search by name or batch number..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Categories</SelectItem>
                {productCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          

        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Weight (kg)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover-row">
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.batchNumber}</TableCell>
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
      
      <div className="flex justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </div>
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
                  value={currentProduct.category}
                  onValueChange={(value) => setCurrentProduct({ ...currentProduct, category: value })}
                  disabled={viewMode}
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
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="weight">Weight (kg)</label>
                <Input
                  id="weight"
                  type="number"
                  value={currentProduct.weight}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, weight: parseFloat(e.target.value) })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="quantityInStock">Quantity in Stock</label>
                <Input
                  id="quantityInStock"
                  type="number"
                  value={currentProduct.quantityInStock}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, quantityInStock: parseInt(e.target.value) })}
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
                  onChange={(e) => setCurrentProduct({ ...currentProduct, unitPrice: parseFloat(e.target.value) })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="batchNumber">Batch Number</label>
                <Input
                  id="batchNumber"
                  value={currentProduct.batchNumber}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, batchNumber: e.target.value })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="imageUrl">Image URL</label>
                <Input
                  id="imageUrl"
                  value={currentProduct.imageUrl}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
                  readOnly={viewMode}
                />
              </div>
              {viewMode && (
                <div className="col-span-2">
                  <img
                    src={currentProduct.imageUrl || "/placeholder.svg"}
                    alt={currentProduct.name}
                    className="w-full h-48 object-contain border rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            {!viewMode && (
              <Button onClick={handleSave} className="bg-wms-yellow text-black hover:bg-wms-yellow-dark">
                {editMode ? "Update Product" : "Add Product"}
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
