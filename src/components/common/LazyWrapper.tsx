import { Suspense, ComponentType, ReactNode, lazy } from 'react';
import { ComponentLoadingSpinner, PageLoadingSpinner } from './LoadingSpinner';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  type?: 'page' | 'component';
}

export function LazyWrapper({ 
  children, 
  fallback, 
  type = 'component' 
}: LazyWrapperProps) {
  const defaultFallback = type === 'page' 
    ? <PageLoadingSpinner /> 
    : <ComponentLoadingSpinner />;

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

// Higher-order component for creating lazy-loaded components
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode,
  type: 'page' | 'component' = 'component'
) {
  return function LazyLoadedComponent(props: P) {
    return (
      <LazyWrapper fallback={fallback} type={type}>
        <Component {...props} />
      </LazyWrapper>
    );
  };
}

// Utility function to create lazy components with proper error boundaries
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T } | { [key: string]: T }>,
  exportName?: string
) {
  return lazy(async () => {
    try {
      const module = await importFn();
      
      // Handle both default and named exports
      if (exportName && exportName in module) {
        return { default: (module as any)[exportName] };
      }
      
      // If it's already a default export
      if ('default' in module) {
        return module as { default: T };
      }
      
      // If it's a named export and no exportName provided, try to find the component
      const keys = Object.keys(module);
      const componentKey = keys.find(key => 
        typeof (module as any)[key] === 'function' && 
        key !== 'default'
      );
      
      if (componentKey) {
        return { default: (module as any)[componentKey] };
      }
      
      throw new Error('No valid component export found');
    } catch (error) {
      console.error('Error loading lazy component:', error);
      // Return a fallback component
      return {
        default: () => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Error loading component. Please refresh the page.</p>
          </div>
        )
      };
    }
  });
}