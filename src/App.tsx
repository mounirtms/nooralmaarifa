import { useEffect } from 'react';
import { AppRouter } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { GalleryProvider } from './contexts/GalleryContext';
import { ContactProvider } from './contexts/ContactContext';
import { ContentProvider } from './contexts/ContentContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { preloadCritical } from './utils/preloader';
import { updatePageSEO, businessStructuredData } from './utils/seo';
import { initializePerformanceMonitoring } from './utils/performance';

function App() {
  useEffect(() => {
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // Initialize SEO
    updatePageSEO({
      structuredData: businessStructuredData
    });
    
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
            <ContentProvider>
              <AppRouter />
            </ContentProvider>
          </ContactProvider>
        </GalleryProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;