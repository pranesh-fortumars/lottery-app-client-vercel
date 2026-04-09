import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  updateDoc,
  doc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';

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
  const [cart, setCart] = useState([]);
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const [declaredResults, setDeclaredResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const lastProcessedResultId = useRef(null);

  // --- 🔥 FIREBASE SUBSCRIPTIONS 🔥 ---
  
  // 1. Subscribe to Tickets (Admin Sees All, User Sees Own)
  useEffect(() => {
    if (!user) {
      setPurchasedTickets([]);
      return;
    }
    
    let q;
    if (user.role === 'admin') {
      q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
    } else {
      q = query(
        collection(db, 'tickets'), 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPurchasedTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);


  // 2. Subscribe to Global Results
  useEffect(() => {
    const q = query(collection(db, 'results'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeclaredResults(results);
      if (user && results.length > 0) processDrawResults(results);
    });
    return () => unsubscribe();
  }, [user]);

  // 3. Subscribe to Notifications
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const q = query(
      collection(db, 'notifications'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  // --- 🛰️ THE REVOLUTIONARY SYNC ENGINE 🛰️ ---
  const processDrawResults = useCallback(async (results) => {
    if (!results || results.length === 0 || !user) return;
    
    // Get results that haven't been processed yet locally
    const latestResult = results[0];
    if (latestResult.id === lastProcessedResultId.current) return;

    const { digits, prizes, draw, brand } = latestResult;
    let totalWinAmount = 0;
    let winningTicketsFound = [];

    const combinations = {
      '1D_A': digits.A, '1D_B': digits.B, '1D_C': digits.C,
      '2D_AB': `${digits.A}${digits.B}`, '2D_BC': `${digits.B}${digits.C}`, '2D_AC': `${digits.A}${digits.C}`,
      '3D_ABC': `${digits.A}${digits.B}${digits.C}`,
      '4D_XABC': `${digits.X}${digits.A}${digits.B}${digits.C}`
    };

    const batch = writeBatch(db);

    purchasedTickets.forEach(ticket => {
      if (!ticket.title.includes(draw) || ticket.status !== 'Active') return;

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

      const ticketRef = doc(db, 'tickets', ticket.id);
      if (isWinner) {
        const payout = wonPrize * ticket.qty;
        totalWinAmount += payout;
        winningTicketsFound.push(ticket);
        batch.update(ticketRef, { status: 'Won', prize: `₹ ${payout.toLocaleString()}` });
      } else {
        batch.update(ticketRef, { status: 'Closed' });
      }
    });

    if (totalWinAmount > 0) {
       await updateBalance(totalWinAmount);
       addNotification({
         title: '🏆 YOU WON!',
         message: `Draw Result: ${latestResult.number}. You earned ₹ ${totalWinAmount.toLocaleString()}!`,
         type: 'win'
       });
       await batch.commit();
    } else if (winningTicketsFound.length === 0 && purchasedTickets.some(t => t.title.includes(draw) && t.status === 'Active')) {
        // Only notify if user had active tickets in this draw
        addNotification({
          title: 'Draw Result Out',
          message: `${brand} ${draw}: ${latestResult.number}. Better luck next time!`,
          type: 'result'
        });
        await batch.commit();
    }

    lastProcessedResultId.current = latestResult.id;
  }, [purchasedTickets, user, updateBalance]);

  const addToCart = (entry) => setCart((prev) => [...prev, { ...entry, id: Date.now() }]);
  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  const confirmPurchase = async () => {
    if (cart.length === 0 || !user) return;
    const txId = `TX${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    
    try {
      for (const item of cart) {
        await addDoc(collection(db, 'tickets'), {
          ...item,
          userId: user.uid,
          purchaseId: txId,
          purchaseDate: now.toLocaleDateString(),
          purchaseTime: now.toLocaleTimeString(),
          status: 'Active',
          prize: '-',
          createdAt: serverTimestamp()
        });
      }
      clearCart();
      addNotification({ title: 'Confirmation', message: `Receipt ${txId} generated successfully.`, type: 'success' });
    } catch (error) {
      console.error("Purchase error:", error);
    }
  };

  const addNotification = async (notif) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notif,
        userId: user.uid,
        time: 'Just now',
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Add notification error:", error);
    }
  };

  const markAllRead = async () => {
    if (!user) return;
    const batch = writeBatch(db);
    notifications.forEach(n => {
      if (!n.read) {
        const nRef = doc(db, 'notifications', n.id);
        batch.update(nRef, { read: true });
      }
    });
    await batch.commit();
  };

  const addResult = async (data) => {
    const fullNum = `${data.digits.X}${data.digits.A}${data.digits.B}${data.digits.C}`;
    const entry = { 
      ...data, 
      date: new Date().toLocaleDateString(), 
      number: fullNum,
      createdAt: serverTimestamp() 
    };
    
    try {
      await addDoc(collection(db, 'results'), entry);
    } catch (error) {
      console.error("Add result error:", error);
    }
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

