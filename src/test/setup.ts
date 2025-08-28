import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
const mockFirebase = {
  initializeApp: vi.fn(),
  getAuth: vi.fn(() => ({
    currentUser: null,
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  })),
  getFirestore: vi.fn(() => ({
    collection: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
  })),
  getStorage: vi.fn(() => ({
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
    deleteObject: vi.fn(),
  })),
};

vi.mock('firebase/app', () => mockFirebase);
vi.mock('firebase/auth', () => mockFirebase);
vi.mock('firebase/firestore', () => mockFirebase);
vi.mock('firebase/storage', () => mockFirebase);

// Mock intersection observer
Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  value: class MockIntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [0];
    
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  },
});

// Mock ResizeObserver
Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  value: class MockResizeObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = vi.fn();