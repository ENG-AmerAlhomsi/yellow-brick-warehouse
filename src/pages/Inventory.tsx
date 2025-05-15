
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductManagement } from "@/components/inventory/ProductManagement";
import { PalletManagement } from "@/components/inventory/PalletManagement";

const InventoryPage = () => {
  const [currentTab, setCurrentTab] = React.useState("products");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Inventory Management</h1>
        <p className="text-muted-foreground">
          Manage your warehouse inventory and products
        </p>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="pallets">Pallets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          <ProductManagement />
        </TabsContent>
        
        <TabsContent value="pallets" className="space-y-4">
          <PalletManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryPage;
