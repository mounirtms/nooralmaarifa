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
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (firebaseUser: FirebaseUser): Promise<User> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();
      
      // List of authorized admin emails
      const adminEmails = [
        'admin@nooralmaarifa.com',
        'sales@nooralmaarifa.com',
        'info@nooralmaarifa.com'
      ];
      
      // Check if user is admin based on email and Firestore data
      const isAdmin = adminEmails.includes(firebaseUser.email || '') || userData?.isAdmin || false;
      
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || userData?.displayName || 'Admin User',
        photoURL: firebaseUser.photoURL || userData?.photoURL || '',
        isAdmin,
        createdAt: userData?.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Fallback admin check for authorized emails
      const adminEmails = [
        'admin@nooralmaarifa.com',
        'sales@nooralmaarifa.com',
        'info@nooralmaarifa.com'
      ];
      
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'Admin User',
        photoURL: firebaseUser.photoURL || '',
        isAdmin: adminEmails.includes(firebaseUser.email || ''),
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
        } catch (error) {
          console.error('Error setting user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
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
    isAdmin: user?.isAdmin || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};