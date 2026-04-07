import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, updateBalance } = useAuth();
  
  const load = (key, defaultVal) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultVal;
  };

  const [cart, setCart] = useState(() => load('diamond_cart', []));
  const [purchasedTickets, setPurchasedTickets] = useState(() => load('diamond_purchased_tickets', []));
  const [declaredResults, setDeclaredResults] = useState(() => load('diamond_results', []));
  const [notifications, setNotifications] = useState(() => load('diamond_notifications', [
    { id: 1, title: 'Welcome!', message: 'Start your lottery journey today.', time: 'Just now', read: false, type: 'info' }
  ]));

  const lastProcessedResultId = useRef(load('diamond_last_processed_id', null));

  useEffect(() => { localStorage.setItem('diamond_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('diamond_purchased_tickets', JSON.stringify(purchasedTickets)); }, [purchasedTickets]);
  useEffect(() => { localStorage.setItem('diamond_results', JSON.stringify(declaredResults)); }, [declaredResults]);
  useEffect(() => { localStorage.setItem('diamond_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('diamond_last_processed_id', JSON.stringify(lastProcessedResultId.current)); }, [declaredResults]);

  // --- 🛰️ THE REVOLUTIONARY SYNC ENGINE (Multi-Port Winner Logic) 🛰️ ---
  const processDrawResults = useCallback((results) => {
    if (!results || results.length === 0) return;
    
    const latestResult = results[0]; // Assuming newest is first
    if (latestResult.id === lastProcessedResultId.current) return; // Already paid

    const { digits, prizes, draw, brand } = latestResult;
    let userWon = false;
    let totalWinAmount = 0;

    const combinations = {
      '1D_A': digits.A, '1D_B': digits.B, '1D_C': digits.C,
      '2D_AB': `${digits.A}${digits.B}`, '2D_BC': `${digits.B}${digits.C}`, '2D_AC': `${digits.A}${digits.C}`,
      '3D_ABC': `${digits.A}${digits.B}${digits.C}`,
      '4D_XABC': `${digits.X}${digits.A}${digits.B}${digits.C}`
    };

    const updatedTickets = purchasedTickets.map(ticket => {
      // Only process tickets for THIS draw that are still 'Active'
      if (!ticket.title.includes(draw) || ticket.status !== 'Active') return ticket;

      let isWinner = false;
      let wonPrize = 0;
      const tNum = String(ticket.num);
      
      if (ticket.type === '1D') {
        if (tNum === combinations[`1D_${ticket.pos}`]) { isWinner = true; wonPrize = parseFloat(prizes['1D'][ticket.pos]); }
      } else if (ticket.type.includes('2D')) {
        if (tNum === combinations[`2D_${ticket.pos}`]) { isWinner = true; wonPrize = parseFloat(prizes['2D'][ticket.pos]); }
      } else if (ticket.type === '3D') {
        if (tNum === combinations['3D_ABC']) { isWinner = true; wonPrize = parseFloat(prizes['3D'].ABC); }
      } else if (ticket.type === '4D') {
        if (tNum === combinations['4D_XABC']) { isWinner = true; wonPrize = parseFloat(prizes['4D'].XABC); }
      }

      if (isWinner) {
        const payout = wonPrize * ticket.qty;
        userWon = true;
        totalWinAmount += payout;
        return { ...ticket, status: 'Won', prize: `₹ ${payout.toLocaleString()}` };
      }
      return { ...ticket, status: 'Closed' };
    });

    if (userWon) {
       updateBalance(totalWinAmount);
       addNotification({
         title: '🏆 YOU WON!',
         message: `Draw Result: ${latestResult.number}. You earned ₹ ${totalWinAmount.toLocaleString()}!`,
         type: 'win'
       });
    } else {
       addNotification({
         title: 'Draw Result Out',
         message: `${brand} ${draw}: ${latestResult.number}. Better luck next time!`,
         type: 'result'
       });
    }

    setPurchasedTickets(updatedTickets);
    lastProcessedResultId.current = latestResult.id;
  }, [purchasedTickets, updateBalance]);

  // --- CROSS-TAB LISTENER ---
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'diamond_results') {
        const results = JSON.parse(e.newValue);
        setDeclaredResults(results);
        processDrawResults(results); // Trigger win logic on the USER tab
      }
      if (e.key === 'diamond_purchased_tickets') setPurchasedTickets(JSON.parse(e.newValue));
      if (e.key === 'diamond_notifications') setNotifications(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [processDrawResults]);

  const addToCart = (entry) => setCart((prev) => [...prev, { ...entry, id: Date.now() }]);
  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  const confirmPurchase = () => {
    if (cart.length === 0) return;
    const txId = `TX${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const newPurchases = cart.map(item => ({
      ...item,
      purchaseId: txId,
      purchaseDate: now.toLocaleDateString(),
      purchaseTime: now.toLocaleTimeString(),
      status: 'Active',
      prize: '-'
    }));
    setPurchasedTickets((prev) => [...newPurchases, ...prev]);
    clearCart();
    addNotification({ title: 'Confirmation', message: `Receipt ${txId} generated successfully.`, type: 'success' });
  };

  const addNotification = (notif) => {
    const n = { ...notif, id: Date.now(), time: 'Just now', read: false };
    setNotifications(prev => [n, ...prev]);
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const addResult = (data) => {
    const fullNum = `${data.digits.X}${data.digits.A}${data.digits.B}${data.digits.C}`;
    const entry = { ...data, id: Date.now(), date: new Date().toLocaleDateString(), number: fullNum };
    
    // 1. Update Global State (which will trigger 'storage' events for other tabs)
    setDeclaredResults(prev => {
       const newList = [entry, ...prev];
       // 2. We ALSO process it in the CURRENT tab (Admin tab) in case they have a combined view
       processDrawResults(newList); 
       return newList;
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, confirmPurchase,
      cartTotal, purchasedTickets, declaredResults, addResult,
      notifications, markAllRead, addNotification
    }}>
      {children}
    </CartContext.Provider>
  );
};
