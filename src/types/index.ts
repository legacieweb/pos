export interface SiteSettings {
  storeName: string;
  currency: string;
  taxRate: number;
  address: string;
  phone: string;
  logoUrl?: string;
  // Region
  timezone: string;
  dateFormat: string;
  language: string;
  // Notifications
  orderAlerts: boolean;
  stockAlerts: boolean;
  dailyReports: boolean;
  // Security
  twoFactorAuth: boolean;
  sessionTimeout: number; // in minutes
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type PaymentMethod = 'Cash' | 'Card' | 'Mobile Pay';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: number;
  staffId: string;
  paymentMethod: PaymentMethod;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  status: 'active' | 'inactive';
  ordersProcessed: number;
}

export type Role = 'staff' | 'manager';

export interface User {
  id: string;
  name: string;
  role: Role;
}
