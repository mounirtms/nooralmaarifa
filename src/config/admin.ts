// Centralized admin authorization.
// The admin list is driven by VITE_ADMIN_EMAILS (comma-separated). All checks
// must go through isAdminEmail() so the source of truth lives in one place.
const DEFAULT_ADMIN_EMAILS = 'mounir.webdev.tms@gmail.com';

const buildAdminEmails = (): string[] => {
  const raw = import.meta.env.VITE_ADMIN_EMAILS || DEFAULT_ADMIN_EMAILS;
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

const adminEmails = buildAdminEmails();

export const getAdminEmails = (): string[] => [...adminEmails];

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return adminEmails.includes(normalized);
};

export const isAdminUser = (user?: { email?: string | null } | null): boolean => {
  return isAdminEmail(user?.email);
};
