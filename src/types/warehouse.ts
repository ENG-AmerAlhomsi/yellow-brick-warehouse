
export interface Area {
  id?: number;
  areaName: string;
}

export interface Row {
  id?: number;
  rowName: string;
  area: Area;
}

export interface Bay {
  id?: number;
  bayName: string;
  row_sy: Row;
}

export interface Position {
  id?: number;
  positionName: string;
  level: number;
  isEmpty: boolean;
  bay: Bay;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  weight: number;
  quantityInStock: number;
  unitPrice: number;
  batchNumber: string;
  category: string;
  imageUrl: string;
}

export interface Pallet {
  id?: number;
  palletName: string;
  quantity: number;
  maximumCapacity: number;
  manufacturingDate: Date;
  expiryDate: Date;
  supplierName: string;
  status: "stored" | "shipping" | "processing" | "damaged";
  position: Position;
  product: Product;
}
