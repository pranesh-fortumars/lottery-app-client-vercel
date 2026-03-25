import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // --- Cart State ---
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('diamond_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // --- Purchased Tickets ---
  const [purchasedTickets, setPurchasedTickets] = useState(() => {
    const savedTickets = localStorage.getItem('diamond_purchased_tickets');
    return savedTickets ? JSON.parse(savedTickets) : [];
  });

  // --- Declared Results (1st, 2nd, 3rd Positions) ---
  const [declaredResults, setDeclaredResults] = useState(() => {
    const savedResults = localStorage.getItem('diamond_results');
    return savedResults ? JSON.parse(savedResults) : [];
  });

  useEffect(() => {
    localStorage.setItem('diamond_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('diamond_purchased_tickets', JSON.stringify(purchasedTickets));
  }, [purchasedTickets]);

  useEffect(() => {
    localStorage.setItem('diamond_results', JSON.stringify(declaredResults));
  }, [declaredResults]);

  const addToCart = (entry) => {
    setCart((prev) => [...prev, { ...entry, id: Date.now() }]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const confirmPurchase = () => {
    if (cart.length === 0) return;
    const timestamp = new Date().toLocaleString();
    const newPurchases = cart.map(item => ({
      ...item,
      purchaseId: `TX${Math.floor(1000 + Math.random() * 9000)}`,
      purchaseTime: timestamp,
      status: 'Active',
      prize: '-'
    }));
    setPurchasedTickets((prev) => [...newPurchases, ...prev]);
    clearCart();
  };

  const addResult = (resultData) => {
    // resultData: { draw, brand, winners: [], prizes: [] }
    // winners: [{ title: '1st Prize', number: '1234', amount: '50000' }, ...]
    const newResultEntry = {
      ...resultData,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      status: 'Active'
    };
    
    setDeclaredResults((prev) => [newResultEntry, ...prev]);

    // --- Winner Processing Logic ---
    const updatedTickets = purchasedTickets.map(ticket => {
      // Find matches for the current brand and draw time
      if (!ticket.title.includes(resultData.draw)) return ticket;

      // Find if ticket number matches any winning position
      const winningPosition = resultData.winPositions.find(pos => pos.number === ticket.num);
      
      if (winningPosition) {
        const prizeAmount = parseFloat(winningPosition.amount) * ticket.qty;
        
        // Add prize to user's virtual balance if it's their ticket
        // (In a real app, we'd check user identity here, but we'll assume current user)
        if (ticket.status !== 'Won' && user?.role === 'user') {
          updateBalance(prizeAmount);
        }

        return {
          ...ticket,
          status: 'Won',
          prize: `₹ ${prizeAmount.toLocaleString()}`
        };
      }
      
      return ticket;
    });

    setPurchasedTickets(updatedTickets);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      confirmPurchase,
      cartTotal,
      purchasedTickets,
      declaredResults,
      addResult
    }}>
      {children}
    </CartContext.Provider>
  );
};
