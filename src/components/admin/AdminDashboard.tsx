import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useContact } from '@/contexts/ContactContext';
import { useGallery } from '@/contexts/GalleryContext';
import { toast } from 'react-hot-toast';
import type { GalleryImage, ContactMessage } from '@/types';
import styles from './AdminDashboard.module.css';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { messages } = useContact();
  const { images } = useGallery();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Calculate statistics
  // const totalMessages = messages.length;
  // const todayMessages = messages.filter(m => {
  //   const today = new Date().toDateString();
  //   return new Date(m.timestamp).toDateString() === today;
  // });
  
  // const totalImages = images.length;
  const recentImages = images.filter((img: GalleryImage) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(img.uploadedAt) > oneWeekAgo;
  });

  const stats = [
    { 
      title: 'Total Images', 
      value: images.length, 
      icon: 'fas fa-images',
      color: 'blue'
      // change: '+12%'
    },
    { 
      title: 'Recent Uploads', 
      value: recentImages.length, 
      icon: 'fas fa-upload',
      color: 'green'
      // change: '+5%'
    },
    { 
      title: 'Total Messages', 
      value: messages.length, 
      icon: 'fas fa-envelope',
      color: 'yellow'
      // change: '+3%'
    },
    { 
      title: 'Pending Messages', 
      value: messages.filter((msg: ContactMessage) => msg.status === 'new').length, 
      icon: 'fas fa-clock',
      color: 'red'
      // change: '-2%'
    }
  ];

  const recentActivity = [
    ...messages.slice(0, 3).map(msg => ({
      type: 'message',
      title: `New message from ${msg.name}`,
      time: new Date(msg.timestamp).toLocaleString(),
      icon: 'fas fa-message',
      color: 'blue'
    })),
    ...images.slice(0, 2).map(img => ({
      type: 'upload',
      title: `Image uploaded: ${img.title}`,
      time: new Date(img.uploadedAt).toLocaleString(),
      icon: 'fas fa-cloud-upload-alt',
      color: 'green'
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  // const recentUploads = [...images]
  //   .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  //   .slice(0, 3)
  //   .map((img: GalleryImage) => ({
  //     id: img.id,
  //     title: img.title,
  //     url: img.url,
  //     date: new Date(img.uploadedAt).toLocaleDateString()
  //   }));

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h1>Dashboard Overview</h1>
          <p>Welcome back, {user?.displayName || user?.email}</p>
        </div>
        <div className={styles.headerRight}>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={styles.periodSelector}
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <div className={styles.lastUpdate}>
            <i className="fas fa-sync-alt"></i>
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${styles.statCard} ${styles[stat.color]}`}
          >
            <div className={styles.statIcon}>
              <i className={stat.icon}></i>
            </div>
            <div className={styles.statContent}>
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <span className={styles.statChange}>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className={styles.dashboardContent}>
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={styles.activitySection}
        >
          <div className={styles.sectionHeader}>
            <h2>Recent Activity</h2>
            <button className={styles.viewAllBtn}>
              View All
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className={styles.activityList}>
            {recentActivity.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="fas fa-clock"></i>
                <p>No recent activity</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className={styles.activityItem}>
                  <div className={`${styles.activityIcon} ${styles[activity.color]}`}>
                    <i className={activity.icon}></i>
                  </div>
                  <div className={styles.activityContent}>
                    <p>{activity.title}</p>
                    <small>{activity.time}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={styles.actionsSection}
        >
          <div className={styles.sectionHeader}>
            <h2>Quick Actions</h2>
          </div>
          <div className={styles.actionsList}>
            <button 
              className={styles.actionBtn}
              onClick={() => toast.success('Navigating to messages...')}
            >
              <i className="fas fa-envelope"></i>
              <span>View Messages</span>
              {unreadMessages > 0 && (
                <div className={styles.badge}>{unreadMessages}</div>
              )}
            </button>
            <button 
              className={styles.actionBtn}
              onClick={() => toast.success('Opening gallery manager...')}
            >
              <i className="fas fa-images"></i>
              <span>Manage Gallery</span>
            </button>
            <button 
              className={styles.actionBtn}
              onClick={() => toast.success('Opening content editor...')}
            >
              <i className="fas fa-edit"></i>
              <span>Edit Content</span>
            </button>
            <button 
              className={styles.actionBtn}
              onClick={() => toast.success('Opening analytics...')}
            >
              <i className="fas fa-chart-bar"></i>
              <span>View Analytics</span>
            </button>
            <button 
              className={styles.actionBtn}
              onClick={() => toast.success('Opening settings...')}
            >
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </button>
            <button 
              className={styles.actionBtn}
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin);
                toast.success('Website URL copied to clipboard!');
              }}
            >
              <i className="fas fa-link"></i>
              <span>Copy Site URL</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={styles.healthSection}
      >
        <h2>System Health</h2>
        <div className={styles.healthGrid}>
          <div className={styles.healthItem}>
            <div className={styles.healthIcon}>
              <i className="fas fa-database"></i>
            </div>
            <div className={styles.healthInfo}>
              <h3>Database</h3>
              <p className={styles.statusGood}>Operational</p>
            </div>
          </div>
          <div className={styles.healthItem}>
            <div className={styles.healthIcon}>
              <i className="fas fa-cloud"></i>
            </div>
            <div className={styles.healthInfo}>
              <h3>Storage</h3>
              <p className={styles.statusGood}>Operational</p>
            </div>
          </div>
          <div className={styles.healthItem}>
            <div className={styles.healthIcon}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className={styles.healthInfo}>
              <h3>Security</h3>
              <p className={styles.statusGood}>Secure</p>
            </div>
          </div>
          <div className={styles.healthItem}>
            <div className={styles.healthIcon}>
              <i className="fas fa-tachometer-alt"></i>
            </div>
            <div className={styles.healthInfo}>
              <h3>Performance</h3>
              <p className={styles.statusGood}>Excellent</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;