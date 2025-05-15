
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AreaManagement from "@/components/warehouse/AreaManagement";
import RowManagement from "@/components/warehouse/RowManagement";
import BayManagement from "@/components/warehouse/BayManagement";
import PositionManagement from "@/components/warehouse/PositionManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, Row, Bay,Position } from "@/types/warehouse";

import { areaApi, rowApi, bayApi, positionApi } from '@/services/api';

interface WarehouseStructureData {
  area: string;
  rows: {
    row: string;
    bays: {
      bay: string;
      positions: number;
    }[];
  }[];
}

const WarehouseStructure = () => {
  const [currentTab, setCurrentTab] = useState("areas");
  const [areas, setAreas] = useState<Area[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [bays, setBays] = useState<Bay[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [warehouseStructure, setWarehouseStructure] = useState<WarehouseStructureData[]>([]);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasRes, rowsRes, baysRes, positionsRes] = await Promise.all([
          areaApi.getAll(),
          rowApi.getAll(),
          bayApi.getAll(),
          positionApi.getAll()
        ]);

        setAreas(areasRes.data);
        setRows(rowsRes.data);
        setBays(baysRes.data);
        setPositions(positionsRes.data);

        // Transform data into warehouse structure
        const structure = areasRes.data.map((area: []) => {
          const areaRows = rowsRes.data.filter((row) => row.area.id === area.id);
          return {
            area: area.areaName,
            rows: areaRows.map((row) => {
              const rowBays = baysRes.data.filter((bay) => bay.row_sy.id === row.id);
              return {
                row: row.rowName,
                bays: rowBays.map((bay) => ({
                  bay: bay.bayName,
                  positions: positionsRes.data.filter((pos) => pos.bay.id === bay.id).length
                }))
              };
            })
          };
        });

        setWarehouseStructure(structure);
      } catch (error) {
        console.error('Error fetching warehouse data:', error);
      }
    };

    fetchData();
  }, []);

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
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warehouseStructure.map((area, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <CardTitle>Area {area.area}</CardTitle>
                </CardHeader>
                <CardContent>
                   {area.rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="mb-4">
                      <h4 className="font-semibold mb-2">Row {row.row}</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {row.bays.map((bay, bayIndex) => (
                          <div key={bayIndex} className="bg-gray-100 p-3 rounded">
                            <div className="text-sm font-medium">Bay {bay.bay}</div>
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
