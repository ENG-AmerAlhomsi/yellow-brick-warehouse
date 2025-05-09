
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AreaManagement from "@/components/warehouse/AreaManagement";
import RowManagement from "@/components/warehouse/RowManagement";
import BayManagement from "@/components/warehouse/BayManagement";
import PositionManagement from "@/components/warehouse/PositionManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Area, Row, Bay } from "@/types/warehouse";

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

const WarehouseStructure = () => {
  const [currentTab, setCurrentTab] = useState("areas");
  const [areas, setAreas] = useState<Area[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [bays, setBays] = useState<Bay[]>([]);

  // Effect to get areas from BayManagement
  useEffect(() => {
    if ((window as any).mockAreas) {
      setAreas((window as any).mockAreas);
    }
  }, [(window as any).mockAreas]);

  // Effect to get rows from BayManagement
  useEffect(() => {
    if ((window as any).mockRows) {
      setRows((window as any).mockRows);
    }
  }, [(window as any).mockRows]);

  // Effect to get bays from PositionManagement
  useEffect(() => {
    if ((window as any).mockBays) {
      setBays((window as any).mockBays);
    }
  }, [(window as any).mockBays]);

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
          <TabsTrigger value="structure">Warehouse Structure</TabsTrigger>
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
        
        <TabsContent value="structure" className="space-y-4">
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
      </Tabs>
    </div>
  );
};

export default WarehouseStructure;
