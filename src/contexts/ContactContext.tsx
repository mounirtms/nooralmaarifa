import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { ContactMessage, ContactContextType } from '@/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const useContact = () => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};

interface ContactProviderProps {
  children: React.ReactNode;
}

export const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchMessages = async (): Promise<void> => {
    if (!user || !user.isAdmin) {
      return; // Only admins can fetch all messages
    }

    try {
      setLoading(true);
      const q = query(collection(db, 'contacts'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const messageList: ContactMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messageList.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.()?.toISOString() || data.timestamp,
        } as ContactMessage);
      });
      
      setMessages(messageList);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  const submitMessage = async (
    messageData: Omit<ContactMessage, 'id' | 'timestamp' | 'status'>
  ): Promise<void> => {
    try {
      setLoading(true);
      
      const contactData = {
        ...messageData,
        timestamp: serverTimestamp(),
        status: 'new' as const,
        priority: messageData.priority || 'medium' as const,
      };
      
      await addDoc(collection(db, 'contacts'), contactData);
      
      toast.success('Message sent successfully! We will get back to you soon.');
      
      // If user is admin, refresh the messages list
      if (user && user.isAdmin) {
        await fetchMessages();
      }
    } catch (error: any) {
      console.error('Error submitting message:', error);
      toast.error(error.message || 'Failed to send message');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (
    id: string,
    status: ContactMessage['status'],
    adminNotes?: string
  ): Promise<void> => {
    if (!user || !user.isAdmin) {
      throw new Error('Admin access required to update message status');
    }

    try {
      setLoading(true);
      
      const updates: Partial<ContactMessage> = {
        status,
        ...(adminNotes && { adminNotes }),
      };
      
      const messageRef = doc(db, 'contacts', id);
      await updateDoc(messageRef, updates);
      
      // Refresh the messages list
      await fetchMessages();
      
      toast.success('Message status updated successfully!');
    } catch (error: any) {
      console.error('Error updating message status:', error);
      toast.error(error.message || 'Failed to update message status');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setFollowUpDate = async (id: string, date: string): Promise<void> => {
    if (!user || !user.isAdmin) {
      throw new Error('Admin access required to set follow-up date');
    }

    try {
      setLoading(true);
      
      const messageRef = doc(db, 'contacts', id);
      await updateDoc(messageRef, { followUpDate: date });
      
      // Refresh the messages list
      await fetchMessages();
      
      toast.success('Follow-up date set successfully!');
    } catch (error: any) {
      console.error('Error setting follow-up date:', error);
      toast.error(error.message || 'Failed to set follow-up date');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch messages when user changes and is admin
  useEffect(() => {
    if (user && user.isAdmin) {
      fetchMessages();
    } else {
      setMessages([]); // Clear messages if not admin
    }
  }, [user]);

  const value: ContactContextType = {
    messages,
    loading,
    submitMessage,
    updateMessageStatus,
    setFollowUpDate,
    fetchMessages,
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};