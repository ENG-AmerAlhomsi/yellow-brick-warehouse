
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
import { toast } from "sonner";
import { Row, Bay } from "@/types/warehouse";

// Mock data for areas and rows
const mockRows: Row[] = [
  { id: 1, rowName: "Row 01", area: { id: 1, areaName: "Area A" } },
  { id: 2, rowName: "Row 02", area: { id: 1, areaName: "Area A" } },
  { id: 3, rowName: "Row 03", area: { id: 2, areaName: "Area B" } },
  { id: 4, rowName: "Row 04", area: { id: 3, areaName: "Area C" } },
];

// Mock data for bays
const mockBays: Bay[] = [
  { id: 1, bayName: "Bay 01", row_sy: mockRows[0] },
  { id: 2, bayName: "Bay 02", row_sy: mockRows[0] },
  { id: 3, bayName: "Bay 03", row_sy: mockRows[1] },
  { id: 4, bayName: "Bay 04", row_sy: mockRows[2] },
];

const BayManagement = () => {
  const [bays, setBays] = useState<Bay[]>(mockBays);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [currentBay, setCurrentBay] = useState<Bay>({ bayName: "", row_sy: mockRows[0] });

  const handleOpenDialog = (mode: "add" | "edit" | "view", bay?: Bay) => {
    setDialogOpen(true);
    setEditMode(mode === "edit");
    setViewMode(mode === "view");
    
    if (bay) {
      setCurrentBay({ ...bay });
    } else {
      setCurrentBay({ bayName: "", row_sy: mockRows[0] });
    }
  };

  const handleSave = () => {
    if (!currentBay.bayName.trim()) {
      toast.error("Bay name is required");
      return;
    }
    
    if (editMode && currentBay.id) {
      // Update existing bay
      setBays(bays.map(bay => 
        bay.id === currentBay.id ? { ...currentBay } : bay
      ));
      toast.success("Bay updated successfully");
    } else {
      // Add new bay
      const newId = Math.max(...bays.map(b => b.id || 0), 0) + 1;
      setBays([...bays, { ...currentBay, id: newId }]);
      toast.success("Bay added successfully");
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this bay?")) {
      setBays(bays.filter(bay => bay.id !== id));
      toast.success("Bay deleted successfully");
    }
  };

  const handleRowChange = (rowId: string) => {
    const selectedRow = mockRows.find(row => row.id === parseInt(rowId));
    if (selectedRow) {
      setCurrentBay({ ...currentBay, row_sy: selectedRow });
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Bay Management</h2>
        <Button 
          className="bg-wms-yellow text-black hover:bg-wms-yellow-dark"
          onClick={() => handleOpenDialog("add")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bay
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Row</TableHead>
              <TableHead>Area</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bays.map((bay) => (
              <TableRow key={bay.id} className="hover-row">
                <TableCell>{bay.id}</TableCell>
                <TableCell>{bay.bayName}</TableCell>
                <TableCell>{bay.row_sy.rowName}</TableCell>
                <TableCell>{bay.row_sy.area.areaName}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog("view", bay)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog("edit", bay)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => bay.id && handleDelete(bay.id)}
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
              {editMode ? "Edit Bay" : viewMode ? "View Bay" : "Add Bay"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="bayName">Bay Name</label>
                <Input
                  id="bayName"
                  value={currentBay.bayName}
                  onChange={(e) => setCurrentBay({ ...currentBay, bayName: e.target.value })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="row">Row</label>
                <Select 
                  disabled={viewMode}
                  value={currentBay.row_sy.id?.toString()}
                  onValueChange={handleRowChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a row" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRows.map(row => (
                      <SelectItem key={row.id} value={row.id?.toString() || ""}>
                        {row.rowName} ({row.area.areaName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

export default BayManagement;
