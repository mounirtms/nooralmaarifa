import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import styles from './AdminLogin.module.css';

export const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Password validation
    if (credentials.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signIn(credentials.email, credentials.password);
      toast.success('Login successful!');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        toast.error('No admin account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many failed attempts. Please try again later');
      } else {
        toast.error('Authentication failed. Please check your credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.loginContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.loginCard}
      >
        <div className={styles.loginHeader}>
          <div className={styles.logoSection}>
            <img 
              src="/images/LOGOICON.png" 
              alt="Noor Al Maarifa Trading" 
              className={styles.logo}
            />
            <h1>Admin Login</h1>
            <p>نور المعرفة للتجارة - دخول المدير</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Admin Email</label>
            <div className={styles.inputGroup}>
              <i className="fas fa-user"></i>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder="admin@nooralmaarifa.com"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputGroup}>
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter your secure password"
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading || !credentials.email || !credentials.password}
          >
            {loading ? (
              <>
                <div className={styles.spinner}></div>
                Authenticating...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className={styles.securityInfo}>
          <div className={styles.securityItem}>
            <i className="fas fa-shield-alt"></i>
            <span>Secured by Firebase Auth</span>
          </div>
          <div className={styles.securityItem}>
            <i className="fas fa-lock"></i>
            <span>256-bit SSL Encryption</span>
          </div>
        </div>

        <div className={styles.loginFooter}>
          <p>
            <i className="fas fa-info-circle"></i>
            Only authorized administrators can access this panel
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;