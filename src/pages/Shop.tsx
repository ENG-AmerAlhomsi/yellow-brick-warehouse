
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ShoppingCart,
  Filter,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

import { useProducts } from "@/contexts/ProductContext";

const ShopPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { addToCart, cartItemsCount } = useCart();
  const { products: shopProducts, loading, error } = useProducts();
  
  // Get unique categories for filter
  const categories = [...new Set(shopProducts.map(product => product.category))];
  
  // Filter products based on search and category
  const filteredProducts = shopProducts.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (categoryFilter === "all") return matchesSearch;
    return matchesSearch && product.category === categoryFilter;
  });

  const handleAddToCart = (product) => {
    if (product.quantityInStock <= 0) {
      toast.error("This item is out of stock");
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      sku: product.batchNumber,
      price: product.unitPrice,
      quantity: 1,
      image: product.imageUrl
    });
    
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Product Catalog</h1>
        <p className="text-muted-foreground">
          Browse our warehouse products
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search products..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
          
          <Link to="/cart">
            <Button className="bg-wms-yellow text-black hover:bg-wms-yellow-dark relative">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cartItemsCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover-card">
            <div className="aspect-square relative">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              {product.quantityInStock <= 0 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 m-2 rounded-md">
                  Out of Stock
                </div>
              )}
              {product.quantityInStock > 0 && product.quantityInStock < 5 && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 m-2 rounded-md">
                  Low Stock
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{product.category}</div>
              <div className="text-sm text-muted-foreground">SKU: {product.batchNumber}</div>
              <div className="mt-2 text-lg font-bold">${product.unitPrice.toFixed(2)}</div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleAddToCart(product)} 
                variant={product.quantityInStock > 0 ? "default" : "outline"} 
                disabled={product.quantityInStock <= 0}
                className="w-full bg-wms-yellow text-black hover:bg-wms-yellow-dark"
              >
                {product.quantityInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
