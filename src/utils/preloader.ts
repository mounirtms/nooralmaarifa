// Preloader utility for lazy-loaded components
export class ComponentPreloader {
  private static preloadedComponents = new Set<string>();
  private static preloadPromises = new Map<string, Promise<any>>();

  // Preload a component by its import function
  static async preload(
    key: string,
    importFn: () => Promise<any>
  ): Promise<void> {
    if (this.preloadedComponents.has(key)) {
      return;
    }

    if (this.preloadPromises.has(key)) {
      return this.preloadPromises.get(key);
    }

    const promise = importFn()
      .then((module) => {
        this.preloadedComponents.add(key);
        this.preloadPromises.delete(key);
        return module;
      })
      .catch((error) => {
        console.warn(`Failed to preload component ${key}:`, error);
        this.preloadPromises.delete(key);
        throw error;
      });

    this.preloadPromises.set(key, promise);
    return promise;
  }

  // Preload multiple components
  static async preloadMultiple(
    components: Array<{
      key: string;
      importFn: () => Promise<any>;
    }>
  ): Promise<void> {
    const promises = components.map(({ key, importFn }) =>
      this.preload(key, importFn)
    );

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.warn('Some components failed to preload:', error);
    }
  }

  // Check if a component is preloaded
  static isPreloaded(key: string): boolean {
    return this.preloadedComponents.has(key);
  }

  // Clear preload cache
  static clearCache(): void {
    this.preloadedComponents.clear();
    this.preloadPromises.clear();
  }
}

// Predefined preload configurations
export const PRELOAD_CONFIGS = {
  // Critical pages that should be preloaded on app start
  critical: [
    {
      key: 'HomePage',
      importFn: () => import('../pages/HomePage'),
    },
  ],
  
  // Admin components that should be preloaded when user is authenticated as admin
  admin: [
    {
      key: 'AdminPage',
      importFn: () => import('../pages/AdminPage'),
    },
  ],
  
  // Heavy components that should be preloaded on user interaction
  heavy: [
    {
      key: 'GalleryPage',
      importFn: () => import('../pages/GalleryPage'),
    },
  ],
};

// Utility functions for common preload scenarios
export const preloadCritical = () => 
  ComponentPreloader.preloadMultiple(PRELOAD_CONFIGS.critical);

export const preloadAdmin = () => 
  ComponentPreloader.preloadMultiple(PRELOAD_CONFIGS.admin);

export const preloadHeavy = () => 
  ComponentPreloader.preloadMultiple(PRELOAD_CONFIGS.heavy);

// Preload on hover/focus for better UX
export const preloadOnInteraction = (
  element: HTMLElement,
  key: string,
  importFn: () => Promise<any>
) => {
  let preloaded = false;

  const preload = () => {
    if (!preloaded) {
      preloaded = true;
      ComponentPreloader.preload(key, importFn);
    }
  };

  element.addEventListener('mouseenter', preload, { once: true });
  element.addEventListener('focus', preload, { once: true });
  element.addEventListener('touchstart', preload, { once: true });

  return () => {
    element.removeEventListener('mouseenter', preload);
    element.removeEventListener('focus', preload);
    element.removeEventListener('touchstart', preload);
  };
};