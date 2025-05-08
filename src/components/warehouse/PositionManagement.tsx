
import React, { useState } from "react";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Bay, Position } from "@/types/warehouse";

// Mock data for bays
const mockBays: Bay[] = [
  { id: 1, bayName: "Bay 01", row_sy: { id: 1, rowName: "Row 01", area: { id: 1, areaName: "Area A" } } },
  { id: 2, bayName: "Bay 02", row_sy: { id: 1, rowName: "Row 01", area: { id: 1, areaName: "Area A" } } },
  { id: 3, bayName: "Bay 03", row_sy: { id: 2, rowName: "Row 02", area: { id: 1, areaName: "Area A" } } },
  { id: 4, bayName: "Bay 04", row_sy: { id: 3, rowName: "Row 03", area: { id: 2, areaName: "Area B" } } },
];

// Mock data for positions
const mockPositions: Position[] = [
  { id: 1, positionName: "Position 01", isEmpty: true, bay: mockBays[0] },
  { id: 2, positionName: "Position 02", isEmpty: false, bay: mockBays[0] },
  { id: 3, positionName: "Position 03", isEmpty: true, bay: mockBays[1] },
  { id: 4, positionName: "Position 04", isEmpty: false, bay: mockBays[2] },
];

const PositionManagement = () => {
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position>({ 
    positionName: "", 
    isEmpty: true, 
    bay: mockBays[0] 
  });

  const handleOpenDialog = (mode: "add" | "edit" | "view", position?: Position) => {
    setDialogOpen(true);
    setEditMode(mode === "edit");
    setViewMode(mode === "view");
    
    if (position) {
      setCurrentPosition({ ...position });
    } else {
      setCurrentPosition({ positionName: "", isEmpty: true, bay: mockBays[0] });
    }
  };

  const handleSave = () => {
    if (!currentPosition.positionName.trim()) {
      toast.error("Position name is required");
      return;
    }
    
    if (editMode && currentPosition.id) {
      // Update existing position
      setPositions(positions.map(position => 
        position.id === currentPosition.id ? { ...currentPosition } : position
      ));
      toast.success("Position updated successfully");
    } else {
      // Add new position
      const newId = Math.max(...positions.map(p => p.id || 0), 0) + 1;
      setPositions([...positions, { ...currentPosition, id: newId }]);
      toast.success("Position added successfully");
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this position?")) {
      setPositions(positions.filter(position => position.id !== id));
      toast.success("Position deleted successfully");
    }
  };

  const handleBayChange = (bayId: string) => {
    const selectedBay = mockBays.find(bay => bay.id === parseInt(bayId));
    if (selectedBay) {
      setCurrentPosition({ ...currentPosition, bay: selectedBay });
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Position Management</h2>
        <Button 
          className="bg-wms-yellow text-black hover:bg-wms-yellow-dark"
          onClick={() => handleOpenDialog("add")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Position
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Bay</TableHead>
              <TableHead>Row</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position) => (
              <TableRow key={position.id} className="hover-row">
                <TableCell>{position.id}</TableCell>
                <TableCell>{position.positionName}</TableCell>
                <TableCell>{position.bay.bayName}</TableCell>
                <TableCell>{position.bay.row_sy.rowName}</TableCell>
                <TableCell>{position.bay.row_sy.area.areaName}</TableCell>
                <TableCell>
                  <span className={position.isEmpty ? "text-green-500" : "text-red-500"}>
                    {position.isEmpty ? "Empty" : "Occupied"}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog("view", position)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog("edit", position)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => position.id && handleDelete(position.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit Position" : viewMode ? "View Position" : "Add Position"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="positionName">Position Name</label>
                <Input
                  id="positionName"
                  value={currentPosition.positionName}
                  onChange={(e) => setCurrentPosition({ ...currentPosition, positionName: e.target.value })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="bay">Bay</label>
                <Select 
                  disabled={viewMode}
                  value={currentPosition.bay.id?.toString()}
                  onValueChange={handleBayChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bay" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBays.map(bay => (
                      <SelectItem key={bay.id} value={bay.id?.toString() || ""}>
                        {bay.bayName} ({bay.row_sy.rowName}, {bay.row_sy.area.areaName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="isEmpty">Empty:</label>
                <Switch
                  id="isEmpty"
                  checked={currentPosition.isEmpty}
                  onCheckedChange={(checked) => setCurrentPosition({ ...currentPosition, isEmpty: checked })}
                  disabled={viewMode}
                />
                <span className={currentPosition.isEmpty ? "text-green-500" : "text-red-500"}>
                  {currentPosition.isEmpty ? "Empty" : "Occupied"}
                </span>
              </div>
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

export default PositionManagement;
