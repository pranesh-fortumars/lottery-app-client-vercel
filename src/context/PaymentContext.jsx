import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [activePayment, setActivePayment] = useState(null);
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      upiId: 'smserode143-4@okicici',
      bankName: 'Canara Bank 3970',
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('upi://pay?pa=smserode143-4@okicici&pn=Admin&cu=INR')}`
    },
    {
      id: 2,
      upiId: '9842180627-2@ybl',
      bankName: 'PhonePe UPI',
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('upi://pay?pa=9842180627-2@ybl&pn=Admin&cu=INR')}`
    }
  ]);

  const calculateActiveAccount = () => {
    // Base date for rotation: 2024-01-01
    const baseDate = new Date('2024-01-01T00:00:00Z').getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - baseDate) / (1000 * 60 * 60 * 24));
    
    // Switch every 2 days
    const rotationIndex = Math.floor(diffDays / 2) % 2;
    return accounts[rotationIndex];
  };

  useEffect(() => {
    const updateActiveAccount = () => {
      setActivePayment(calculateActiveAccount());
    };

    updateActiveAccount();
    // Check every hour to see if rotation happened
    const interval = setInterval(updateActiveAccount, 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PaymentContext.Provider value={{ activePayment, accounts }}>
      {children}
    </PaymentContext.Provider>
  );
};
