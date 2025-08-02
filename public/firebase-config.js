// Firebase Configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyC9t6N8_ZhRKZ1UVegEVTt9DuQAlvYf-Vs",
  authDomain: "noor-al-maarifa.firebaseapp.com",
  projectId: "noor-al-maarifa",
  storageBucket: "noor-al-maarifa.firebasestorage.app",
  messagingSenderId: "808435107960",
  appId: "1:808435107960:web:7f1713ebcb667bd9b2c58d",
  measurementId: "G-1CW76FPLGB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Export for use in other files
window.firebaseConfig = firebaseConfig;
window.db = db;
window.auth = auth;

