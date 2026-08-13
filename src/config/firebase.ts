import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import type { FirebaseConfig } from '@/types';

// Firebase configuration is driven by environment variables (VITE_FIREBASE_*),
// with the production values as a fallback for local development.
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC9t6N8_ZhRKZ1UVegEVTt9DuQAlvYf-Vs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "noor-al-maarifa.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "noor-al-maarifa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "noor-al-maarifa.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "808435107960",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:808435107960:web:7f1713ebcb667bd9b2c58d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;