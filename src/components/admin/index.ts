// Admin Components Exports
export { AdminLogin } from './AdminLogin';
export { ProtectedRoute } from './ProtectedRoute';

// Admin Types
export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  lastLoginAt: string;
}

export interface AdminSession {
  user: AdminUser;
  expiresAt: number;
  permissions: string[];
}

// Admin Utilities
export const ADMIN_EMAILS = [
  'admin@nooralmaarifa.com',
  'sales@nooralmaarifa.com',
  'info@nooralmaarifa.com'
];

export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export const validateAdminAccess = (user: any): boolean => {
  return user && (user.isAdmin || isAdminEmail(user.email));
};