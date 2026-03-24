import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Order, User, Staff, PaymentMethod, SiteSettings } from '../types';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Classic Burger', price: 12.99, category: 'Food', stock: 50, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200' },
  { id: '2', name: 'Cheeseburger', price: 14.99, category: 'Food', stock: 45, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=200' },
  { id: '3', name: 'French Fries', price: 4.99, category: 'Sides', stock: 100, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=200' },
  { id: '4', name: 'Onion Rings', price: 5.99, category: 'Sides', stock: 80, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&q=80&w=200' },
  { id: '5', name: 'Coca Cola', price: 2.50, category: 'Drinks', stock: 200, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200' },
  { id: '6', name: 'Orange Juice', price: 3.50, category: 'Drinks', stock: 150, image: 'https://images.unsplash.com/photo-1600271886311-dc543050995c?auto=format&fit=crop&q=80&w=200' },
  { id: '7', name: 'Iced Latte', price: 4.50, category: 'Coffee', stock: 60, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=200' },
  { id: '8', name: 'Espresso', price: 3.00, category: 'Coffee', stock: 75, image: 'https://images.unsplash.com/photo-1510707577719-5d6835a714c5?auto=format&fit=crop&q=80&w=200' },
  { id: '9', name: 'Veggie Pizza', price: 18.99, category: 'Food', stock: 30, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200' },
  { id: '10', name: 'Caesar Salad', price: 10.99, category: 'Food', stock: 25, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=200' },
];

const MOCK_STAFF: Staff[] = [
  { id: 's1', name: 'John Doe', email: 'john@pos.com', role: 'staff', avatar: 'https://i.pravatar.cc/150?u=s1', status: 'active', ordersProcessed: 142 },
  { id: 's2', name: 'Jane Smith', email: 'jane@pos.com', role: 'staff', avatar: 'https://i.pravatar.cc/150?u=s2', status: 'active', ordersProcessed: 98 },
  { id: 's3', name: 'Alex Johnson', email: 'alex@pos.com', role: 'manager', avatar: 'https://i.pravatar.cc/150?u=s3', status: 'active', ordersProcessed: 45 },
  { id: 's4', name: 'Sarah Wilson', email: 'sarah@pos.com', role: 'staff', avatar: 'https://i.pravatar.cc/150?u=s4', status: 'inactive', ordersProcessed: 12 },
];

const MOCK_SETTINGS: SiteSettings = {
  storeName: 'The Modern Bistro',
  currency: '$',
  taxRate: 10,
  address: '77 Silicon Valley',
  phone: '+1 800 POS',
  timezone: 'UTC -5 (EST)',
  dateFormat: 'MM/DD/YYYY',
  language: 'English',
  orderAlerts: true,
  stockAlerts: true,
  dailyReports: true,
  twoFactorAuth: false,
  sessionTimeout: 30,
};

interface State {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  staff: Staff[];
  currentUser: User | null;
  settings: SiteSettings;
  isOffline: boolean;
  
  // Actions
  fetchData: () => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (staffId: string, paymentMethod: PaymentMethod) => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
  updateSettings: (settings: SiteSettings) => Promise<void>;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      products: MOCK_PRODUCTS,
      cart: [],
      orders: [],
      staff: MOCK_STAFF,
      currentUser: null,
      settings: MOCK_SETTINGS,
      isOffline: false,

      fetchData: async () => {
        try {
          const [productsRes, staffRes, ordersRes, settingsRes] = await Promise.all([
            fetch(`${API_URL}/products`),
            fetch(`${API_URL}/staff`),
            fetch(`${API_URL}/orders`),
            fetch(`${API_URL}/settings`),
          ]);

          if (!productsRes.ok || !staffRes.ok || !ordersRes.ok || !settingsRes.ok) {
            throw new Error('Server returned an error');
          }

          const products = await productsRes.json();
          const staff = await staffRes.json();
          const orders = await ordersRes.json();
          const settings = await settingsRes.json();

          set({ products, staff, orders, settings, isOffline: false });
        } catch (error) {
          // Silent fallback to avoid console clutter when server is not running
          const state = get();
          set({ isOffline: true });
          if (state.products.length <= MOCK_PRODUCTS.length) {
            set({ 
              products: MOCK_PRODUCTS, 
              staff: MOCK_STAFF, 
              settings: MOCK_SETTINGS,
            });
          }
        }
      },
      
      addToCart: (product) => set((state) => {
        const existing = state.cart.find((item) => item.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== productId),
      })),

      updateCartQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
        ).filter(item => item.quantity > 0),
      })),

      clearCart: () => set({ cart: [] }),

      placeOrder: async (staffId, paymentMethod) => {
        const state = get();
        const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * (state.settings.taxRate / 100);
        const total = Number((subtotal + tax).toFixed(2));
        
        const newOrder: Order = {
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          items: [...state.cart],
          total,
          timestamp: Date.now(),
          staffId,
          paymentMethod,
        };

        try {
          const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder),
          });
          
          if (res.ok) {
            // Refresh data to get updated stock and orders (including potential auto-generated ones)
            await get().fetchData();
            set({ cart: [] });
          }
        } catch (error) {
          console.error('Failed to place order:', error);
        }
      },

      setCurrentUser: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      
      updateSettings: async (newSettings) => {
        try {
          const res = await fetch(`${API_URL}/settings`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSettings),
          });
          
          if (res.ok) {
            const updated = await res.json();
            set({ settings: updated });
          }
        } catch (error) {
          console.error('Failed to update settings:', error);
        }
      },
    }),
    {
      name: 'pos-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
);
