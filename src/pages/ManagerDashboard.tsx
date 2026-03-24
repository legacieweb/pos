import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  LogOut,
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  Search,
  Filter,
  Plus,
  Mail,
  ShieldCheck,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  Settings as SettingsIcon,
  Globe,
  Bell,
  Lock,
  Save,
  CheckCircle,
  Store,
  ChevronRight,
  RefreshCcw,
  Zap,
  Clock,
  Menu,
  X,
  UserCheck,
  UserX,
  Edit2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type View = 'dashboard' | 'inventory' | 'staff' | 'reports' | 'settings';
type SettingsTab = 'general' | 'region' | 'notifications' | 'security';

const StatCard = ({ title, value, trend, icon: Icon, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 shadow-lg`}>
        <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className={`flex items-center gap-1 font-black ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
        {Math.abs(trend)}%
      </div>
    </div>
    <p className="text-slate-500 font-bold mb-2 uppercase tracking-widest text-xs">{title}</p>
    <h3 className="text-4xl font-black text-slate-900">{value}</h3>
  </motion.div>
);

const ManagerDashboard: React.FC = () => {
  const { orders, logout, currentUser, products, staff, settings, updateSettings, fetchData, isOffline } = useStore();
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('general');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Poll for new data to show auto-generated sales
    // Slow down polling if server is unreachable to reduce console clutter
    const interval = setInterval(() => {
      fetchData();
    }, isOffline ? 60000 : 10000);
    return () => clearInterval(interval);
  }, [fetchData, isOffline]);

  // Local state for settings form
  const [formData, setFormData] = useState(settings);

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrder = orders.length > 0 ? totalSales / orders.length : 0;

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const renderDashboard = () => (
    <div className="space-y-6 lg:y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        <StatCard title="Daily Revenue" value={`${settings.currency}${totalSales.toFixed(2)}`} trend={12.5} icon={TrendingUp} color="bg-emerald-500" />
        <StatCard title="Total Orders" value={orders.length.toString()} trend={8.2} icon={ShoppingCart} color="bg-indigo-600" />
        <StatCard title="Avg. Order" value={`${settings.currency}${avgOrder.toFixed(2)}`} trend={-2.4} icon={BarChart3} color="bg-amber-500" />
        <StatCard title="Active Staff" value={staff.length.toString()} trend={0} icon={Users} color="bg-purple-600" />
      </div>

      <div className="bg-white rounded-3xl lg:rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 lg:p-10 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
            <button 
              onClick={fetchData}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Refresh Data"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
          <button className="text-indigo-600 font-black text-xs lg:text-sm uppercase tracking-widest hover:text-indigo-700">View All Transactions</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-widest text-xs font-black">
                <th className="px-10 py-6">Order ID</th>
                <th className="px-10 py-6">Time</th>
                <th className="px-10 py-6">Payment</th>
                <th className="px-10 py-6">Amount</th>
                <th className="px-10 py-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-all cursor-default group">
                  <td className="px-10 py-8 text-slate-900 font-black">#{order.id}</td>
                  <td className="px-10 py-8 text-slate-500">{new Date(order.timestamp).toLocaleTimeString()}</td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      {order.paymentMethod === 'Card' && <CreditCard size={18} className="text-blue-500" />}
                      {order.paymentMethod === 'Cash' && <Banknote size={18} className="text-emerald-500" />}
                      {order.paymentMethod === 'Mobile Pay' && <Smartphone size={18} className="text-purple-500" />}
                      <span className="text-slate-600">{order.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-indigo-600 font-black">{settings.currency}{order.total.toFixed(2)}</td>
                  <td className="px-10 py-8 text-right">
                    <span className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Completed</span>
                  </td>
                </tr>
              )).reverse()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 lg:py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
          />
        </div>
        <button className="w-full sm:w-auto bg-indigo-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl lg:rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px] lg:min-w-0">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-widest text-xs font-black">
                <th className="px-6 lg:px-10 py-4 lg:py-6">Product</th>
                <th className="px-6 lg:px-10 py-4 lg:py-6">Category</th>
                <th className="px-6 lg:px-10 py-4 lg:py-6">Price</th>
                <th className="px-6 lg:px-10 py-4 lg:py-6">Stock</th>
                <th className="px-6 lg:px-10 py-4 lg:py-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-6 lg:px-10 py-4 lg:py-6">
                    <div className="flex items-center gap-4">
                      <img src={product.image} className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl object-cover shadow-sm" alt="" />
                      <span className="font-bold text-slate-900 text-sm lg:text-base">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 lg:px-10 py-4 lg:py-6 font-medium text-slate-500 text-sm lg:text-base">{product.category}</td>
                  <td className="px-6 lg:px-10 py-4 lg:py-6 font-black text-slate-900 text-sm lg:text-base">{settings.currency}{product.price.toFixed(2)}</td>
                  <td className="px-6 lg:px-10 py-4 lg:py-6">
                    <div className="w-full max-w-[80px] lg:max-w-[100px] bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${product.stock < 30 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min(product.stock, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] lg:text-xs font-bold text-slate-400 mt-1 block">{product.stock} units left</span>
                  </td>
                  <td className="px-6 lg:px-10 py-4 lg:py-6 text-right">
                    <span className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-black uppercase tracking-widest ${
                      product.stock > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStaff = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {staff.map((member) => (
        <motion.div 
          key={member.id}
          whileHover={{ y: -5 }}
          className="bg-white p-6 lg:p-8 rounded-3xl lg:rounded-[40px] shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="relative">
              <img src={member.avatar} className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl lg:rounded-3xl object-cover shadow-lg" alt="" />
              <div className={`absolute -bottom-1 lg:-bottom-2 -right-1 lg:-right-2 w-6 h-6 lg:w-8 lg:h-8 rounded-full border-4 border-white flex items-center justify-center ${
                member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
              }`}>
                <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full" />
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="text-xl lg:text-2xl font-black text-slate-900 truncate">{member.name}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] lg:text-xs flex items-center gap-2">
                <ShieldCheck size={14} className="text-indigo-600" />
                {member.role}
              </p>
            </div>
          </div>
          
          <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
            <div className="flex items-center gap-3 text-slate-500 font-medium text-sm lg:text-base truncate">
              <Mail size={18} className="text-slate-400 shrink-0" />
              {member.email}
            </div>
            <div className="flex items-center gap-3 text-slate-500 font-medium text-sm lg:text-base">
              <ShoppingCart size={18} className="text-slate-400 shrink-0" />
              {member.ordersProcessed} Orders
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100 text-[10px] uppercase tracking-wider">
              <Edit2 size={16} />
              Edit
            </button>
            <button className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl font-bold transition-all border text-[10px] uppercase tracking-wider ${
              member.status === 'active' 
                ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' 
                : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
            }`}>
              {member.status === 'active' ? (
                <>
                  <UserX size={16} />
                  Deactivate
                </>
              ) : (
                <>
                  <UserCheck size={16} />
                  Activate
                </>
              )}
            </button>
            <button className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-100 text-[10px] uppercase tracking-wider">
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        </motion.div>
      ))}
      <button className="border-4 border-dashed border-slate-200 rounded-3xl lg:rounded-[40px] p-6 lg:p-8 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all group min-h-[250px]">
        <div className="p-4 lg:p-6 bg-slate-50 rounded-2xl lg:rounded-3xl group-hover:bg-indigo-50 transition-all">
          <Plus size={32} lg:size={48} />
        </div>
        <span className="text-lg lg:text-xl font-bold">Add Staff Member</span>
      </button>
    </div>
  );

  const renderSettings = () => {
    const tabs = [
      { id: 'general', label: 'General', icon: Store, description: 'Basic store information' },
      { id: 'region', label: 'Region', icon: Globe, description: 'Currency and localization' },
      { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Manage alerts and reports' },
      { id: 'security', label: 'Security', icon: Lock, description: 'Privacy and authentication' },
    ];

    return (
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Modern Settings Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSettingsTab(tab.id as SettingsTab)}
              className={`w-full flex items-center gap-4 p-5 rounded-[28px] transition-all text-left group ${
                activeSettingsTab === tab.id 
                  ? 'bg-white shadow-xl shadow-indigo-100 border border-indigo-50' 
                  : 'hover:bg-white/60'
              }`}
            >
              <div className={`p-3 rounded-2xl transition-all ${
                activeSettingsTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400 group-hover:bg-white'
              }`}>
                <tab.icon size={22} />
              </div>
              <div className="min-w-0">
                <p className={`font-black text-sm uppercase tracking-widest ${activeSettingsTab === tab.id ? 'text-slate-900' : 'text-slate-400'}`}>
                  {tab.label}
                </p>
                <p className="text-xs text-slate-400 font-medium truncate">{tab.description}</p>
              </div>
              {activeSettingsTab === tab.id && <ChevronRight size={18} className="ml-auto text-indigo-600" />}
            </button>
          ))}
        </div>

        {/* Dynamic Form Area */}
        <div className="flex-1">
          <motion.form 
            key={activeSettingsTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSettingsSave}
            className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-100 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50" />

            <div className="relative z-10 space-y-10">
              <header className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 capitalize mb-2">{activeSettingsTab} Settings</h3>
                  <p className="text-slate-400 font-medium">Update your store's {activeSettingsTab} configuration</p>
                </div>
                {saveSuccess && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-bold border border-emerald-100"
                  >
                    <CheckCircle size={18} />
                    Saved
                  </motion.div>
                )}
              </header>

              <div className="space-y-8">
                {activeSettingsTab === 'general' && (
                  <>
                    <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Store Name</label>
                        <input 
                          type="text" 
                          value={formData.storeName}
                          onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-3xl p-5 focus:ring-2 focus:ring-indigo-600 font-black text-slate-800 text-lg transition-all" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contact Email</label>
                        <input type="email" defaultValue="admin@pos.com" className="w-full bg-slate-50 border-none rounded-3xl p-5 focus:ring-2 focus:ring-indigo-600 font-black text-slate-800 text-lg" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                          <input 
                            type="text" 
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-3xl p-5 focus:ring-2 focus:ring-indigo-600 font-black text-slate-800 text-lg" 
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tax Rate (%)</label>
                          <input 
                            type="number" 
                            value={formData.taxRate}
                            onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                            className="w-full bg-slate-50 border-none rounded-3xl p-5 focus:ring-2 focus:ring-indigo-600 font-black text-slate-800 text-lg" 
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeSettingsTab === 'region' && (
                  <div className="grid grid-cols-1 gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Currency Symbol</label>
                        <select 
                          value={formData.currency}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-3xl p-5 focus:ring-2 focus:ring-indigo-600 font-black text-slate-800 text-lg"
                        >
                          <option value="$">USD ($)</option>
                          <option value="£">GBP (£)</option>
                          <option value="€">EUR (€)</option>
                          <option value="¥">JPY (¥)</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Timezone</label>
                        <select 
                          value={formData.timezone}
                          onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-3xl p-5 focus:ring-2 focus:ring-indigo-600 font-black text-slate-800 text-lg"
                        >
                          <option>UTC -5 (EST)</option>
                          <option>UTC +0 (GMT)</option>
                          <option>UTC +1 (CET)</option>
                          <option>UTC +8 (CST)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Language</label>
                      <select 
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-3xl p-5 focus:ring-2 focus:ring-indigo-600 font-black text-slate-800 text-lg"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'notifications' && (
                  <div className="space-y-4">
                    {[
                      { id: 'orderAlerts', label: 'Push Notifications', desc: 'Alert when new orders are placed', icon: Zap },
                      { id: 'stockAlerts', label: 'Inventory Alerts', desc: 'Notify when products are low on stock', icon: Package },
                      { id: 'dailyReports', label: 'Daily Analytics', desc: 'Send automated EOD performance reports', icon: BarChart3 },
                    ].map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => setFormData({ ...formData, [item.id]: !((formData as any)[item.id]) })}
                        className={`flex items-center gap-6 p-6 rounded-[32px] cursor-pointer transition-all border-2 ${
                          (formData as any)[item.id] ? 'bg-indigo-50 border-indigo-100' : 'bg-transparent border-slate-50'
                        }`}
                      >
                        <div className={`p-4 rounded-2xl ${(formData as any)[item.id] ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <item.icon size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-slate-900 uppercase tracking-widest text-sm">{item.label}</p>
                          <p className="text-slate-400 font-medium text-xs">{item.desc}</p>
                        </div>
                        <div className={`w-14 h-8 rounded-full p-1 transition-all ${(formData as any)[item.id] ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                          <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${(formData as any)[item.id] ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSettingsTab === 'security' && (
                  <div className="space-y-8">
                    <div 
                      onClick={() => setFormData({ ...formData, twoFactorAuth: !formData.twoFactorAuth })}
                      className={`flex items-center gap-6 p-8 rounded-[40px] cursor-pointer transition-all border-2 ${
                        formData.twoFactorAuth ? 'bg-emerald-50 border-emerald-100' : 'bg-transparent border-slate-50'
                      }`}
                    >
                      <div className={`p-4 rounded-2xl ${formData.twoFactorAuth ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <ShieldCheck size={32} />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-900 uppercase tracking-widest text-lg">Two-Factor Authentication</p>
                        <p className="text-slate-400 font-medium">Add an extra layer of security to your admin account</p>
                      </div>
                      <div className={`w-14 h-8 rounded-full p-1 transition-all ${formData.twoFactorAuth ? 'bg-emerald-600' : 'bg-slate-200'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${formData.twoFactorAuth ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                          <Clock size={14} />
                          Session Timeout
                        </label>
                        <select 
                          value={formData.sessionTimeout}
                          onChange={(e) => setFormData({ ...formData, sessionTimeout: Number(e.target.value) })}
                          className="w-full bg-slate-50 border-none rounded-3xl p-5 focus:ring-2 focus:ring-indigo-600 font-black text-slate-800 text-lg"
                        >
                          <option value={15}>15 Minutes</option>
                          <option value={30}>30 Minutes</option>
                          <option value={60}>1 Hour</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                          <Lock size={14} />
                          Admin PIN
                        </label>
                        <button type="button" className="w-full bg-slate-900 text-white rounded-3xl p-5 font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200">
                          Change Security PIN
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-10 border-t flex items-center gap-4">
                <button 
                  type="submit"
                  className="bg-slate-900 text-white px-12 py-5 rounded-[24px] font-black text-xl flex items-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-[0.98]"
                >
                  <Save size={24} />
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData(settings)}
                  className="px-8 py-5 rounded-[24px] font-black text-slate-400 hover:text-slate-600 transition-all"
                >
                  Reset Changes
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    );
  };

  const renderReports = () => {
    const revenueByMethod = orders.reduce((acc: any, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + order.total;
      return acc;
    }, {});

    return (
      <div className="space-y-6 lg:space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Object.entries(revenueByMethod).map(([method, amount]: any) => (
            <div key={method} className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[40px] shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-4 lg:mb-6">
                <div className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-opacity-10 ${
                  method === 'Card' ? 'bg-blue-500 text-blue-600' : 
                  method === 'Cash' ? 'bg-emerald-500 text-emerald-600' : 'bg-purple-500 text-purple-600'
                }`}>
                  {method === 'Card' ? <CreditCard size={24} lg:size={32} /> : 
                   method === 'Cash' ? <Banknote size={24} lg:size={32} /> : <Smartphone size={24} lg:size={32} />}
                </div>
                <span className="text-lg lg:text-xl font-black text-slate-900">{method}</span>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] lg:text-xs mb-1 lg:mb-2">Total Revenue</p>
              <h4 className="text-2xl lg:text-4xl font-black text-slate-900">{settings.currency}{amount.toFixed(2)}</h4>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 lg:p-12 rounded-3xl lg:rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-6 lg:mb-8 tracking-tight">Sales Distribution</h3>
          <div className="h-[300px] lg:h-[400px] w-full bg-slate-50 rounded-2xl lg:rounded-[30px] flex items-end justify-around p-4 lg:p-10 gap-2 lg:gap-8">
            {[65, 45, 85, 30, 95, 55, 75].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 lg:gap-4 h-full justify-end">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  className="w-full bg-indigo-600 rounded-lg lg:rounded-2xl shadow-lg shadow-indigo-100 relative group"
                >
                  <div className="absolute -top-10 lg:-top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 lg:px-3 py-1 rounded-lg text-[10px] lg:text-xs font-black opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-10">
                    {settings.currency}{(height * 100).toLocaleString()}
                  </div>
                </motion.div>
                <span className="text-slate-400 font-bold text-[10px] lg:text-sm">D{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden font-sans relative">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white p-6 flex justify-between items-center shadow-sm z-30">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl"
        >
          <Menu size={28} />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl">
            <ChefHat className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-slate-900 tracking-tight">{settings.storeName}</span>
        </div>
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center font-black text-indigo-600">
          {currentUser?.name[0]}
        </div>
      </div>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <>
            {/* Backdrop for mobile */}
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
              />
            )}
            <motion.div 
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className={`
                fixed lg:relative inset-y-0 left-0 w-80 bg-white border-r flex flex-col p-8 z-50 shadow-xl lg:shadow-none transition-all
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              `}
            >
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg">
                  <ChefHat className="text-white w-8 h-8" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight truncate">{settings.storeName}</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Admin Portal</p>
                </div>
              </div>

              <nav className="flex-1 space-y-2">
                {[
                  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                  { id: 'inventory', icon: Package, label: 'Inventory' },
                  { id: 'staff', icon: Users, label: 'Staff' },
                  { id: 'reports', icon: TrendingUp, label: 'Reports' },
                  { id: 'settings', icon: SettingsIcon, label: 'Settings' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id as View);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl font-bold transition-all ${
                      activeView === item.id 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    }`}
                  >
                    <item.icon size={24} />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="pt-8 border-t space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center font-black text-indigo-600 shrink-0">
                    {currentUser?.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{currentUser?.name}</p>
                    <p className="text-slate-400 text-xs font-medium">Administrator</p>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-rose-500 hover:bg-rose-50 font-bold transition-all"
                >
                  <LogOut size={24} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-6 lg:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2 capitalize">{activeView}</h1>
            <p className="text-slate-500 font-medium text-sm lg:text-base">
              {activeView === 'dashboard' && 'Real-time performance overview'}
              {activeView === 'inventory' && 'Manage your products and stock levels'}
              {activeView === 'staff' && 'Monitor staff performance and status'}
              {activeView === 'reports' && 'Deep dive into your business metrics'}
              {activeView === 'settings' && 'Configure your website and preferences'}
            </p>
          </div>
          <div className="flex items-center gap-3 lg:gap-4 w-full md:w-auto">
            {/* Calendar and Filter removed */}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 lg:px-10 pb-6 lg:pb-10 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'dashboard' && renderDashboard()}
              {activeView === 'inventory' && renderInventory()}
              {activeView === 'staff' && renderStaff()}
              {activeView === 'reports' && renderReports()}
              {activeView === 'settings' && renderSettings()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
