
export enum Status {
  Active = 'Activo',
  Inactive = 'Inactivo',
  Pending = 'Pendiente',
  Completed = 'Completado',
  Cancelled = 'Cancelado',
  Hidden = 'Oculto',
  Featured = 'Destacado'
}

export interface Company {
  id: string;
  name: string;
  color: string;
  logo: string;
}

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: Status;
  joinDate: string;
}

export interface Order {
  id: string;
  companyId: string;
  customerName: string;
  products: string;
  amount: number;
  status: Status;
  date: string;
  paymentMethod: string;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: Status;
  sku: string;
}

export interface MetricData {
  name: string;
  value: number;
  previousValue?: number;
}

export type MovementType = 'in' | 'out' | 'adjustment' | 'return';

export interface StockMovement {
  id: string;
  companyId: string;
  productId: string;
  productName: string;
  sku: string;
  type: MovementType;
  quantity: number;
  date: string;
  user: string;
  reason: string;
}

// New Types for Settings Module
export type UserRole = 'Admin' | 'Gerente' | 'Vendedor' | 'Soporte';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: Status;
  lastLogin: string;
  avatar?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  date: string;
  type: 'info' | 'warning' | 'danger' | 'success';
}

// Marketing Types
export interface AbandonedCart {
  id: string;
  companyId: string;
  customerName?: string; 
  guestId?: string;
  products: { name: string; price: number; image?: string }[];
  totalValue: number;
  date: string;
  recoveryStatus: 'Pending' | 'Scheduled' | 'Email Sent' | 'Recovered';
  scheduledDate?: string; // e.g. "2025-11-20"
  scheduledTime?: string; // e.g. "10:00"
  channel?: 'Email' | 'WhatsApp' | 'SMS';
}

export interface WishlistStat {
  productId: string;
  companyId: string;
  productName: string;
  count: number; 
  price: number;
}

export interface TrafficStat {
  date: string; 
  companyId: string;
  registeredVisitors: number;
  guestVisitors: number; 
}

// Marketplace Types
export interface MarketplaceOrder extends Order {
  platform: 'Amazon' | 'Miravia';
  externalOrderId: string;
  shippingStatus: 'Pending Shipment' | 'Shipped' | 'Delivered' | 'Returned';
  trackingNumber?: string;
}

export interface APlusContent {
  id: string;
  productId: string;
  productName: string;
  status: 'Draft' | 'Published' | 'Review';
  modules: { type: 'Banner' | 'Text' | 'Grid'; content: string }[];
}

export interface ProductVariation {
  id: string;
  productId: string;
  attributes: {
    color?: string;
    material?: string;
    size?: string;
  };
  images: string[];
  mainImage: string;
  sku: string;
}

// Notification Types
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'alert' | 'system' | 'message';
  link?: string;
}

// Transport & Logistics Types
export interface ShipmentAction {
  id: string;
  date: string;
  action: string; // "Label Created", "Picked Up", "Issue Reported"
  user: string;
  note?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  provider: 'DHL' | 'SEUR';
  customerName: string;
  originAddress?: string;
  destinationAddress: string;
  city: string;
  zipCode: string;
  weight: number; // kg
  shippingCost: number;
  status: 'Ready' | 'In Transit' | 'Delivered' | 'Exception';
  trackingNumber?: string;
  shippingDate?: string; // YYYY-MM-DD
  arrivalDate?: string;  // YYYY-MM-DD
  history: ShipmentAction[];
}

// Supplier Types
export interface SupplierOrder {
  id: string;
  companyId: string;
  supplierName: string;
  productName: string;
  sku: string;
  contractedQty: number; // Cantidad contratada
  availableQty: number;  // Cantidad disponible/recibida
  purchaseDate: string;
  expectedDate?: string;
  status: 'Completo' | 'Parcial' | 'Pendiente' | 'Retrasado';
}