import { useEffect } from 'react';
import { AppRouter } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { GalleryProvider } from './contexts/GalleryContext';
import { ContactProvider } from './contexts/ContactContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { preloadCritical } from './utils/preloader';

function App() {
  useEffect(() => {
    // Preload critical components after initial render
    const timer = setTimeout(() => {
      preloadCritical().catch(console.warn);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <GalleryProvider>
          <ContactProvider>
            <AppRouter />
          </ContactProvider>
        </GalleryProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;