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
  writeBatch,
  increment
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

  // --- Subscriptions ---
  useEffect(() => {
    if (!user) {
      setPurchasedTickets([]);
      setNotifications([]);
      setLoading(false);
      return;
    }

    // Combined Subscription for Tickets and Notifications to avoid multiple listeners
    const unsubscribeTickets = onSnapshot(collection(db, 'tickets'), (snapshot) => {
      const allTickets = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const userTickets = allTickets.filter(t => t.userId === user.uid);
      const sortedTickets = [...userTickets].sort((a, b) => {
        const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : Date.now();
        const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : Date.now();
        return timeB - timeA;
      });
      setPurchasedTickets(sortedTickets);
    });

    const unsubscribeResults = onSnapshot(collection(db, 'results'), (snapshot) => {
      const results = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const sortedResults = results.sort((a, b) => {
        const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : Date.now();
        const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : Date.now();
        return timeB - timeA;
      });
      setDeclaredResults(sortedResults);
    });

    const unsubscribeNotifs = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      const allNotifs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const userNotifs = allNotifs.filter(n => n.userId === user.uid);
      const sortedNotifs = userNotifs.sort((a, b) => {
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
    
    // 📣 1. BROADCAST LATEST ANNOUNCEMENT
    const latestResult = declaredResults[0];
    if (latestResult.digits && latestResult.number) {
      setLastAnnouncement({
        message: `RESULT DECLARED: ${latestResult.brand} (${latestResult.draw})`,
        ticker: `WINNING NUMBER FOR ${latestResult.draw}: ${latestResult.number}`,
        draw: latestResult.draw,
        number: latestResult.number
      });
    }

    // 💰 2. SCAN & PROCESS UNPROCESSED PAYOUTS
    const processAudit = async () => {
      if (!user?.uid || declaredResults.length === 0 || purchasedTickets.length === 0) return;

      const currentResults = [...declaredResults];
      const activeUserTickets = purchasedTickets.filter(t => t && t.userId === user.uid && t.status === 'Active');

      if (activeUserTickets.length === 0) return;

      console.log(`[AUDIT] Scanning ${activeUserTickets.length} active tickets.`);

      for (const res of currentResults) {
        if (!res?.id || !res?.digits) continue;
        
        const resDraw = String(res.draw || "").trim();
        const resultTickets = activeUserTickets.filter(t => String(t.draw || "").trim() === resDraw);

        if (resultTickets.length === 0) continue;

        const winningCombos = {
          '1D_A': String(res.digits.A || ''), '1D_B': String(res.digits.B || ''), '1D_C': String(res.digits.C || ''),
          '2D_AB': `${res.digits.A || ''}${res.digits.B || ''}`, 
          '2D_BC': `${res.digits.B || ''}${res.digits.C || ''}`, 
          '2D_AC': `${res.digits.A || ''}${res.digits.C || ''}`,
          '3D_ABC': `${res.digits.A || ''}${res.digits.B || ''}${res.digits.C || ''}`,
          '4D_XABC': `${res.digits.X || ''}${res.digits.A || ''}${res.digits.B || ''}${res.digits.C || ''}`
        };

        const batch = writeBatch(db);
        let winInThisResult = 0;
        let anyChanges = false;

        resultTickets.forEach(ticket => {
          if (!ticket.id) return;
          try {
            const lookupKey = `${ticket.type}_${ticket.pos}`;
            const targetNum = String(winningCombos[lookupKey] || '');
            const isWinner = String(ticket.num || '') === targetNum;
            
            console.log(`[CHECK] Draw ${resDraw} | Ticket ${ticket.num} vs ${targetNum} -> ${isWinner ? 'WON' : 'LOSE'}`);

            const ticketRef = doc(db, 'tickets', String(ticket.id));
            if (isWinner) {
              const baseP = res.prizes?.[ticket.type]?.[ticket.pos] || 0;
              const wAmt = Number(baseP) * Number(ticket.qty || 1);
              winInThisResult += wAmt;
              batch.update(ticketRef, { 
                status: 'Won', 
                prize: `₹ ${wAmt}`,
                payoutDate: serverTimestamp() 
              });
            } else {
              batch.update(ticketRef, { status: 'Closed', prize: '₹ 0' });
            }
            anyChanges = true;
          } catch (err) {
            console.error("Critical ticket audit error:", err, ticket);
          }
        });

        if (winInThisResult > 0) {
          const userRef = doc(db, 'users', String(user.uid));
          batch.update(userRef, { balance: increment(winInThisResult) });
          addNotification({ 
            userId: user.uid, 
            title: '🏆 WINNER!', 
            message: `Result for ${resDraw} out! ₹ ${winInThisResult} won!`, 
            type: 'win' 
          });
        }

        if (anyChanges) {
          try {
            await batch.commit();
            console.log(`✅ Success for Draw: ${resDraw}`);
            localStorage.setItem(`diamond_processed_${user.uid}_${res.id}`, 'true');
          } catch (e) {
            console.error(`❌ Commit failed for result ${res.id}`, e);
          }
        }
      }
    };
    processAudit();
  }, [declaredResults, purchasedTickets, user]);

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
      batch.update(userRef, { balance: increment(-totalCost) });

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
    const { X, A, B, C } = data.digits;
    const fullNum = `${X}${A}${B}${C}`;
    
    // Explicitly normalize everything to strings for the DB
    const normalizedDigits = {
      X: String(X),
      A: String(A),
      B: String(B),
      C: String(C)
    };

    await addDoc(collection(db, 'results'), {
      ...data,
      digits: normalizedDigits,
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

