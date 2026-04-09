import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// Helper to convert Firestore timestamp to JS Date or string
const formatData = (doc) => {
  const data = doc.data();
  return { id: doc.id, ...data };
};

// --- USER OPERATIONS ---

export const streamUsers = (callback) => {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(formatData));
  });
};

export const updateUser = async (uid, data) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
};

// --- GAME OPERATIONS ---

export const streamGames = (callback) => {
  const q = collection(db, 'games');
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(formatData));
  });
};

export const updateGame = async (gameId, data) => {
  const gameRef = doc(db, 'games', gameId);
  await updateDoc(gameRef, data);
};

// --- TICKET OPERATIONS ---

export const buyTickets = async (userId, tickets) => {
  const ticketsBatch = tickets.map(ticket => ({
    userId,
    ...ticket,
    status: 'pending',
    purchaseDate: serverTimestamp()
  }));

  const results = [];
  for (const ticket of ticketsBatch) {
    const docRef = await addDoc(collection(db, 'tickets'), ticket);
    results.push(docRef.id);
  }
  return results;
};

export const streamUserTickets = (userId, callback) => {
  const q = query(
    collection(db, 'tickets'), 
    where('userId', '==', userId),
    orderBy('purchaseDate', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(formatData));
  });
};

// --- ANNOUNCEMENT OPERATIONS ---

export const streamAnnouncements = (callback) => {
  const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(formatData));
  });
};

export const addAnnouncement = async (data) => {
  await addDoc(collection(db, 'announcements'), {
    ...data,
    createdAt: serverTimestamp()
  });
};

// --- INITIAL SEED (Run once if needed) ---
export const seedInitialData = async () => {
  // Check if games exist
  const gamesSnap = await getDocs(collection(db, 'games'));
  if (gamesSnap.empty) {
    const initialGames = [
      { time: '01:00 PM', name: 'DEAR', type: 'dear', status: 'active' },
      { time: '06:00 PM', name: 'DEAR', type: 'dear', status: 'active' },
      { time: '08:00 PM', name: 'DEAR', type: 'dear', status: 'active' },
      { time: '03:00 PM', name: 'KERALA', type: 'kerala', status: 'active' }
    ];
    for (const game of initialGames) {
      await addDoc(collection(db, 'games'), game);
    }
    console.log("Initial games seeded");
  }
};
