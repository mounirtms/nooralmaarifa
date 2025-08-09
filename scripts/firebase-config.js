// Firebase Configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyC9t6N8_ZhRKZ1UVegEVTt9DuQAlvYf-Vs",
  authDomain: "noor-al-maarifa.firebaseapp.com",
  databaseURL: "https://noor-al-maarifa-default-rtdb.europe-west1.firebasedatabase.app",
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
const storage = firebase.storage();

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Admin emails (you can modify this list)
const ADMIN_EMAILS = [
  'nooralmaarifa22@gmail.com',
  'mounir.webdev.tms@gmail.com',
  'admin@tehno-dz.com'
  // Add more admin emails as needed
];

// Check if user is admin
function isAdmin(user) {
  // Allow localhost to assign admin role for testing purposes
  return user && (ADMIN_EMAILS.includes(user.email) || window.location.hostname === 'localhost');
}

// Export for use in other files
window.firebaseConfig = firebaseConfig;
window.db = db;
window.auth = auth;
window.storage = storage;
window.googleProvider = googleProvider;
window.isAdmin = isAdmin;
window.ADMIN_EMAILS = ADMIN_EMAILS;

// Set up auth state observer for fast loading
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? 'logged in' : 'logged out');

  // Update header auth elements based on user state (admin sign-in button removed from header)
  const userInfo = document.getElementById('userInfo');
  const userPhoto = document.getElementById('userPhoto');
  const userName = document.getElementById('userName');
  const dropdownUserPhoto = document.getElementById('dropdownUserPhoto');
  const dropdownUserName = document.getElementById('dropdownUserName');
  const dropdownUserEmail = document.getElementById('dropdownUserEmail');
  const dropdownAdminBadge = document.getElementById('dropdownAdminBadge');
  const adminPanelBtn = document.getElementById('adminPanelBtn');
  const adminSection = document.getElementById('adminSection');
  const adminLoginModal = document.getElementById('adminLoginModal');

  if (user) {
    // User is signed in - only show user info if admin
    console.log('User logged in:', user.email);

    // Check if user is admin
    if (isAdmin(user)) {
      console.log('User is admin');
      if (userInfo) userInfo.style.display = 'flex';
      if (userPhoto) userPhoto.src = user.photoURL || 'images/LOGOICON.png';
      if (userName) userName.textContent = user.displayName || user.email.split('@')[0];
      if (dropdownUserPhoto) dropdownUserPhoto.src = user.photoURL || 'images/LOGOICON.png';
      if (dropdownUserName) dropdownUserName.textContent = user.displayName || user.email.split('@')[0];
      if (dropdownUserEmail) dropdownUserEmail.textContent = user.email || '';
      if (dropdownAdminBadge) dropdownAdminBadge.style.display = 'inline-block';
      if (adminPanelBtn) adminPanelBtn.style.display = 'block';
      // Don't auto-show admin section, wait for user interaction
    } else {
      console.log('User is not admin');
      if (userInfo) userInfo.style.display = 'none';
      if (dropdownAdminBadge) dropdownAdminBadge.style.display = 'none';
      if (adminPanelBtn) adminPanelBtn.style.display = 'none';
      if (adminSection) adminSection.style.display = 'none';
    }

    // Close login modal if open
    if (adminLoginModal) adminLoginModal.style.display = 'none';
  } else {
    // User is signed out
    console.log('User signed out');
    if (userInfo) userInfo.style.display = 'none';
    if (dropdownAdminBadge) dropdownAdminBadge.style.display = 'none';
    if (adminPanelBtn) adminPanelBtn.style.display = 'none';
    if (adminSection) adminSection.style.display = 'none';
  }
});

// Handle dropdown functionality
document.addEventListener('DOMContentLoaded', () => {
  const userDropdownBtn = document.getElementById('userDropdownBtn');
  const userDropdownMenu = document.getElementById('userDropdownMenu');
  const headerSignOutBtn = document.getElementById('headerSignOutBtn');
  const adminPanelBtn = document.getElementById('adminPanelBtn');

  // Toggle dropdown
  if (userDropdownBtn) {
    userDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdownMenu.classList.toggle('show');
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (userDropdownMenu && !userDropdownMenu.contains(e.target) && !userDropdownBtn?.contains(e.target)) {
      userDropdownMenu.classList.remove('show');
    }
  });

  // Sign out handler
  if (headerSignOutBtn) {
    headerSignOutBtn.addEventListener('click', () => {
      auth.signOut().then(() => {
        userDropdownMenu.classList.remove('show');
        console.log('User signed out successfully');
      }).catch((error) => {
        console.error('Sign out error:', error);
      });
    });
  }

  // Admin panel toggle handler
  if (adminPanelBtn) {
    adminPanelBtn.addEventListener('click', () => {
      const adminSection = document.getElementById('adminSection');
      if (adminSection) {
        if (adminSection.style.display === 'none' || !adminSection.style.display) {
          adminSection.style.display = 'block';
          // Scroll to admin section
          adminSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          adminSection.style.display = 'none';
        }
      }
      userDropdownMenu.classList.remove('show');
    });
  }
});

