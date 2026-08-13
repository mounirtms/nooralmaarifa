// Admin Components Exports
export { AdminLogin } from './AdminLogin';
export { ProtectedRoute } from './ProtectedRoute';

// Admin authorization utilities (centralized in @/config/admin)
import { getAdminEmails, isAdminEmail, isAdminUser } from '@/config/admin';

export { getAdminEmails, isAdminEmail, isAdminUser };

export const ADMIN_EMAILS = getAdminEmails();

export const validateAdminAccess = (user: { email?: string | null; isAdmin?: boolean } | null): boolean => {
  return !!user && (user.isAdmin === true || isAdminEmail(user.email));
};
