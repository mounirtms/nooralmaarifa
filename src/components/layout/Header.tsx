import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Header.module.css';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  path: string;
  label: string;
  labelAr: string;
  showInNav: boolean;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', labelAr: 'الرئيسية', showInNav: true },
  { path: '/about', label: 'About', labelAr: 'عن الشركة', showInNav: true },
  { path: '/services', label: 'Services', labelAr: 'خدماتنا', showInNav: true },
  { path: '/products', label: 'Products', labelAr: 'المنتجات', showInNav: true },
  { path: '/gallery', label: 'Gallery', labelAr: 'معرض الصور', showInNav: true },
  { path: '/contact', label: 'Contact', labelAr: 'تواصل', showInNav: true },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <nav className={styles.navbar}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <img 
              src="/images/LOGOICON.png" 
              alt="Noor Al Maarifa Trading" 
              className={styles.logoImg}
            />
            <span className={styles.logoText}>Noor Al Maarifa</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className={styles.navMenu}>
            {navItems.filter(item => item.showInNav).map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`${styles.navLink} ${
                    isActivePath(item.path) ? styles.active : ''
                  }`}
                >
                  {item.label} | {item.labelAr}
                </Link>
              </li>
            ))}
          </ul>

          {/* User Info & Actions */}
          <div className={styles.headerActions}>
            {user && isAdmin && (
              <div className={styles.userDropdown}>
                <button
                  className={styles.userDropdownBtn}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  aria-expanded={isUserDropdownOpen}
                >
                  <img
                    src={user.photoURL || '/images/default-avatar.png'}
                    alt={user.displayName || 'User'}
                    className={styles.userPhoto}
                  />
                  <span className={styles.userName}>
                    {user.displayName || 'Admin'}
                  </span>
                  <i className={`fas fa-chevron-down ${isUserDropdownOpen ? styles.rotated : ''}`}></i>
                </button>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      className={styles.userDropdownMenu}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={styles.userInfoDetails}>
                        <img
                          src={user.photoURL || '/images/default-avatar.png'}
                          alt={user.displayName || 'User'}
                        />
                        <div>
                          <p>{user.displayName || 'Admin User'}</p>
                          <p className={styles.userEmail}>{user.email}</p>
                          <span className={styles.adminBadge}>Admin</span>
                        </div>
                      </div>
                      <div className={styles.dropdownActions}>
                        <Link
                          to="/myadmin"
                          className={styles.dropdownBtn}
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <i className="fas fa-cog"></i>
                          Admin Panel
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className={`${styles.dropdownBtn} ${styles.signOut}`}
                        >
                          <i className="fas fa-sign-out-alt"></i>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className={`${styles.hamburger} ${isMobileMenuOpen ? styles.active : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <span className={styles.bar}></span>
              <span className={styles.bar}></span>
              <span className={styles.bar}></span>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className={styles.mobileNavList}>
                {navItems.filter(item => item.showInNav).map((item) => (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`${styles.mobileNavLink} ${
                        isActivePath(item.path) ? styles.active : ''
                      }`}
                    >
                      {item.label} | {item.labelAr}
                    </Link>
                  </motion.li>
                ))}
                

              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};