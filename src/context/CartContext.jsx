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

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('diamond_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [purchasedTickets, setPurchasedTickets] = useState(() => {
    const savedTickets = localStorage.getItem('diamond_purchased_tickets');
    return savedTickets ? JSON.parse(savedTickets) : [];
  });

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
    // resultData: { draw, brand, playType, drawName, winPositions, number }
    const newResultEntry = {
      ...resultData,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      status: 'Active'
    };
    
    setDeclaredResults((prev) => [newResultEntry, ...prev]);

    // --- High-Precision Winner Processing ---
    const updatedTickets = purchasedTickets.map(ticket => {
      // 1. Match Draw Time
      const timeMatch = ticket.title.includes(resultData.draw);
      
      // 2. Match Brand (Case Insensitive)
      const brandMatch = ticket.title.toUpperCase().includes(resultData.brand.toUpperCase());

      // 3. Match Play Type (1D, 2D, 3D, 4D)
      // Note: If ticket.playType is missing, we fallback to title matching for backward compatibility
      const ptMatch = ticket.playType 
        ? (ticket.playType === resultData.playType) 
        : ticket.title.includes(resultData.playType);

      if (timeMatch && brandMatch && ptMatch) {
         const winningPosition = resultData.winPositions.find(pos => pos.number === ticket.num);
         
         if (winningPosition) {
            const prizeAmount = parseFloat(winningPosition.amount) * ticket.qty;
            
            // Only update wallet if ticket not already processed
            if (ticket.status !== 'Won' && user?.role === 'user') {
               updateBalance(prizeAmount);
            }
            
            return {
               ...ticket,
               status: 'Won',
               prize: `₹ ${prizeAmount.toLocaleString()}`,
               winningPosition: winningPosition.position
            };
         }
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
