import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  getDocs,
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
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const [declaredResults, setDeclaredResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const lastProcessedResultId = useRef(localStorage.getItem('diamond_last_processed_id'));

  // --- Subscriptions ---
  useEffect(() => {
    if (!user) {
      setPurchasedTickets([]);
      setNotifications([]);
      setLoading(false);
      return;
    }

    // Subscribe to Tickets - Use simple query to avoid index errors, sort on client
    const ticketsQuery = user.role === 'admin' 
      ? collection(db, 'tickets')
      : query(collection(db, 'tickets'), where('userId', '==', user.uid));

    const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort on client side to avoid needing composite indexes in Firestore
      // Handle null timestamps for newly created tickets (serverTimestamp() is null locally initially)
      const sortedTickets = [...tickets].sort((a, b) => {
        const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : Date.now();
        const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : Date.now();
        return timeB - timeA;
      });
      setPurchasedTickets(sortedTickets);
    }, (error) => {
      console.error("Tickets subscription error:", error);
    });

    // Subscribe to Results - Sort client-side
    const unsubscribeResults = onSnapshot(collection(db, 'results'), (snapshot) => {
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedResults = results.sort((a, b) => {
        const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : Date.now();
        const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : Date.now();
        return timeB - timeA;
      });
      setDeclaredResults(sortedResults);
    });

    // Subscribe to Notifications - Sort client-side
    const notificationsQuery = query(collection(db, 'notifications'), where('userId', '==', user.uid));
    const unsubscribeNotifs = onSnapshot(notificationsQuery, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedNotifs = notifs.sort((a, b) => {
        const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : Date.now();
        const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : Date.now();
        return timeB - timeA;
      });
      setNotifications(sortedNotifs);
    });

    setLoading(false);
    return () => {
      unsubscribeTickets();
      unsubscribeResults();
      unsubscribeNotifs();
    };
  }, [user]);

  const [lastAnnouncement, setLastAnnouncement] = useState(null);
  const ticketsRef = useRef([]);
  useEffect(() => { ticketsRef.current = purchasedTickets; }, [purchasedTickets]);

  // Sync Engine: Triggers Payouts and Announcements when new results arrive
  useEffect(() => {
    if (!declaredResults || declaredResults.length === 0 || !user) return;
    
    const latestResult = declaredResults[0];

    // 📣 GLOBAL ANNOUNCEMENT (Visible to Admin & User)
    setLastAnnouncement({
      message: `RESULT DECLARED: ${latestResult.brand} (${latestResult.draw})`,
      ticker: `WINNING NUMBER FOR ${latestResult.draw}: ${latestResult.number}`,
      draw: latestResult.draw,
      number: latestResult.number
    });
    // Clear after 45 seconds to ensure visibility
    const timer = setTimeout(() => setLastAnnouncement(null), 45000);

    // 💰 PAYOUT LOGIC (User Only)
    if (user.role === 'user' && latestResult.id !== lastProcessedResultId.current) {
      const runPayout = async () => {
        const { digits, prizes, draw } = latestResult;
        const winningCombos = {
          '1D_A': digits.A, '1D_B': digits.B, '1D_C': digits.C,
          '2D_AB': `${digits.A}${digits.B}`, '2D_BC': `${digits.B}${digits.C}`, '2D_AC': `${digits.A}${digits.C}`,
          '3D_ABC': `${digits.A}${digits.B}${digits.C}`,
          '4D_XABC': `${digits.X}${digits.A}${digits.B}${digits.C}`
        };

        // Matching precisely by draw slot
        const userTickets = ticketsRef.current.filter(t => t.draw === draw && t.status === 'Active' && t.userId === user.uid);
        if (userTickets.length === 0) {
          lastProcessedResultId.current = latestResult.id;
          localStorage.setItem('diamond_last_processed_id', latestResult.id);
          return;
        }

        const batch = writeBatch(db);
        let totalWin = 0;

        userTickets.forEach(ticket => {
          const ticketRef = doc(db, 'tickets', ticket.id);
          const prizeId = ticket.type === '1D' || ticket.type.includes('2D') ? `${ticket.type}_${ticket.pos}` : `${ticket.type}_${Object.keys(prizes[ticket.type])[0]}`;
          
          if (ticket.num === winningCombos[prizeId]) {
            const base = ticket.type === '1D' ? prizes['1D'][ticket.pos] : ticket.type.includes('2D') ? prizes['2D'][ticket.pos] : ticket.type === '3D' ? prizes['3D'].ABC : prizes['4D'].XABC;
            const won = parseFloat(base) * ticket.qty;
            totalWin += won;
            batch.update(ticketRef, { status: 'Won', prize: `₹ ${won.toLocaleString()}` });
          } else {
            batch.update(ticketRef, { status: 'Closed', prize: '₹ 0' });
          }
        });

        if (totalWin > 0) {
          batch.update(doc(db, 'users', user.uid), { balance: user.balance + totalWin });
          addNotification({ userId: user.uid, title: '🏆 JACKPOT WINNER!', message: `You won ₹ ${totalWin.toLocaleString()} in the ${draw} draw!`, type: 'win' });
        } else {
          addNotification({ userId: user.uid, title: 'Draw Finished 📑', message: `${draw} results are out. Better luck next time!`, type: 'info' });
        }

        try {
          await batch.commit();
          lastProcessedResultId.current = latestResult.id;
          localStorage.setItem('diamond_last_processed_id', latestResult.id);
        } catch (e) { console.error("Sync error:", e); }
      };
      runPayout();
    }

    return () => clearTimeout(timer);
  }, [declaredResults, user]);

  const addToCart = (entry) => setCart((prev) => [...prev, { ...entry, id: Date.now() }]);
  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  const confirmPurchase = async () => {
    if (cart.length === 0 || !user) return;
    
    const totalCost = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (user.balance < totalCost) {
      alert("Insufficient Balance!");
      return;
    }

    try {
      const txId = `TX${Math.floor(100000 + Math.random() * 900000)}`;
      const batch = writeBatch(db);

      const now = new Date();
      const purchaseDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '/');
      const purchaseTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      cart.forEach(item => {
        const ticketRef = doc(collection(db, 'tickets'));
        batch.set(ticketRef, {
          ...item,
          userId: user.uid,
          userName: user.name,
          purchaseId: txId,
          purchaseDate: purchaseDate,
          purchaseTime: purchaseTime,
          status: 'Active',
          prize: '-',
          timestamp: serverTimestamp()
        });
      });

      // Deduct balance
      const userRef = doc(db, 'users', user.uid);
      batch.update(userRef, { balance: user.balance - totalCost });

      await batch.commit();
      clearCart();
      addNotification({ 
        userId: user.uid,
        title: 'Confirmation', 
        message: `Receipt ${txId} generated successfully.`, 
        type: 'success' 
      });
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Transaction failed!");
    }
  };

  const addNotification = async (notif) => {
    await addDoc(collection(db, 'notifications'), {
      ...notif,
      timestamp: serverTimestamp(),
      read: false
    });
  };

  const markAllRead = async () => {
    if (!user) return;
    const batch = writeBatch(db);
    notifications.forEach(n => {
      if (!n.read) {
        batch.update(doc(db, 'notifications', n.id), { read: true });
      }
    });
    await batch.commit();
  };

  const addResult = async (data) => {
    const fullNum = `${data.digits.X}${data.digits.A}${data.digits.B}${data.digits.C}`;
    await addDoc(collection(db, 'results'), {
      ...data,
      number: fullNum,
      timestamp: serverTimestamp()
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const refreshTickets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const ticketsQuery = user.role === 'admin' 
        ? collection(db, 'tickets')
        : query(collection(db, 'tickets'), where('userId', '==', user.uid));
        
      const snapshot = await getDocs(ticketsQuery);
      const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedTickets = [...tickets].sort((a, b) => {
        const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : Date.now();
        const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : Date.now();
        return timeB - timeA;
      });
      setPurchasedTickets(sortedTickets);
    } catch (error) {
      console.error("Manual refresh error:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, confirmPurchase,
      cartTotal, purchasedTickets, declaredResults, addResult, lastAnnouncement,
      notifications, markAllRead, addNotification, loading, refreshTickets
    }}>
      {children}
    </CartContext.Provider>
  );
};

