import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, ClipboardList, Trophy, ShoppingCart, User, ArrowLeft, LogOut, Download, Mail, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SelectionPage from './pages/SelectionPage';
import JackpotPage from './pages/JackpotPage';
import SignupPage from './pages/SignupPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Remaining Pages - We will create these shortly
const RulesPage = () => (
  <div className="app-content">
    <div style={{ padding: '15px' }}>
      <div style={{ backgroundColor: 'white', border: '2px solid var(--border-red)', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-header)', marginBottom: '15px', fontFamily: 'Bebas Neue', fontSize: '1.75rem' }}>RULES</h2>
        <div style={{ textAlign: 'left', fontSize: '1rem', lineHeight: '1.6' }}>
          <p>1. Select lottery category.</p>
          <p>2. Enter your lucky numbers.</p>
          <p>3. Choose Board (A, B, C or ALL).</p>
          <p>4. Add entries and checkout.</p>
          <p style={{ marginTop: '15px', fontWeight: 'bold', color: 'red' }}>Note: Booking closes 15 minutes before the result time.</p>
        </div>
      </div>
    </div>
  </div>
);

const ResultsPageItems = () => {
  const results = [
    { date: '16/03/2026', time: '08:00 PM', name: 'DEARLOT', nums: ['8', '4', '2'] },
    { date: '16/03/2026', time: '06:00 PM', name: 'DEARLOT', nums: ['9', '5', '3'] },
    { date: '16/03/2026', time: '03:00 PM', name: 'KERELALOT', nums: ['6', '6', '9', '7'] },
  ];

  return (
    <div className="app-content">
      <div style={{ color: 'red', fontWeight: 'bold', padding: '10px 15px' }}>👤 Guest()</div>
      {results.map((r, i) => (
        <table key={i} className="result-table">
          <tbody>
            <tr>
              <td className="result-label">Date</td>
              <td>{r.date}</td>
            </tr>
            <tr>
              <td className="result-label">Time</td>
              <td>{r.time}</td>
            </tr>
            <tr>
              <td className="result-label">Lot Name</td>
              <td>{r.name}</td>
            </tr>
            <tr>
              <td className="result-label">Result Number</td>
              <td>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {r.nums.map((n, j) => (
                    <span key={j} className="result-circle">{n}</span>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
};
const CartPage = () => (
  <div className="app-content">
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ marginBottom: '16px', color: 'var(--gray-dark)' }}>
        <ShoppingCart size={64} style={{ margin: '0 auto' }} />
      </div>
      <h2 style={{ marginBottom: '8px' }}>Your Cart is Empty</h2>
      <p style={{ color: 'var(--gray-dark)', marginBottom: '24px' }}>Looks like you haven't added any tickets yet.</p>
      <NavLink to="/home" className="btn-add" style={{ display: 'inline-block', textDecoration: 'none' }}>Start Playing</NavLink>
    </div>
  </div>
);
const ProfilePage = () => (
  <div className="app-content">
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#eee', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <User size={40} color="var(--gray-dark)" />
      </div>
      <h2 style={{ marginBottom: '4px' }}>Pranesh</h2>
      <p style={{ color: 'var(--gray-dark)', marginBottom: '24px' }}>+91 9876543210</p>
      <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #ddd' }} />
      <div style={{ textAlign: 'left' }}>
        <div style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
          <span>Transaction History</span>
          <ChevronRight size={20} />
        </div>
        <div style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
          <span>My Tickets</span>
          <ChevronRight size={20} />
        </div>
        <div style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'red' }}>
          <span>Logout</span>
          <LogOut size={20} />
        </div>
      </div>
    </div>
  </div>
);

import PageWrapper from './components/PageWrapper';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          <Route path="/home" element={
            <PageWrapper title="Diamond Agency">
              <Dashboard />
            </PageWrapper>
          } />
          
          <Route path="/rules" element={
            <PageWrapper title="RULES">
              <RulesPage />
            </PageWrapper>
          } />

          <Route path="/results" element={
            <PageWrapper title="DAILY RESULTS">
              <ResultsPageItems />
            </PageWrapper>
          } />

          <Route path="/cart" element={
            <PageWrapper title="My Cart">
              <CartPage />
            </PageWrapper>
          } />

          <Route path="/profile" element={
            <PageWrapper title="My Profile" showBack={true} showNav={false}>
              <ProfilePage />
            </PageWrapper>
          } />

          <Route path="/select/:gameId" element={<SelectionPage />} />
          <Route path="/jackpot" element={<JackpotPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
