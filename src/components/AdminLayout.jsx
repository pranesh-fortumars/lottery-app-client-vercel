import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  Settings2, 
  Users as UsersIcon, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Diamond
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
    { icon: Settings2, label: 'Control', path: '/admin/control' },
    { icon: UsersIcon, label: 'Users', path: '/admin/users' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const currentPage = menuItems.find(item => item.path === location.pathname)?.label || 'Admin';

  return (
    <div className="flex h-screen bg-[#f3f4f6] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-gradient-to-b from-[#f42464] to-[#ff004d] text-white shadow-2xl">
        <div className="p-8 flex items-center gap-3 border-b border-white/10">
          <div className="bg-white p-2 rounded-xl shadow-lg">
            <Diamond className="text-[#f42464]" size={28} fill="#f42464" />
          </div>
          <div>
            <h1 className="text-xl font-black font-condensed tracking-tighter uppercase leading-none">DIAMOND</h1>
            <p className="text-[10px] font-bold opacity-70 tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-grow p-4 mt-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold
                ${isActive 
                  ? 'bg-white text-[#f42464] shadow-xl scale-[1.02]' 
                  : 'hover:bg-white/10 text-white/80 hover:text-white'}
              `}
            >
              <item.icon size={22} />
              <span className="text-sm uppercase tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl hover:bg-white/10 transition-all font-bold text-white/80 hover:text-white uppercase text-sm tracking-wide"
          >
            <LogOut size={22} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 h-full bg-gradient-to-b from-[#f42464] to-[#ff004d] text-white shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl shadow-lg">
                    <Diamond className="text-[#f42464]" size={28} fill="#f42464" />
                  </div>
                  <h1 className="text-xl font-black font-condensed tracking-tighter uppercase leading-none">DIAMOND</h1>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="bg-white/10 p-2 rounded-xl">
                  <X size={24} />
                </button>
              </div>

              <nav className="p-4 mt-6 space-y-2">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold
                      ${isActive ? 'bg-white text-[#f42464] shadow-xl' : 'text-white/80'}
                    `}
                  >
                    <item.icon size={22} />
                    <span className="text-sm uppercase tracking-wide">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-6 lg:px-10 z-[1000] shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm"
            >
              <Menu size={24} className="text-[#f42464]" />
            </button>
            <h2 className="text-2xl font-black text-gray-800 font-condensed uppercase tracking-tighter">
              {currentPage}
            </h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-black text-gray-800 leading-none capitalize">Admin User</span>
                <span className="text-[10px] font-bold text-[#f42464] tracking-widest uppercase">Super Admin</span>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f42464] to-[#ff004d] flex items-center justify-center text-white font-black text-lg shadow-lg border-2 border-white ring-4 ring-[#f42464]/5">
                A
             </div>
          </div>
        </header>

        {/* Dynamic Content Scrollable Area */}
        <main className="flex-grow overflow-y-auto p-6 lg:p-10 bg-[#f9fafb]">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
