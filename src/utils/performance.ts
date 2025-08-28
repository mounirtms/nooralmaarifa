import { lazy, ComponentType, LazyExoticComponent } from 'react';

// Performance monitoring utilities
export const performanceLogger = {
  markStart: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-start`);
    }
  },
  
  markEnd: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-end`);
      window.performance.measure(name, `${name}-start`, `${name}-end`);
    }
  },
  
  logMeasures: () => {
    if (typeof window !== 'undefined' && window.performance) {
      const measures = window.performance.getEntriesByType('measure');
      console.table(measures.map(m => ({
        name: m.name,
        duration: `${m.duration.toFixed(2)}ms`,
        startTime: `${m.startTime.toFixed(2)}ms`
      })));
    }
  }
};

// Image optimization utilities
export const imageOptimization = {
  // Create optimized image URL with WebP fallback
  createOptimizedImageUrl: (src: string, width?: number, height?: number): string => {
    if (!src) return '';
    
    // For local images, apply size parameters
    if (src.startsWith('/') || src.startsWith('./')) {
      const params = new URLSearchParams();
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      params.append('f', 'webp');
      params.append('q', '85'); // Quality
      
      return `${src}${params.toString() ? '?' + params.toString() : ''}`;
    }
    
    return src;
  },
  
  // Preload critical images
  preloadImages: (urls: string[]) => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  },
  
  // Lazy load images with Intersection Observer
  lazyLoadImage: (img: HTMLImageElement, src: string) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLImageElement;
          target.src = src;
          target.classList.add('loaded');
          observer.unobserve(target);
        }
      });
    }, { rootMargin: '50px' });
    
    observer.observe(img);
  }
};

// Bundle optimization
export const bundleOptimization = {
  // Dynamic imports with error handling
  importWithRetry: async <T>(
    importFn: () => Promise<T>,
    retries: number = 3
  ): Promise<T> => {
    try {
      return await importFn();
    } catch (error) {
      if (retries > 0) {
        console.warn(`Import failed, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return bundleOptimization.importWithRetry(importFn, retries - 1);
      }
      throw error;
    }
  },
  
  // Preload critical chunks
  preloadCriticalChunks: () => {
    // Preload critical routes
    const criticalRoutes = [
      () => import('../pages/HomePage'),
      () => import('../pages/ContactPage'),
      () => import('../components/layout/Header'),
      () => import('../components/layout/Footer')
    ];
    
    criticalRoutes.forEach(route => {
      bundleOptimization.importWithRetry(route).catch(console.warn);
    });
  }
};

// Memory optimization
export const memoryOptimization = {
  // Cleanup unused resources
  cleanup: () => {
    // Clear performance entries
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.clearMarks();
      window.performance.clearMeasures();
    }
    
    // Force garbage collection if available (dev only)
    if (process.env.NODE_ENV === 'development' && (window as any).gc) {
      (window as any).gc();
    }
  },
  
  // Monitor memory usage
  monitorMemory: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  }
};

// Network optimization
export const networkOptimization = {
  // Prefetch critical resources
  prefetchResources: (urls: string[]) => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  },
  
  // Check connection quality
  getConnectionInfo: () => {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData
      };
    }
    return null;
  },
  
  // Adaptive loading based on connection
  shouldLoadHighQuality: (): boolean => {
    const conn = networkOptimization.getConnectionInfo();
    if (!conn) return true; // Default to high quality if no info
    
    return !conn.saveData && 
           conn.effectiveType !== 'slow-2g' && 
           conn.effectiveType !== '2g';
  }
};

// React performance optimizations
export const reactOptimizations = {
  // Enhanced lazy loading with error boundaries
  createLazyComponent: <T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    displayName?: string
  ): LazyExoticComponent<T> => {
    const LazyComponent = lazy(async () => {
      performanceLogger.markStart(`lazy-${displayName || 'component'}`);
      try {
        const module = await bundleOptimization.importWithRetry(importFn);
        performanceLogger.markEnd(`lazy-${displayName || 'component'}`);
        return module;
      } catch (error) {
        console.error(`Failed to load component ${displayName}:`, error);
        throw error;
      }
    });
    
    LazyComponent.displayName = `Lazy(${displayName || 'Component'})`;
    return LazyComponent;
  },
  
  // Memoization helpers
  createMemoizedComponent: <P extends object>(
    Component: ComponentType<P>,
    areEqual?: (prevProps: P, nextProps: P) => boolean
  ) => {
    const MemoComponent = React.memo(Component, areEqual);
    MemoComponent.displayName = `Memo(${Component.displayName || Component.name})`;
    return MemoComponent;
  }
};

// Performance monitoring and reporting
export const performanceMonitor = {
  // Web Vitals monitoring
  observeWebVitals: () => {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        console.log('LCP:', lcp.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });
      
      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let cls = 0;
        list.getEntries().forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        });
        console.log('CLS:', cls);
      }).observe({ entryTypes: ['layout-shift'] });
    }
  },
  
  // Performance report
  generateReport: () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const memory = memoryOptimization.monitorMemory();
    const connection = networkOptimization.getConnectionInfo();
    
    return {
      navigation: {
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
        load: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
        dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
        tcp: Math.round(navigation.connectEnd - navigation.connectStart),
        ttfb: Math.round(navigation.responseStart - navigation.requestStart)
      },
      memory,
      connection,
      timestamp: new Date().toISOString()
    };
  }
};

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  if (typeof window !== 'undefined') {
    // Start monitoring web vitals
    performanceMonitor.observeWebVitals();
    
    // Preload critical chunks after initial load
    setTimeout(() => {
      bundleOptimization.preloadCriticalChunks();
    }, 2000);
    
    // Schedule cleanup
    setTimeout(() => {
      memoryOptimization.cleanup();
    }, 30000);
    
    // Log performance report in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        console.log('Performance Report:', performanceMonitor.generateReport());
        performanceLogger.logMeasures();
      }, 5000);
    }
  }
};