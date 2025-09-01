import { useEffect } from 'react';
import { AppRouter } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { GalleryProvider } from './contexts/GalleryContext';
import { ContactProvider } from './contexts/ContactContext';
import { ContentProvider } from './contexts/ContentContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { preloadCritical } from './utils/preloader';
import { updatePageSEO, businessStructuredData } from './utils/seo';
import './utils/adminSetup'; // Import admin utilities for debugging
//import { initializePerformanceMonitoring } from './utils/performance';

function App() {
  useEffect(() => {
    // Initialize performance monitoring
    //initializePerformanceMonitoring();
    
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
      <ThemeProvider>
        <AuthProvider>
          <GalleryProvider>
            <ContactProvider>
              <ContentProvider>
                <AppRouter />
              </ContentProvider>
            </ContactProvider>
          </GalleryProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;