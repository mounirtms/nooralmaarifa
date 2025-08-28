import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import type { FirebaseConfig } from '@/types';

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyC9t6N8_ZhRKZ1UVegEVTt9DuQAlvYf-Vs",
  authDomain: "noor-al-maarifa.firebaseapp.com",
  projectId: "noor-al-maarifa",
  storageBucket: "noor-al-maarifa.firebasestorage.app",
  messagingSenderId: "808435107960",
  appId: "1:808435107960:web:7f1713ebcb667bd9b2c58d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;