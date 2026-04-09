import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userData
          });
        } else {
          // If no doc exists (fallback), set basic user info
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'user',
            name: firebaseUser.displayName || 'User',
            balance: 0
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, additionalData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Save additional user data to Firestore
      const userData = {
        name: additionalData.name || '',
        mobile: additionalData.mobile || '',
        referral: additionalData.referral || '',
        role: 'user',
        balance: 1000, // Initial balance
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, message: error.message };
    }
  };

  const updateBalance = async (amount) => {
    if (!user) return;
    const newBalance = (user.balance || 0) + amount;
    const updatedUser = { ...user, balance: newBalance };
    
    try {
      await setDoc(doc(db, 'users', user.uid), { balance: newBalance }, { merge: true });
      setUser(updatedUser);
    } catch (error) {
      console.error("Update balance error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateBalance, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

