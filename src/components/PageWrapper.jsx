import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Gavel, ScrollText, ShoppingCart, User, Download, CircleUserRound } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = ({ title = "DIAMOND AGENCY" }) => {
  const navigate = useNavigate();
  return (
    <header className="main-header" style={{ height: '60px', background: 'var(--nav-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 15px', color: 'white', boxShadown: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <HomeIcon size={24} onClick={() => navigate('/home')} className="cursor-pointer" />
        <h1 style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '0.5px', textTransform: 'uppercase', fontStyle: 'italic', margin: 0 }}>{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Download size={24} className="cursor-pointer" />
        <NavLink to="/profile" style={{ color: 'white' }}>
          <User size={26} />
        </NavLink>
      </div>
    </header>
  );
};

export const BottomNav = () => {
  return (
    <div style={{ position: 'fixed', bottom: 0, width: '100%', maxWidth: '480px', zIndex: 1000 }}>
      {/* Footer Prize Agency Bar */}
      <div style={{ backgroundColor: '#ff2056', color: 'white', padding: '12px 0', textAlign: 'center', fontWeight: '900', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
        INDIA'S LARGEST PRIZES AGENCY
      </div>
      
      {/* Icon Navigation Bar */}
      <nav style={{ height: '55px', backgroundColor: '#ff2056', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <NavLink to="/home" style={({ isActive }) => ({ color: 'white', opacity: isActive ? 1 : 0.8 })}>
          <HomeIcon size={28} />
        </NavLink>
        <NavLink to="/rules" style={({ isActive }) => ({ color: 'white', opacity: isActive ? 1 : 0.8 })}>
          <Gavel size={28} />
        </NavLink>
        <NavLink to="/results" style={({ isActive }) => ({ color: 'white', opacity: isActive ? 1 : 0.8 })}>
          <ScrollText size={28} />
        </NavLink>
        <NavLink to="/cart" style={({ isActive }) => ({ color: 'white', opacity: isActive ? 1 : 0.8 })}>
          <ShoppingCart size={28} />
        </NavLink>
      </nav>
    </div>
  );
};

const PageWrapper = ({ children, title, showNav = true }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      id="page-root"
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#ffffff' }}
    >
      <Header title={title} />
      <div style={{ flex: 1, paddingBottom: showNav ? '120px' : '0' }}>
        {children}
      </div>
      {showNav && <BottomNav />}
    </motion.div>
  );
};

export default PageWrapper;
