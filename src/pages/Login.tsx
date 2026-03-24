import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Role } from '../types';
import { ChefHat, LayoutDashboard, ChevronRight, Store, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [role, setRole] = useState<Role>('staff');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentUser, settings, staff, fetchData } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (staff.length === 0) {
      fetchData();
    }
  }, [staff, fetchData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Find matching staff/manager from the server-synced list
    // In a real app, this would be a proper backend auth call
    const matchedUser = staff.find(s => s.role === role);
    
    setTimeout(() => {
      if (matchedUser) {
        const user = {
          id: matchedUser.id,
          name: matchedUser.name,
          role: matchedUser.role,
        };
        setCurrentUser(user);
        setIsLoading(false);
        navigate('/');
      } else {
        // Fallback for safety
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          name: role === 'manager' ? 'Admin Manager' : 'Staff Member',
          role,
        };
        setCurrentUser(user);
        setIsLoading(false);
        navigate('/');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden flex-col justify-between p-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <ChefHat className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">{settings.storeName}</h1>
          </div>
          <h2 className="text-6xl font-black text-white leading-tight mb-6">
            The next generation <br /> 
            <span className="text-indigo-200 text-5xl">of business management.</span>
          </h2>
          <p className="text-indigo-100 text-xl font-medium max-w-md">
            Streamline your operations with the most elegant and powerful point of sale software ever created.
          </p>
        </motion.div>

        <div className="relative z-10 flex gap-12">
          <div>
            <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-2">Fast Checkout</p>
            <p className="text-white text-lg font-bold">2.4s Average</p>
          </div>
          <div>
            <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-2">Secure Payments</p>
            <p className="text-white text-lg font-bold">AES-256 Encrypted</p>
          </div>
          <div>
            <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-2">Real-time Analytics</p>
            <p className="text-white text-lg font-bold">Live Updates</p>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -ml-48 -mb-48" />
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Welcome Back</h3>
            <p className="text-slate-500 text-lg font-medium">Please select your role and enter your pin.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('staff')}
                className={`p-6 rounded-[32px] border-2 transition-all flex flex-col gap-4 text-left ${
                  role === 'staff' 
                    ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50' 
                    : 'border-slate-200 bg-transparent hover:border-slate-300 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${role === 'staff' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  <ChefHat size={24} />
                </div>
                <div>
                  <p className={`font-bold ${role === 'staff' ? 'text-slate-900' : 'text-slate-500'}`}>Staff</p>
                  <p className="text-xs text-slate-400 font-medium">Access terminal</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('manager')}
                className={`p-6 rounded-[32px] border-2 transition-all flex flex-col gap-4 text-left ${
                  role === 'manager' 
                    ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50' 
                    : 'border-slate-200 bg-transparent hover:border-slate-300 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${role === 'manager' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  <LayoutDashboard size={24} />
                </div>
                <div>
                  <p className={`font-bold ${role === 'manager' ? 'text-slate-900' : 'text-slate-500'}`}>Manager</p>
                  <p className="text-xs text-slate-400 font-medium">Admin portal</p>
                </div>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Security Pin</label>
                <span className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">Forgot pin?</span>
              </div>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Shield size={22} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter 4-digit code"
                  className="w-full pl-16 pr-6 py-6 bg-white border-2 border-slate-200 rounded-[24px] focus:border-indigo-600 focus:ring-0 transition-all text-xl tracking-[0.5em] font-black placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-slate-900 text-white rounded-[24px] font-black text-xl shadow-2xl shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Continue to {role === 'manager' ? 'Portal' : 'Terminal'}
                  <ChevronRight size={24} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center text-slate-400 font-medium text-sm">
            <div className="flex items-center gap-2">
              <Store size={16} />
              <span>Terminal ID: POS-01</span>
            </div>
            <span>v2.4.0</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
