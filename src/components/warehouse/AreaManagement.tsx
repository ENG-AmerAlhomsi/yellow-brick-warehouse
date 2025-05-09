
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
import { toast } from "sonner";
import { Area } from "@/types/warehouse";

// Create a global store for areas to share between components
export const mockAreas: Area[] = [
  { id: 1, areaName: "Area A" },
  { id: 2, areaName: "Area B" },
  { id: 3, areaName: "Area C" },
  { id: 4, areaName: "Area D" },
];

const AreaManagement = () => {
  const [areas, setAreas] = useState<Area[]>(mockAreas);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [currentArea, setCurrentArea] = useState<Area>({ areaName: "" });

  const handleOpenDialog = (mode: "add" | "edit" | "view", area?: Area) => {
    setDialogOpen(true);
    setEditMode(mode === "edit");
    setViewMode(mode === "view");
    
    if (area) {
      setCurrentArea({ ...area });
    } else {
      setCurrentArea({ areaName: "" });
    }
  };

  const handleSave = () => {
    if (!currentArea.areaName.trim()) {
      toast.error("Area name is required");
      return;
    }
    
    if (editMode && currentArea.id) {
      // Update existing area
      const updatedAreas = areas.map(area => 
        area.id === currentArea.id ? { ...currentArea } : area
      );
      setAreas(updatedAreas);
      
      // Update the global mockAreas for other components to use
      mockAreas.splice(0, mockAreas.length);
      updatedAreas.forEach(area => mockAreas.push(area));
      
      toast.success("Area updated successfully");
    } else {
      // Add new area
      const newId = Math.max(...areas.map(a => a.id || 0), 0) + 1;
      const newArea = { ...currentArea, id: newId };
      const newAreas = [...areas, newArea];
      setAreas(newAreas);
      
      // Update the global mockAreas for other components to use
      mockAreas.push(newArea);
      
      toast.success("Area added successfully");
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this area?")) {
      const filteredAreas = areas.filter(area => area.id !== id);
      setAreas(filteredAreas);
      
      // Update the global mockAreas for other components to use
      const index = mockAreas.findIndex(area => area.id === id);
      if (index !== -1) {
        mockAreas.splice(index, 1);
      }
      
      toast.success("Area deleted successfully");
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Area Management</h2>
        <Button 
          className="bg-wms-yellow text-black hover:bg-wms-yellow-dark"
          onClick={() => handleOpenDialog("add")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Area
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.map((area) => (
              <TableRow key={area.id} className="hover-row">
                <TableCell>{area.id}</TableCell>
                <TableCell>{area.areaName}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog("view", area)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog("edit", area)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => area.id && handleDelete(area.id)}
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
              {editMode ? "Edit Area" : viewMode ? "View Area" : "Add Area"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="areaName">Area Name</label>
                <Input
                  id="areaName"
                  value={currentArea.areaName}
                  onChange={(e) => setCurrentArea({ ...currentArea, areaName: e.target.value })}
                  readOnly={viewMode}
                />
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

export default AreaManagement;
