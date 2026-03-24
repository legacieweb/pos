import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { PaymentMethod } from '../types';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  LogOut, 
  CreditCard, 
  History,
  ChefHat,
  Banknote,
  Smartphone,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const POS: React.FC = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    updateCartQuantity, 
    placeOrder, 
    currentUser, 
    logout,
    settings,
    fetchData,
    isOffline
  } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('Card');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCart, setShowCart] = useState(false); // For small screens cart visibility

  useEffect(() => {
    // Poll for updates (stock, settings)
    const interval = setInterval(() => {
      fetchData();
    }, isOffline ? 60000 : 15000);
    return () => clearInterval(interval);
  }, [fetchData, isOffline]);

  const handlePlaceOrder = () => {
    if (currentUser) {
      placeOrder(currentUser.id, selectedPayment);
      setShowPaymentModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const filteredProducts = products.filter(p => 
    (category === 'All' || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * (settings.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-100 font-sans overflow-hidden relative">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white p-4 flex justify-between items-center shadow-sm z-30">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-xl">
            <ChefHat className="text-white w-5 h-5" />
          </div>
          <span className="font-black text-slate-900 tracking-tight">{settings.storeName}</span>
        </div>
        <button 
          onClick={() => setShowCart(!showCart)}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl relative"
        >
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </button>
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
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
              className={`
                fixed lg:relative inset-y-0 left-0 w-24 bg-white border-r flex flex-col items-center py-8 gap-10 shadow-sm z-50 transition-all
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              `}
            >
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg mt-4 lg:mt-0">
                <ChefHat className="text-white w-8 h-8" />
              </div>
              <div className="flex flex-col gap-6 flex-1">
                <button className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <ShoppingCart size={24} />
                </button>
                <button className="p-4 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-2xl transition-all">
                  <History size={24} />
                </button>
              </div>
              <button 
                onClick={logout}
                className="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all mb-4 lg:mb-0"
              >
                <LogOut size={24} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 lg:p-8 overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="hidden md:block">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{settings.storeName}</h1>
            <p className="text-slate-500 font-medium">Welcome back, {currentUser?.name}</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all text-slate-600 font-medium"
            />
          </div>
        </header>

        {/* Categories Grid */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 lg:px-8 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                category === cat 
                  ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  onClick={() => addToCart(product)}
                  className="bg-white p-3 lg:p-4 rounded-2xl lg:rounded-3xl shadow-sm border border-slate-100 cursor-pointer group hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-full h-32 lg:h-44 rounded-xl lg:rounded-2xl mb-4 relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-indigo-600 text-[10px] lg:text-xs font-bold px-2 lg:px-3 py-1 rounded-full shadow-sm">
                      {product.category}
                    </div>
                  </div>
                  <h3 className="text-sm lg:text-lg font-bold text-slate-800 mb-1 px-1 line-clamp-1">{product.name}</h3>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-lg lg:text-xl font-black text-indigo-600">{settings.currency}{product.price.toFixed(2)}</span>
                    <div className="p-1.5 lg:p-2 bg-indigo-50 text-indigo-600 rounded-lg lg:rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Plus size={18} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cart/Checkout Panel */}
      <AnimatePresence>
        {(showCart || window.innerWidth >= 1024) && (
          <>
            {/* Backdrop for mobile */}
            {showCart && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCart(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
              />
            )}
            <motion.div 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className={`
                fixed lg:relative inset-y-0 right-0 w-full sm:w-[450px] bg-white border-l shadow-2xl flex flex-col p-6 lg:p-8 z-50 transition-all
                ${showCart ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              `}
            >
              <div className="flex justify-between items-center mb-8 lg:mb-10">
                <h2 className="text-xl lg:text-2xl font-bold text-slate-900 flex items-center gap-3">
                  Current Order
                  <span className="bg-indigo-100 text-indigo-600 text-sm font-black px-3 py-1 rounded-full">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => useStore.getState().clearCart()}
                    className="p-2 lg:p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-xl"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto mb-6 lg:mb-8 pr-2 scrollbar-hide space-y-4 lg:space-y-6">
                <AnimatePresence initial={false}>
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                      <ShoppingCart size={48} lg:size={64} strokeWidth={1} />
                      <p className="font-medium">Cart is empty</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 lg:gap-4 items-center"
                      >
                        <img src={item.image} className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl object-cover shrink-0 shadow-sm" alt={item.name} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm lg:text-base truncate">{item.name}</h4>
                          <p className="text-indigo-600 font-black text-sm lg:text-base">{settings.currency}{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2 lg:gap-3 bg-slate-50 p-1.5 lg:p-2 rounded-xl lg:rounded-2xl">
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 lg:w-8 lg:h-8 bg-white text-slate-600 rounded-lg lg:rounded-xl shadow-sm flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-black text-slate-800 w-5 lg:w-6 text-center text-sm lg:text-base">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 lg:w-8 lg:h-8 bg-white text-slate-600 rounded-lg lg:rounded-xl shadow-sm flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Totals & Checkout */}
              <div className="space-y-4 lg:space-y-6 bg-slate-50 p-6 lg:p-8 rounded-2xl lg:rounded-3xl">
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex justify-between text-slate-500 font-medium text-sm lg:text-base">
                    <span>Subtotal</span>
                    <span>{settings.currency}{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium text-sm lg:text-base">
                    <span>Tax ({settings.taxRate}%)</span>
                    <span>{settings.currency}{tax.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-slate-200 my-2 lg:my-4" />
                  <div className="flex justify-between text-xl lg:text-2xl font-black text-slate-900">
                    <span>Total</span>
                    <span>{settings.currency}{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={cart.length === 0}
                  className="w-full bg-emerald-600 text-white py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-3 text-base lg:text-lg"
                >
                  <CreditCard size={20} lg:size={24} />
                  Checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Selection Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[40px] shadow-2xl max-w-lg w-full mx-4"
            >
              <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-6 lg:mb-8 text-center">Select Payment</h3>
              <div className="grid grid-cols-1 gap-3 lg:gap-4 mb-6 lg:mb-8">
                {[
                  { id: 'Card', icon: CreditCard, label: 'Credit Card', color: 'text-blue-600 bg-blue-50' },
                  { id: 'Cash', icon: Banknote, label: 'Cash Payment', color: 'text-emerald-600 bg-emerald-50' },
                  { id: 'Mobile Pay', icon: Smartphone, label: 'Mobile Pay', color: 'text-purple-600 bg-purple-50' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id as PaymentMethod)}
                    className={`flex items-center gap-4 lg:gap-6 p-4 lg:p-6 rounded-2xl lg:rounded-3xl border-2 transition-all ${
                      selectedPayment === method.id 
                        ? 'border-indigo-600 bg-indigo-50/50 scale-[1.02]' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl ${method.color}`}>
                      <method.icon size={24} lg:size={32} />
                    </div>
                    <span className="text-lg lg:text-xl font-bold text-slate-800">{method.label}</span>
                    {selectedPayment === method.id && (
                      <div className="ml-auto w-6 h-6 lg:w-8 lg:h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Plus size={16} lg:size={20} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 lg:gap-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all text-sm lg:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-[2] py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-sm lg:text-base"
                >
                  Pay {settings.currency}{total.toFixed(2)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110]"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-sm w-full mx-4"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus size={48} className="rotate-45" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">Order Placed!</h3>
              <p className="text-slate-500 font-medium">Receipt printing automatically...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default POS;
