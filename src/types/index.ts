// Global type definitions for Noor Al Maarifa Trading website

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read' | 'replied' | 'resolved';
  adminNotes?: string;
  followUpDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  description?: string;
  category: 'products' | 'office' | 'events' | 'showcases';
  uploadedAt: string;
  uploadedBy: string;
  order: number;
  tags?: string[];
  featured?: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  images: string[];
  featured: boolean;
  inStock: boolean;
  brand?: string;
  specifications?: Record<string, string>;
}

export interface PageContent {
  id: string;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

export interface GalleryContextType {
  images: GalleryImage[];
  loading: boolean;
  uploadImage: (file: File, metadata: Partial<GalleryImage>) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  updateImage: (id: string, updates: Partial<GalleryImage>) => Promise<void>;
  fetchImages: () => Promise<void>;
}

export interface ContactContextType {
  messages: ContactMessage[];
  loading: boolean;
  submitMessage: (message: Omit<ContactMessage, 'id' | 'timestamp' | 'status'>) => Promise<void>;
  updateMessageStatus: (id: string, status: ContactMessage['status'], adminNotes?: string) => Promise<void>;
  setFollowUpDate: (id: string, date: string) => Promise<void>;
  fetchMessages: () => Promise<void>;
}

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  label: string;
  labelAr: string;
  showInNav: boolean;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

// Utility types
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Firebase related types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Animation and UI types
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
}

export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

// Form validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

export interface FormField {
  name: string;
  label: string;
  labelAr: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'file';
  validation?: ValidationRule;
  placeholder?: string;
  placeholderAr?: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// SEO and meta types
export interface SEOConfig {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  keywords: string[];
  image?: string;
  url?: string;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}