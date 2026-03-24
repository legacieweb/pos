import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Mock Data Source
let products = [
  { id: '1', name: 'Classic Burger', price: 12.99, category: 'Food', stock: 50, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200' },
  { id: '2', name: 'Cheeseburger', price: 14.99, category: 'Food', stock: 45, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=200' },
  { id: '3', name: 'French Fries', price: 4.99, category: 'Sides', stock: 100, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=200' },
  { id: '4', name: 'Onion Rings', price: 5.99, category: 'Sides', stock: 80, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&q=80&w=200' },
  { id: '5', name: 'Coca Cola', price: 2.50, category: 'Drinks', stock: 200, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200' },
  { id: '6', name: 'Orange Juice', price: 3.50, category: 'Drinks', stock: 150, image: 'https://healthmylifestyle.com/wp-content/uploads/2023/01/Fresh-squeezed-orange-juice-featured.jpg' },
  { id: '7', name: 'Iced Latte', price: 4.50, category: 'Coffee', stock: 60, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=200' },
  { id: '8', name: 'Espresso', price: 3.00, category: 'Coffee', stock: 75, image: 'https://www.sharmispassions.com/wp-content/uploads/2012/07/espresso-coffee-recipe04-500x375.jpg' },
  { id: '9', name: 'Veggie Pizza', price: 18.99, category: 'Food', stock: 30, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200' },
  { id: '10', name: 'Caesar Salad', price: 10.99, category: 'Food', stock: 25, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=200' },
];

let staff = [
  { id: 's1', name: 'John Doe', email: 'john@pos.com', role: 'staff', avatar: 'https://i.pravatar.cc/150?u=s1', status: 'active', ordersProcessed: 142 },
  { id: 's2', name: 'Jane Smith', email: 'jane@pos.com', role: 'staff', avatar: 'https://i.pravatar.cc/150?u=s2', status: 'active', ordersProcessed: 98 },
  { id: 's3', name: 'Alex Johnson', email: 'alex@pos.com', role: 'manager', avatar: 'https://i.pravatar.cc/150?u=s3', status: 'active', ordersProcessed: 45 },
  { id: 's4', name: 'Sarah Wilson', email: 'sarah@pos.com', role: 'staff', avatar: 'https://i.pravatar.cc/150?u=s4', status: 'inactive', ordersProcessed: 12 },
];

let orders = [
  { id: 'ORD-7721', items: [{ ...products[0], quantity: 2 }], total: 25.98, timestamp: Date.now() - 1000 * 60 * 30, staffId: 's1', paymentMethod: 'Card' },
  { id: 'ORD-7722', items: [{ ...products[2], quantity: 1 }, { ...products[4], quantity: 1 }], total: 7.49, timestamp: Date.now() - 1000 * 60 * 45, staffId: 's2', paymentMethod: 'Cash' },
  { id: 'ORD-7723', items: [{ ...products[1], quantity: 1 }, { ...products[3], quantity: 2 }], total: 26.97, timestamp: Date.now() - 1000 * 60 * 60, staffId: 's1', paymentMethod: 'Mobile Pay' },
  { id: 'ORD-7724', items: [{ ...products[8], quantity: 1 }], total: 18.99, timestamp: Date.now() - 1000 * 60 * 120, staffId: 's3', paymentMethod: 'Card' },
  { id: 'ORD-7725', items: [{ ...products[0], quantity: 3 }, { ...products[5], quantity: 2 }], total: 45.97, timestamp: Date.now() - 1000 * 60 * 150, staffId: 's2', paymentMethod: 'Card' },
];

let settings = {
  storeName: 'The Modern Bistro (Cloud)',
  currency: '$',
  taxRate: 10,
  address: '77 Cloud Computing Way, Silicon Valley',
  phone: '+1 800 CLOUD POS',
  timezone: 'UTC -5 (EST)',
  dateFormat: 'MM/DD/YYYY',
  language: 'English',
  orderAlerts: true,
  stockAlerts: true,
  dailyReports: true,
  twoFactorAuth: false,
  sessionTimeout: 30,
};

// Endpoints
app.get('/api/products', (req, res) => res.json(products));
app.get('/api/staff', (req, res) => res.json(staff));
app.get('/api/orders', (req, res) => res.json(orders));
app.get('/api/settings', (req, res) => res.json(settings));

app.post('/api/orders', (req, res) => {
  const newOrder = req.body;
  orders.push(newOrder);
  
  // Update staff stats
  const staffMember = staff.find(s => s.id === newOrder.staffId);
  if (staffMember) {
    staffMember.ordersProcessed += 1;
  }

  // Update stock
  newOrder.items.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      product.stock -= item.quantity;
    }
  });

  res.status(201).json(newOrder);
});

app.patch('/api/settings', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

// Periodic data simulation (mock sales happening automatically)
setInterval(() => {
  const randomStaff = staff[Math.floor(Math.random() * staff.length)];
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  const quantity = Math.floor(Math.random() * 3) + 1;
  
  const subtotal = randomProduct.price * quantity;
  const tax = subtotal * (settings.taxRate / 100);
  const total = Number((subtotal + tax).toFixed(2));

  const autoOrder = {
    id: `AUTO-${Math.floor(1000 + Math.random() * 9000)}`,
    items: [{ ...randomProduct, quantity }],
    total,
    timestamp: Date.now(),
    staffId: randomStaff.id,
    paymentMethod: ['Card', 'Cash', 'Mobile Pay'][Math.floor(Math.random() * 3)],
  };

  orders.push(autoOrder);
  randomStaff.ordersProcessed += 1;
  randomProduct.stock -= quantity;

  // Keep orders list manageable
  if (orders.length > 50) orders.shift();
  
  console.log(`[Auto-Sale] Generated order ${autoOrder.id} by ${randomStaff.name}`);
}, 30000); // New sale every 30 seconds

app.listen(port, () => {
  console.log(`Mock POS Server running at http://localhost:${port}`);
});
