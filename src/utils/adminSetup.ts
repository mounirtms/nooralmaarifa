import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Utility function to grant admin access to a user
 * Call this from browser console: window.grantAdminAccess('user-uid')
 */
export const grantAdminAccess = async (uid: string) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      isAdmin: true,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log('✅ Admin access granted to user:', uid);
    return true;
  } catch (error) {
    console.error('❌ Failed to grant admin access:', error);
    return false;
  }
};

/**
 * Check current user admin status
 */
export const checkAdminStatus = (user: any) => {
  console.log('👤 Current user:', {
    uid: user?.uid,
    email: user?.email,
    isAdmin: user?.isAdmin
  });
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).grantAdminAccess = grantAdminAccess;
  (window as any).checkAdminStatus = checkAdminStatus;
}