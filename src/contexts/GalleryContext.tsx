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
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import type { GalleryImage, GalleryContextType } from '@/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

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
      querySnapshot.forEach((doc) => {
        imageList.push({ id: doc.id, ...doc.data() } as GalleryImage);
      });
      
      setImages(imageList);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load gallery images');
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
      
      // Save to Firestore
      const imageData = {
        url: downloadURL,
        thumbnailUrl,
        title: metadata.title || '',
        description: metadata.description || '',
        category: metadata.category || 'products',
        uploadedAt: serverTimestamp(),
        uploadedBy: user.uid,
        order: metadata.order || images.length,
        tags: metadata.tags || [],
        featured: metadata.featured || false,
      };
      
      await addDoc(collection(db, 'gallery'), imageData);
      
      // Refresh the images list
      await fetchImages();
      
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id: string): Promise<void> => {
    if (!user || !user.isAdmin) {
      throw new Error('Admin access required to delete images');
    }

    try {
      setLoading(true);
      
      const imageToDelete = images.find(img => img.id === id);
      if (!imageToDelete) {
        throw new Error('Image not found');
      }

      // Delete from Storage
      try {
        const imageRef = ref(storage, imageToDelete.url);
        await deleteObject(imageRef);
      } catch (storageError) {
        console.warn('Failed to delete from storage:', storageError);
        // Continue with Firestore deletion even if storage deletion fails
      }

      // Delete from Firestore
      await deleteDoc(doc(db, 'gallery', id));
      
      // Refresh the images list
      await fetchImages();
      
      toast.success('Image deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.error(error.message || 'Failed to delete image');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateImage = async (id: string, updates: Partial<GalleryImage>): Promise<void> => {
    if (!user || !user.isAdmin) {
      throw new Error('Admin access required to update images');
    }

    try {
      setLoading(true);
      
      const imageRef = doc(db, 'gallery', id);
      await updateDoc(imageRef, updates);
      
      // Refresh the images list
      await fetchImages();
      
      toast.success('Image updated successfully!');
    } catch (error: any) {
      console.error('Error updating image:', error);
      toast.error(error.message || 'Failed to update image');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const value: GalleryContextType = {
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