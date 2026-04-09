import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDspQUM5ih87vrKeVXGkFqi1YypHlbcZlM",
  authDomain: "lottery-application-136.firebaseapp.com",
  databaseURL: "https://lottery-application-136-default-rtdb.firebaseio.com",
  projectId: "lottery-application-136",
  storageBucket: "lottery-application-136.firebasestorage.app",
  messagingSenderId: "1040005504976",
  appId: "1:1040005504976:web:94290a16e22610a0ece3d5",
  measurementId: "G-KMCWVS30BJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, auth, db, analytics };
