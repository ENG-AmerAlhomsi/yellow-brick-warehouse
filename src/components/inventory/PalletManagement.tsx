
import React, { useState, useEffect } from "react";
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
import { Pallet, Position, Product } from "@/types/warehouse";

// Mock data for products
const mockProducts: Product[] = [
  { id: 1, name: "Standard Box", description: "Standard shipping box", weight: 0.5, quantityInStock: 1200, unitPrice: 1.99, batchNumber: "B001", category: "Packaging", imageUrl: "/placeholder.svg" },
  { id: 2, name: "Premium Box", description: "Premium packaging solution", weight: 0.8, quantityInStock: 500, unitPrice: 3.99, batchNumber: "B002", category: "Packaging", imageUrl: "/placeholder.svg" },
  { id: 3, name: "Metal Bracket", description: "Multi-purpose metal bracket", weight: 0.2, quantityInStock: 120, unitPrice: 2.5, batchNumber: "H001", category: "Hardware", imageUrl: "/placeholder.svg" },
];

// Initial positions - will be updated from the global state
const initialPositions: Position[] = [
  { id: 1, positionName: "Position 01", level: 1, isEmpty: true, bay: { id: 1, bayName: "Bay 01", row_sy: { id: 1, rowName: "Row 01", area: { id: 1, areaName: "Area A" } } } },
  { id: 2, positionName: "Position 02", level: 2, isEmpty: true, bay: { id: 1, bayName: "Bay 01", row_sy: { id: 1, rowName: "Row 01", area: { id: 1, areaName: "Area A" } } } },
  { id: 3, positionName: "Position 03", level: 1, isEmpty: true, bay: { id: 2, bayName: "Bay 02", row_sy: { id: 1, rowName: "Row 01", area: { id: 1, areaName: "Area A" } } } },
];

// Mock data for pallets
const mockPallets: Pallet[] = [
  { 
    id: 1, 
    palletName: "PLT-001", 
    quantity: 100, 
    maximumCapacity: 200, 
    manufacturingDate: new Date('2023-01-15'),
    expiryDate: new Date('2025-01-15'),
    supplierName: "Supplier Inc.",
    status: "stored", 
    position: initialPositions[0], 
    product: mockProducts[0] 
  },
  { 
    id: 2, 
    palletName: "PLT-002", 
    quantity: 50, 
    maximumCapacity: 100, 
    manufacturingDate: new Date('2023-02-10'),
    expiryDate: new Date('2024-12-10'),
    supplierName: "Box Co.",
    status: "shipping", 
    position: initialPositions[1], 
    product: mockProducts[1] 
  },
];

