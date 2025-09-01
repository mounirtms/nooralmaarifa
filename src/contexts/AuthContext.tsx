import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import type { User, AuthContextType } from '@/types';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (firebaseUser: FirebaseUser): Promise<User> => {
    try {
      console.log('🔍 Fetching user data for:', firebaseUser.email);
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();
      console.log('📄 User document data:', userData);
      
      const adminEmails = [
        'admin@nooralmaarifa.com',
        'sales@nooralmaarifa.com',
        'info@nooralmaarifa.com',
        'mounir@nooralmaarifa.com'
        // Add your email here temporarily if needed:
        // 'your-email@example.com'
      ];
      
      const emailMatch = adminEmails.includes(firebaseUser.email || '');
      const docAdmin = userData?.isAdmin || false;
      const newIsAdmin = emailMatch || docAdmin;
      
      console.log('🔐 Admin check:', {
        email: firebaseUser.email,
        emailMatch,
        docAdmin,
        finalIsAdmin: newIsAdmin,
        adminEmails
      });
      
      setIsAdmin(newIsAdmin);
      
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || userData?.displayName || 'Admin User',
        photoURL: firebaseUser.photoURL || userData?.photoURL || '',
        isAdmin: newIsAdmin,
        createdAt: userData?.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      
      const adminEmails = [
        'admin@nooralmaarifa.com',
        'sales@nooralmaarifa.com',
        'info@nooralmaarifa.com',
        'mounir@nooralmaarifa.com'
      ];
      const newIsAdmin = adminEmails.includes(firebaseUser.email || '');
      console.log('🔐 Fallback admin check:', {
        email: firebaseUser.email,
        isAdmin: newIsAdmin,
        adminEmails
      });
      setIsAdmin(newIsAdmin);
      
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'Admin User',
        photoURL: firebaseUser.photoURL || '',
        isAdmin: newIsAdmin,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await fetchUserData(userCredential.user);
      setUser(userData);
      toast.success('Successfully signed in!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAdmin(false);
      toast.success('Successfully signed out!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          const userData = await fetchUserData(firebaseUser);
          setUser(userData);
          console.log('✅ User data set:', userData);
        } catch (error) {
          console.error('❌ Error setting user data:', error);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        console.log('👤 No user, clearing state');
        setUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};