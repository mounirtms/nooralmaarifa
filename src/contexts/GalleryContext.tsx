import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import type { GalleryImage } from '@/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Define fallback images
const fallbackImages = [
  '/images/products (1).jpeg',
  '/images/products (2).jpeg',
  '/images/products (3).jpeg',
  '/images/products (4).jpeg',
  '/images/products (5).jpeg',
  '/images/products (6).jpeg',
  '/images/products (7).jpeg',
  '/images/products (8).jpeg',
  '/images/products (9).jpeg',
  '/images/products (10).jpeg',
  '/images/products (11).jpeg',
  '/images/products (12).jpeg',
  '/images/products (13).jpeg',
  '/images/products (14).jpeg'
];

const GalleryContext = createContext<any | undefined>(undefined);

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

interface GalleryProviderProps {
  children: React.ReactNode;
}

export const GalleryProvider: React.FC<GalleryProviderProps> = ({ children }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchImages = async (): Promise<void> => {
    try {
      setLoading(true);
      const q = query(collection(db, 'gallery'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const imageList: GalleryImage[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const imageData = doc.data() as GalleryImage;
        imageList.push({
          ...imageData,
          id: doc.id
        });
      });
      
      setImages(imageList);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load gallery images');
      
      // If Firebase fetch fails, use fallback images
      const fallbackImageList: GalleryImage[] = fallbackImages.map((url, index) => ({
        id: `fallback-${index}`,
        url: url,
        title: `Product Image ${index + 1}`,
        category: 'products',
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'system',
        order: index
      }));
      
      setImages(fallbackImageList);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, metadata: Partial<GalleryImage>): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to upload images');
    }

    try {
      setLoading(true);
      
      // Create unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      
      // Upload to Firebase Storage
      const imageRef = ref(storage, `gallery/${filename}`);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Create thumbnail URL (you might want to implement actual thumbnail generation)
      const thumbnailUrl = downloadURL; // For now, use the same URL
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, 'gallery'), {
        url: downloadURL,
        thumbnailUrl,
        ...metadata,
        uploadedAt: serverTimestamp(),
        uploadedBy: user.uid,
        order: images.length
      });
      
      // Update local state
      setImages(prev => [
        ...prev,
        {
          id: docRef.id,
          url: downloadURL,
          thumbnailUrl,
          ...metadata,
          uploadedAt: new Date().toISOString(),
          uploadedBy: user.uid,
          order: prev.length
        } as GalleryImage
      ]);
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to delete images');
    }

    try {
      setLoading(true);
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'gallery', id));
      
      // Update local state
      setImages(prev => prev.filter(img => img.id !== id));
      
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateImage = async (id: string, updates: Partial<GalleryImage>): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to update images');
    }

    try {
      setLoading(true);
      
      // Update in Firestore
      const imageRef = doc(db, 'gallery', id);
      await updateDoc(imageRef, updates);
      
      // Update local state
      setImages(prev => 
        prev.map(img => img.id === id ? { ...img, ...updates } as GalleryImage : img)
      );
      
      toast.success('Image updated successfully');
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Failed to update image');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const value = {
    images,
    loading,
    uploadImage,
    deleteImage,
    updateImage,
    fetchImages,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};