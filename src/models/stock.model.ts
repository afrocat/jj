export interface Stock {
  id?: number;
  sku: string;
  quantity: number;
  storeId?: number;
}

export interface Transaction {
  id?: number;
  stockId: number;
  quantity: number;
  type: 'ADD' | 'CONSUME' | 'UPDATE';
  timestamp: string;
}

export interface Product {
  id?: number;
  categoryName: string;
  name: string;
  sku: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  available?: boolean;
  totalQuantity?: number;
}

export interface ConsumeStockRequest {
  quantity: number;
}