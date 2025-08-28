import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { PageLoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Layout } from '../components/layout/Layout';
import { createLazyComponent } from '../components/common/LazyWrapper';
import { ProtectedRoute } from '../components/admin/ProtectedRoute';

// Lazy load page components for code splitting with error handling
const HomePage = createLazyComponent(() => import('../pages/HomePage'), 'HomePage');
const AboutPage = createLazyComponent(() => import('../pages/AboutPage'), 'AboutPage');
const ServicesPage = createLazyComponent(() => import('../pages/ServicesPage'), 'ServicesPage');
const ProductsPage = createLazyComponent(() => import('../pages/ProductsPage'), 'ProductsPage');
const GalleryPage = createLazyComponent(() => import('../pages/GalleryPage'), 'GalleryPage');
const ContactPage = createLazyComponent(() => import('../pages/ContactPage'), 'ContactPage');
const AdminPage = createLazyComponent(() => import('../pages/AdminPage'), 'AdminPage');

// Route definitions with TypeScript
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  label: string;
  labelAr: string;
  showInNav: boolean;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

// Router configuration with hash routing for single-page navigation
const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary><div>Something went wrong</div></ErrorBoundary>,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoadingSpinner />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoadingSpinner />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: 'services',
        element: (
          <Suspense fallback={<PageLoadingSpinner />}>
            <ServicesPage />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<PageLoadingSpinner />}>
            <ProductsPage />
          </Suspense>
        ),
      },
      {
        path: 'gallery',
        element: (
          <Suspense fallback={<PageLoadingSpinner />}>
            <GalleryPage />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoadingSpinner />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminPage />
          </Suspense>
        ),
      },
      {
        path: 'myadmin',
        element: (
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminPage />
          </Suspense>
        ),
      },
    ],
  },
]);

// Router provider component
export function AppRouter() {
  return <RouterProvider router={router} />;
}

// Navigation configuration for components (using lazy components)
export const navigationRoutes: RouteConfig[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoadingSpinner />}>
        <HomePage />
      </Suspense>
    ),
    label: 'Home',
    labelAr: 'الرئيسية',
    showInNav: true,
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<PageLoadingSpinner />}>
        <AboutPage />
      </Suspense>
    ),
    label: 'About',
    labelAr: 'عن الشركة',
    showInNav: true,
  },
  {
    path: '/services',
    element: (
      <Suspense fallback={<PageLoadingSpinner />}>
        <ServicesPage />
      </Suspense>
    ),
    label: 'Services',
    labelAr: 'خدماتنا',
    showInNav: true,
  },
  {
    path: '/products',
    element: (
      <Suspense fallback={<PageLoadingSpinner />}>
        <ProductsPage />
      </Suspense>
    ),
    label: 'Products',
    labelAr: 'المنتجات',
    showInNav: true,
  },
  {
    path: '/gallery',
    element: (
      <Suspense fallback={<PageLoadingSpinner />}>
        <GalleryPage />
      </Suspense>
    ),
    label: 'Gallery',
    labelAr: 'المعرض',
    showInNav: true,
  },
  {
    path: '/contact',
    element: (
      <Suspense fallback={<PageLoadingSpinner />}>
        <ContactPage />
      </Suspense>
    ),
    label: 'Contact',
    labelAr: 'اتصل بنا',
    showInNav: true,
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<PageLoadingSpinner />}>
        <AdminPage />
      </Suspense>
    ),
    label: 'Admin',
    labelAr: 'الإدارة',
    showInNav: false,
    requiresAuth: true,
    requiresAdmin: true,
  },
];

export default router;