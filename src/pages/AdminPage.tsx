import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useContact } from '@/contexts/ContactContext';
import { useGallery } from '@/contexts/GalleryContext';
import styles from './AdminPage.module.css';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, signOut } = useAuth();
  const { messages } = useContact();
  const { images } = useGallery();

  if (!user || !user.isAdmin) {
    return (
      <div className={styles.accessDenied}>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'messages', label: 'Messages', icon: 'fas fa-envelope' },
    { id: 'gallery', label: 'Gallery', icon: 'fas fa-images' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' }
  ];

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminHeader}>
        <div className="container">
          <div className={styles.headerContent}>
            <h1>Admin Dashboard</h1>
            <div className={styles.userInfo}>
              <span>Welcome, {user.displayName || user.email}</span>
              <button onClick={signOut} className={styles.signOutBtn}>
                <i className="fas fa-sign-out-alt"></i>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.adminContent}>
        <div className="container">
          <div className={styles.adminLayout}>
            {/* Sidebar */}
            <nav className={styles.sidebar}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={tab.icon}></i>
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Main Content */}
            <main className={styles.mainContent}>
              {activeTab === 'dashboard' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.dashboard}
                >
                  <h2>Dashboard Overview</h2>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <i className="fas fa-envelope"></i>
                      <div>
                        <h3>{messages.length}</h3>
                        <p>Total Messages</p>
                      </div>
                    </div>
                    <div className={styles.statCard}>
                      <i className="fas fa-images"></i>
                      <div>
                        <h3>{images.length}</h3>
                        <p>Gallery Images</p>
                      </div>
                    </div>
                    <div className={styles.statCard}>
                      <i className="fas fa-eye"></i>
                      <div>
                        <h3>1,234</h3>
                        <p>Page Views</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'messages' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.messages}
                >
                  <h2>Contact Messages</h2>
                  <div className={styles.messagesList}>
                    {messages.length === 0 ? (
                      <p>No messages yet.</p>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className={styles.messageCard}>
                          <div className={styles.messageHeader}>
                            <h3>{message.name}</h3>
                            <span className={styles.status}>{message.status}</span>
                          </div>
                          <p>{message.email} | {message.phone}</p>
                          <p>{message.message}</p>
                          <small>{new Date(message.timestamp).toLocaleDateString()}</small>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'gallery' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.gallery}
                >
                  <h2>Gallery Management</h2>
                  <div className={styles.galleryGrid}>
                    {images.map((image) => (
                      <div key={image.id} className={styles.galleryItem}>
                        <img src={image.url} alt={image.title} />
                        <div className={styles.imageInfo}>
                          <h4>{image.title}</h4>
                          <p>{image.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.settings}
                >
                  <h2>Settings</h2>
                  <p>Admin settings and configuration options will be available here.</p>
                </motion.div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};