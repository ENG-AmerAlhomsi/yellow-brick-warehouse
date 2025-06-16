import axios from 'axios';
import { keycloak } from '@/config/keycloak';
import { Pallet, PurchaseOrder, PurchaseOrderStatus } from '../types/purchaseOrder';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8083/', // Adjust this to match your Spring Boot backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    // Add authorization header with Keycloak token if available
    if (keycloak.authenticated && keycloak.token) {
      config.headers['Authorization'] = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Purchase Order API endpoints
export const purchaseOrderApi = {
  getAll: async (): Promise<PurchaseOrder[]> => {
    const response = await api.get('/purchase-orders/get');
    return response.data;
  },
  getById: async (id: number): Promise<PurchaseOrder> => {
    const response = await api.get(`/purchase-orders/get/${id}`);
    return response.data;
  },
  create: async (data: PurchaseOrder): Promise<PurchaseOrder> => {
    const response = await api.post('/purchase-orders/create', data);
    return response.data;
  },
  updateStatus: async (id: number, status: PurchaseOrderStatus): Promise<PurchaseOrder> => {
    const response = await api.put(`/purchase-orders/${id}/status?status=${status}`);
    return response.data;
  },
  addPallet: async (purchaseOrderId: number, pallet: Pallet): Promise<PurchaseOrder> => {
    const response = await api.post(`/purchase-orders/${purchaseOrderId}/pallets`, pallet);
    return response.data;
  },
  getBySupplier: async (supplierName: string): Promise<PurchaseOrder[]> => {
    const response = await api.get(`/purchase-orders/supplier/${supplierName}`);
    return response.data;
  },
  getByStatus: async (status: PurchaseOrderStatus): Promise<PurchaseOrder[]> => {
    const response = await api.get(`/purchase-orders/status/${status}`);
    return response.data;
  },
};

// Area API endpoints
export const areaApi = {
  getAll: () => api.get('/areas/get'),
  getById: (id: number) => api.get(`/areas/get/${id}`),
  create: (data: { areaName: string }) => api.post('/areas/create', data),
  update: (id: number, data: { areaName: string }) => api.put(`/areas/update/${id}`, data),
  delete: (id: number) => api.delete(`/areas/delete/${id}`),
};

// Row API endpoints
export const rowApi = {
  getAll: () => api.get('/rows/get'),
  getById: (id: number) => api.get(`/rows/get/${id}`),
  create: (data: { rowName: string, area: { id: number } }) =>
    api.post('/rows/create', data),
  update: (id: number, data: { rowName: string, area: { id: number } }) =>
    api.put(`/rows/update/${id}`, data),
  delete: (id: number) => api.delete(`/rows/delete/${id}`),
};

// Bay API endpoints
export const bayApi = {
  getAll: () => api.get('/bays/get'),
  getById: (id: number) => api.get(`/bays/get/${id}`),
  create: (data: { bayName: string, row_sy: { id: number } }) =>
    api.post('/bays/create', data),
  update: (id: number, data: { bayName: string, row_sy: { id: number } }) =>
    api.put(`/bays/update/${id}`, data),
  delete: (id: number) => api.delete(`/bays/delete/${id}`),
};

// Position API endpoints
export const positionApi = {
  getAll: () => api.get('/positions/get'),
  getById: (id: number) => api.get(`/positions/get/${id}`),
  create: (data: { positionName: string, level: number, isEmpty: boolean, bay: { id: number } }) =>
    api.post('/positions/create', data),
  update: (id: number, data: { positionName: string, level: number, isEmpty: boolean, bay: { id: number } }) =>
    api.put(`/positions/update/${id}`, data),
  delete: (id: number) => api.delete(`/positions/delete/${id}`),
};

// Product API endpoints
export const productApi = {
  getAll: () => api.get('/products/get'),
  getById: (id: number) => api.get(`/products/get/${id}`),
  create: (data: { name: string, description: string, weight: number, quantityInStock: number, unitPrice: number, batchNumber: string, category: { id: number, name: string }, imageUrl: string }) =>
    api.post('/products/create', data),
  update: (id: number, data: { name: string, description: string, weight: number, quantityInStock: number, unitPrice: number, batchNumber: string, category: { id: number, name: string }, imageUrl: string }) =>
    api.put(`/products/update/${id}`, data),
  delete: (id: number) => api.delete(`/products/delete/${id}`),
};

// Pallet API endpoints
export const palletApi = {
  getAll: () => api.get('/pallets/get'),
  getById: (id: number) => api.get(`/pallets/get/${id}`),
  create: (data: { palletName: string, quantity: number, maximumCapacity: number, manufacturingDate: Date, expiryDate: Date, supplierName: string, status: string, position: { id: number }, product: { id: number } }) =>
    api.post('/pallets/create', data),
  update: (id: number, data: { palletName: string, quantity: number, maximumCapacity: number, manufacturingDate: Date, expiryDate: Date, supplierName: string, status: string, position: { id: number }, product: { id: number } }) =>
    api.put(`/pallets/update/${id}`, data),
  delete: (id: number) => api.delete(`/pallets/delete/${id}`),
  getEmptyPositions: () => api.get('/positions/empty'),
  getPalletsByProductId: (productId: number) => api.get(`/pallets/product/${productId}`),
  updatePalletOnly: (id: number, data: { palletName: string, quantity: number, maximumCapacity: number, manufacturingDate: Date, expiryDate: Date, supplierName: string, status: string, position: { id: number }, product: { id: number } }) =>
    api.put(`/pallets/updatepalletonly/${id}`, data),
};


// Order API endpoints
export const orderApi = {
  getAll: () => api.get('/order/get'),
  getById: (id: number) => api.get(`/order/get/${id}`),
  create: (data: { 
    customer: string, 
    date: string, 
    items: number, 
    value: string, 
    status: string, 
    shipment: string, 
    products: Array<{
      product: { id: number },
      quantity: number
    }>,
    shippingAddress: {
      address: string,
      city: string,
      state: string,
      zipCode: string
    },
    payment: {
      last4: string
    },
    userId: string
  }) => api.post('/order/create', data),
  delete: (id: number) => api.delete(`/order/delete/${id}`),
  exportOrders: (format: string = 'csv') => api.get(`/order/export?format=${format}`, {
    responseType: 'blob'
  }),
  getCustomerOrders: (userId: string) => api.get(`/order/user/${userId}`),
  cancelOrder: (id: number) => api.put(`/order/cancel/${id}`),
  updateOrder: (id: number, data) => api.put(`/order/update/${id}`, data)
};

// Shipment API
export const shipmentApi = {
  getAll: () => api.get('/shipments/get'),
  getById: (id: number) => api.get(`/shipments/get/${id}`),
  create: (data: {
    shipmentName: string,
    fromName: string,
    toName: string,
    shippingEmployee: string,
    typeName: string,
    statusName: string,
    orders: Array<{ id: number }>
  }) => api.post('/shipments/create', data),
  update: (id: number, data: {
    shipmentName: string,
    fromName: string,
    toName: string,
    shippingEmployee: string,
    typeName: string,
    statusName: string,
    orders: Array<{ id: number }>
  }) => api.put(`/shipments/update/${id}`, data),
  delete: (id: number) => api.delete(`/shipments/delete/${id}`),
  getByEmployeeId: (employeeId: string) => api.get(`/shipments/employee/${employeeId}`)
};

// User API endpoints
export const userApi = {
  getAllUsers: () => api.get('/keycloak/users'),
  getUsersByRole: (role: string) => api.get(`/keycloak/users-by-role/${role}`),
  getUserById: (id: string) => api.get(`/keycloak/users/${id}`)
};

// Category API endpoints
export const categoryApi = {
  getAll: () => api.get('/categories/get'),
  getById: (id) => api.get(`/categories/get/${id}`),
  create: (data) => api.post('/categories/create', data),
  update: (id, data) => api.put(`/categories/update/${id}`, data),
  delete: (id) => api.delete(`/categories/delete/${id}`)
};


// Export the api instance for other services
export default api;