import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLogin } from './AdminLogin';
import { PageLoadingSpinner } from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, loading, isAdmin } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return <PageLoadingSpinner />;
  }

  // If no user is logged in, show admin login
  if (!user) {
    return <AdminLogin />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          padding: '3rem',
          borderRadius: '16px',
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(239, 68, 68, 0.3)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            <i className="fas fa-shield-alt"></i>
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Access Denied
          </h1>
          <p style={{ marginBottom: '0.5rem', opacity: 0.9 }}>
            You don't have administrator privileges to access this section.
          </p>
          <p style={{ 
            fontFamily: "'Noto Sans Arabic', sans-serif", 
            direction: 'rtl',
            opacity: 0.8,
            fontSize: '0.9rem'
          }}>
            ليس لديك صلاحيات المدير للوصول إلى هذا القسم
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;