export const PalletManagement = () => {
  const [pallets, setPallets] = useState<Pallet[]>(mockPallets);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [emptyPositions, setEmptyPositions] = useState<Position[]>([]);
  const [currentPallet, setCurrentPallet] = useState<Pallet>({
    palletName: "",
    quantity: 0,
    maximumCapacity: 0,
    manufacturingDate: new Date(),
    expiryDate: new Date(),
    supplierName: "",
    status: "stored",
    position: initialPositions[0],
    product: mockProducts[0],
  });

  // Update products list from global window object if available
  useEffect(() => {
    if ((window as any).mockProducts) {
      setProducts((window as any).mockProducts);
    }
  }, [(window as any).mockProducts]);

  // Update positions list from global window object if available
  useEffect(() => {
    if ((window as any).mockPositions) {
      setPositions((window as any).mockPositions);
      
      // Filter positions that are empty
      const emptyPos = ((window as any).mockPositions as Position[]).filter(pos => pos.isEmpty);
      setEmptyPositions(emptyPos);
    }
  }, [(window as any).mockPositions]);

  const handleOpenDialog = (mode: "add" | "edit" | "view", pallet?: Pallet) => {
    setDialogOpen(true);
    setEditMode(mode === "edit");
    setViewMode(mode === "view");
    
    if (pallet) {
      setCurrentPallet({ ...pallet });
    } else {
      setCurrentPallet({
        palletName: "",
        quantity: 0,
        maximumCapacity: 0,
        manufacturingDate: new Date(),
        expiryDate: new Date(),
        supplierName: "",
        status: "stored",
        position: emptyPositions.length > 0 ? emptyPositions[0] : positions[0],
        product: products[0],
      });
    }
  };

  const handleSave = () => {
    if (!currentPallet.palletName.trim()) {
      toast.error("Pallet name is required");
      return;
    }
    
    if (currentPallet.quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (currentPallet.quantity > currentPallet.maximumCapacity) {
      toast.error(`Quantity exceeds maximum capacity (${currentPallet.maximumCapacity})`);
      return;
    }
    
    if (editMode && currentPallet.id) {
      // Update existing pallet
      setPallets(pallets.map(pallet => 
        pallet.id === currentPallet.id ? { ...currentPallet } : pallet
      ));
      toast.success("Pallet updated successfully");
    } else {
      // Check if the selected position is already occupied
      const positionIsOccupied = pallets.some(p => 
        p.position.id === currentPallet.position.id && p.id !== currentPallet.id
      );

      if (positionIsOccupied) {
        toast.error("The selected position is already occupied");
        return;
      }

      // Add new pallet
      const newId = Math.max(...pallets.map(p => p.id || 0), 0) + 1;
      setPallets([...pallets, { ...currentPallet, id: newId }]);
      
      // Update position status to occupied
      const updatedPositions = positions.map(pos => 
        pos.id === currentPallet.position.id ? { ...pos, isEmpty: false } : pos
      );
      setPositions(updatedPositions);
      
      // Update empty positions list
      setEmptyPositions(updatedPositions.filter(pos => pos.isEmpty));
      
      // Update global positions list
      (window as any).mockPositions = updatedPositions;
      
      toast.success("Pallet added successfully");
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this pallet?")) {
      const palletToDelete = pallets.find(pallet => pallet.id === id);
      
      // Free up the position when pallet is deleted
      if (palletToDelete) {
        const updatedPositions = positions.map(pos => 
          pos.id === palletToDelete.position.id ? { ...pos, isEmpty: true } : pos
        );
        setPositions(updatedPositions);
        setEmptyPositions(updatedPositions.filter(pos => pos.isEmpty));
        (window as any).mockPositions = updatedPositions;
      }
      
      setPallets(pallets.filter(pallet => pallet.id !== id));
      toast.success("Pallet deleted successfully");
    }
  };

  const handleProductChange = (productId: string) => {
    const selectedProduct = products.find(product => product.id === parseInt(productId));
    if (selectedProduct) {
      setCurrentPallet({ ...currentPallet, product: selectedProduct });
    }
  };

  const handlePositionChange = (positionId: string) => {
    const selectedPosition = positions.find(position => position.id === parseInt(positionId));
    if (selectedPosition) {
      setCurrentPallet({ ...currentPallet, position: selectedPosition });
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Pallet Management</h2>
        <Button 
          className="bg-wms-yellow text-black hover:bg-wms-yellow-dark"
          onClick={() => handleOpenDialog("add")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Pallet
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Max Capacity</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pallets.map((pallet) => (
              <TableRow key={pallet.id} className="hover-row">
                <TableCell>{pallet.id}</TableCell>
                <TableCell>{pallet.palletName}</TableCell>
                <TableCell>{pallet.product.name}</TableCell>
                <TableCell>{pallet.quantity}</TableCell>
                <TableCell>{pallet.maximumCapacity}</TableCell>
                <TableCell>{`${pallet.position.positionName} (Level ${pallet.position.level})`}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    pallet.status === "stored" ? "bg-green-100 text-green-800" :
                    pallet.status === "shipping" ? "bg-blue-100 text-blue-800" :
                    pallet.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {pallet.status.charAt(0).toUpperCase() + pallet.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog("view", pallet)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog("edit", pallet)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => pallet.id && handleDelete(pallet.id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit Pallet" : viewMode ? "View Pallet" : "Add Pallet"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="palletName">Pallet Name</label>
                <Input
                  id="palletName"
                  value={currentPallet.palletName}
                  onChange={(e) => setCurrentPallet({ ...currentPallet, palletName: e.target.value })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="product">Product</label>
                <Select 
                  disabled={viewMode}
                  value={currentPallet.product.id?.toString()}
                  onValueChange={handleProductChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id?.toString() || ""}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="quantity">Quantity</label>
                <Input
                  id="quantity"
                  type="number"
                  value={currentPallet.quantity}
                  onChange={(e) => setCurrentPallet({ 
                    ...currentPallet, 
                    quantity: parseInt(e.target.value) || 0
                  })}
                  readOnly={viewMode}
                />
                {currentPallet.quantity > currentPallet.maximumCapacity && !viewMode && (
                  <p className="text-red-500 text-sm">
                    Quantity exceeds maximum capacity
                  </p>
                )}
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="maximumCapacity">Maximum Capacity</label>
                <Input
                  id="maximumCapacity"
                  type="number"
                  value={currentPallet.maximumCapacity}
                  onChange={(e) => setCurrentPallet({ 
                    ...currentPallet, 
                    maximumCapacity: parseInt(e.target.value) || 0
                  })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="manufacturingDate">Manufacturing Date</label>
                <Input
                  id="manufacturingDate"
                  type="date"
                  value={formatDate(currentPallet.manufacturingDate)}
                  onChange={(e) => setCurrentPallet({ 
                    ...currentPallet, 
                    manufacturingDate: new Date(e.target.value)
                  })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="expiryDate">Expiry Date</label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formatDate(currentPallet.expiryDate)}
                  onChange={(e) => setCurrentPallet({ 
                    ...currentPallet, 
                    expiryDate: new Date(e.target.value)
                  })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="supplierName">Supplier Name</label>
                <Input
                  id="supplierName"
                  value={currentPallet.supplierName}
                  onChange={(e) => setCurrentPallet({ 
                    ...currentPallet, 
                    supplierName: e.target.value
                  })}
                  readOnly={viewMode}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="status">Status</label>
                <Select 
                  disabled={viewMode}
                  value={currentPallet.status}
                  onValueChange={(value: "stored" | "shipping" | "processing" | "damaged") => 
                    setCurrentPallet({ ...currentPallet, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stored">Stored</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="position">Position</label>
                <Select 
                  disabled={viewMode}
                  value={currentPallet.position.id?.toString()}
                  onValueChange={handlePositionChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    {emptyPositions.length > 0 && !editMode ? (
                      emptyPositions.map(position => (
                        <SelectItem key={position.id} value={position.id?.toString() || ""}>
                          {position.positionName} (Level {position.level}, {position.bay.bayName})
                        </SelectItem>
                      ))
                    ) : (
                      positions.map(position => (
                        <SelectItem key={position.id} value={position.id?.toString() || ""}>
                          {position.positionName} (Level {position.level}, {position.bay.bayName})
                          {!position.isEmpty && position.id !== currentPallet.position.id && " - Occupied"}
                        </SelectItem>
                      ))
                    )}
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

export default PalletManagement;
