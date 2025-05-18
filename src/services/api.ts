import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8083/', // Adjust this to match your Spring Boot backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Area API endpoints
export const areaApi = {
  getAll: () => api.get('/areas'),
  getById: (id: number) => api.get(`/areas/${id}`),
  create: (data: { areaName: string }) => api.post('/areas', data),
  update: (id: number, data: { areaName: string }) => api.put(`/areas/${id}`, data),
  delete: (id: number) => api.delete(`/areas/${id}`),
};

// Row API endpoints
export const rowApi = {
  getAll: () => api.get('/rows'),
  getById: (id: number) => api.get(`/rows/${id}`),
  create: (data: { rowName: string, area: { id: number } }) =>
    api.post('/rows', data),
  update: (id: number, data: { rowName: string, area: { id: number } }) =>
    api.put(`/rows/${id}`, data),
  delete: (id: number) => api.delete(`/rows/${id}`),
};

// Bay API endpoints
export const bayApi = {
  getAll: () => api.get('/bays'),
  getById: (id: number) => api.get(`/bays/${id}`),
  create: (data: { bayName: string, row_sy: { id: number } }) =>
    api.post('/bays', data),
  update: (id: number, data: { bayName: string, row_sy: { id: number } }) =>
    api.put(`/bays/${id}`, data),
  delete: (id: number) => api.delete(`/bays/${id}`),
};

// Position API endpoints
export const positionApi = {
  getAll: () => api.get('/positions'),
  getById: (id: number) => api.get(`/positions/${id}`),
  create: (data: { positionName: string, level: number, isEmpty: boolean, bay: { id: number } }) =>
    api.post('/positions', data),
  update: (id: number, data: { positionName: string, level: number, isEmpty: boolean, bay: { id: number } }) =>
    api.put(`/positions/${id}`, data),
  delete: (id: number) => api.delete(`/positions/${id}`),
};

// Product API endpoints
export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: { name: string, description: string, weight: number, quantityInStock: number, unitPrice: number, batchNumber: string, category: string, imageUrl: string }) =>
    api.post('/products', data),
  update: (id: number, data: { name: string, description: string, weight: number, quantityInStock: number, unitPrice: number, batchNumber: string, category: string, imageUrl: string }) =>
    api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Pallet API endpoints
export const palletApi = {
  getAll: () => api.get('/pallets'),
  getById: (id: number) => api.get(`/pallets/${id}`),
  create: (data: { palletName: string, quantity: number, maximumCapacity: number, manufacturingDate: Date, expiryDate: Date, supplierName: string, status: string, position: { id: number }, product: { id: number } }) =>
    api.post('/pallets', data),
  update: (id: number, data: { palletName: string, quantity: number, maximumCapacity: number, manufacturingDate: Date, expiryDate: Date, supplierName: string, status: string, position: { id: number }, product: { id: number } }) =>
    api.put(`/pallets/${id}`, data),
  delete: (id: number) => api.delete(`/pallets/${id}`),
  getEmptyPositions: () => api.get('/positions/empty'),
  getPalletsByProductId: (productId: number) => api.get(`/pallets/product/${productId}`),
  updatePalletOnly: (id: number, data: { palletName: string, quantity: number, maximumCapacity: number, manufacturingDate: Date, expiryDate: Date, supplierName: string, status: string, position: { id: number }, product: { id: number } }) =>
    api.put(`/pallets/updatepalletonly/${id}`, data),
};


// Order API endpoints
export const orderApi = {
  getAll: () => api.get('/orders'),
  getById: (id: number) => api.get(`/orders/${id}`),
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
  }) => api.post('/orders', data),
  delete: (id: number) => api.delete(`/orders/${id}`),
  exportOrders: (format: string = 'csv') => api.get(`/orders/export?format=${format}`, {
    responseType: 'blob'
  }),
  getCustomerOrders: (userId: string) => api.get(`/orders/user/${userId}`),
  cancelOrder: (id: number) => api.put(`/orders/${id}/cancel`),
  updateOrder: (id: number, data: any) => api.put(`/orders/${id}`, data)
};

// Export the api instance for other services
export default api;