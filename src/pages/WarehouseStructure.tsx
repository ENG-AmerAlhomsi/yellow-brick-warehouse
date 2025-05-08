
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AreaManagement from "@/components/warehouse/AreaManagement";
import RowManagement from "@/components/warehouse/RowManagement";
import BayManagement from "@/components/warehouse/BayManagement";
import PositionManagement from "@/components/warehouse/PositionManagement";
import { Card } from "@/components/ui/card";

const WarehouseStructure = () => {
  const [currentTab, setCurrentTab] = useState("areas");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Warehouse Structure Management</h1>
        <p className="text-muted-foreground">
          Manage your warehouse areas, rows, bays, and positions
        </p>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="areas">Areas</TabsTrigger>
          <TabsTrigger value="rows">Rows</TabsTrigger>
          <TabsTrigger value="bays">Bays</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="areas">
          <Card className="p-6">
            <AreaManagement />
          </Card>
        </TabsContent>
        
        <TabsContent value="rows">
          <Card className="p-6">
            <RowManagement />
          </Card>
        </TabsContent>
        
        <TabsContent value="bays">
          <Card className="p-6">
            <BayManagement />
          </Card>
        </TabsContent>
        
        <TabsContent value="positions">
          <Card className="p-6">
            <PositionManagement />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WarehouseStructure;
