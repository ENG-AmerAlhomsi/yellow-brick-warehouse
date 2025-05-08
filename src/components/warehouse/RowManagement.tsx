
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
import { Area, Row } from "@/types/warehouse";

// Mock data for areas
const mockAreas: Area[] = [
  { id: 1, areaName: "Area A" },
  { id: 2, areaName: "Area B" },
  { id: 3, areaName: "Area C" },
  { id: 4, areaName: "Area D" },
];

// Mock data for rows
const mockRows: Row[] = [
  { id: 1, rowName: "Row 01", area: mockAreas[0] },
  { id: 2, rowName: "Row 02", area: mockAreas[0] },
  { id: 3, rowName: "Row 03", area: mockAreas[1] },
  { id: 4, rowName: "Row 04", area: mockAreas[2] },
];

const RowManagement = () => {
  const [rows, setRows] = useState<Row[]>(mockRows);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [currentRow, setCurrentRow] = useState<Row>({ rowName: "", area: mockAreas[0] });

  const handleOpenDialog = (mode: "add" | "edit" | "view", row?: Row) => {
    setDialogOpen(true);
    setEditMode(mode === "edit");
    setViewMode(mode === "view");
    
    if (row) {
      setCurrentRow({ ...row });
    } else {
      setCurrentRow({ rowName: "", area: mockAreas[0] });
    }
  };

  const handleSave = () => {
    if (!currentRow.rowName.trim()) {
      toast.error("Row name is required");
      return;
    }
    
    if (editMode && currentRow.id) {
      // Update existing row
      setRows(rows.map(row => 
        row.id === currentRow.id ? { ...currentRow } : row
      ));
      toast.success("Row updated successfully");
    } else {
      // Add new row
      const newId = Math.max(...rows.map(r => r.id || 0), 0) + 1;
      setRows([...rows, { ...currentRow, id: newId }]);
      toast.success("Row added successfully");
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this row?")) {
      setRows(rows.filter(row => row.id !== id));
      toast.success("Row deleted successfully");
    }
  };

  const handleAreaChange = (areaId: string) => {
    const selectedArea = mockAreas.find(area => area.id === parseInt(areaId));
    if (selectedArea) {
      setCurrentRow({ ...currentRow, area: selectedArea });
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Row Management</h2>
        <Button 
          className="bg-wms-yellow text-black hover:bg-wms-yellow-dark"
          onClick={() => handleOpenDialog("add")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Row
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Area</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="hover-row">
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.rowName}</TableCell>
                <TableCell>{row.area.areaName}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog("view", row)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog("edit", row)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => row.id && handleDelete(row.id)}
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
              {editMode ? "Edit Row" : viewMode ? "View Row" : "Add Row"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="rowName">Row Name</label>
                <Input
                  id="rowName"
                  value={currentRow.rowName}
                  onChange={(e) => setCurrentRow({ ...currentRow, rowName: e.target.value })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="area">Area</label>
                <Select 
                  disabled={viewMode}
                  value={currentRow.area.id?.toString()}
                  onValueChange={handleAreaChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an area" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAreas.map(area => (
                      <SelectItem key={area.id} value={area.id?.toString() || ""}>
                        {area.areaName}
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

export default RowManagement;
