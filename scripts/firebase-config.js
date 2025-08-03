// Firebase Configuration
// Replace with your Firebase project configuration
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, listAll } from 'firebase/storage';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Contact Form Handler with Firebase
export async function submitContactForm(formData) {
    try {
        const docRef = await addDoc(collection(db, 'contacts'), {
            ...formData,
            timestamp: serverTimestamp(),
            status: 'new'
        });
        
        console.log('Message sent with ID: ', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error sending message: ', error);
        return { success: false, error: error.message };
    }
}

// Gallery Image Loader from Firebase Storage
export async function loadGalleryImages() {
    try {
        const galleryRef = ref(storage, 'gallery/');
        const result = await listAll(galleryRef);
        
        const imagePromises = result.items.map(async (imageRef) => {
            const url = await getDownloadURL(imageRef);
            return {
                name: imageRef.name,
                url: url,
                ref: imageRef
            };
        });
        
        const images = await Promise.all(imagePromises);
        return { success: true, images };
    } catch (error) {
        console.error('Error loading gallery images: ', error);
        return { success: false, error: error.message };
    }
}

// Get all contact messages (for admin panel)
export async function getContactMessages() {
    try {
        const querySnapshot = await getDocs(collection(db, 'contacts'));
        const messages = [];
        
        querySnapshot.forEach((doc) => {
            messages.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return { success: true, messages };
    } catch (error) {
        console.error('Error fetching messages: ', error);
        return { success: false, error: error.message };
    }
}
