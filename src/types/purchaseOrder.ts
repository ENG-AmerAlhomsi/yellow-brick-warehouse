export interface PurchaseOrderProduct {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  expectedPallets: string;
  price: number;
}

export interface Pallet {
  id?: number;
  palletName: string;
  quantity: number;
  maximumCapacity: number;
  status: string;
  manufacturingDate: string;
  expiryDate: string;
  supplierName: string;
  productId: number;
  productName: string;
  purchaseOrderId?: number;
}

export interface PurchaseOrder {
  id?: number;
  supplierName: string;
  expectedArrivalTime: string;
  totalPrice: number;
  status: "Pending" | "Processing" | "Ready to Ship" | "Shipping";
  products: PurchaseOrderProduct[];
  pallets: Pallet[];
}

export type PurchaseOrderStatus = "Pending" | "Processing" | "Ready to Ship" | "Shipping"; 