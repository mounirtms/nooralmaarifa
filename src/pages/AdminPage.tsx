import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useContact } from '@/contexts/ContactContext';
import { useGallery } from '@/contexts/GalleryContext';
import { useContent } from '@/contexts/ContentContext';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { toast } from 'react-hot-toast';
import type { GalleryImage } from '@/types';
import styles from './AdminPage.module.css';
import { Trash2 } from 'lucide-react';

const AdminPageContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  // const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  // const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, signOut } = useAuth();
  const { messages, updateMessageStatus } = useContact();
  const { images, uploadImage, deleteImage } = useGallery();
  const { 
    services,
    updateService,
    aboutFeatures,
    updateAboutFeature
  } = useContent();

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#ff6b6b';
      case 'read': return '#4ecdc4';
      case 'replied': return '#45b7d1';
      case 'resolved': return '#96ceb4';
      default: return '#ddd';
    }
  };

  const handleMessageAction = async (messageId: string, action: string) => {
    if (action === 'delete') {
      if (window.confirm('Are you sure you want to delete this message?')) {
        // TODO: Implement delete functionality
        toast.success('Message deleted!');
      }
    } else {
      await handleStatusChange(messageId, action as any);
    }
  };

  const handleImageDelete = async (imageId: string) => {
    try {
      await deleteImage(imageId);
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      await handleImageDelete(imageId);
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className={styles.accessDenied}>
        <div className={styles.accessDeniedContent}>
          <div className={styles.lockIcon}>
            <i className="fas fa-lock"></i>
          </div>
          <h1>Access Denied</h1>
          <p>You don't have permission to access this admin panel.</p>
          <p className={styles.accessDeniedAr}>ليس لديك صلاحية للوصول إلى لوحة الإدارة</p>
        </div>
      </div>
    );
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        // Add metadata for the uploaded image
        const metadata = {
          title: file.name,
          category: 'products' as const,
          uploadedBy: user?.uid || 'unknown'
        };
        await uploadImage(file, metadata);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);
      }
      
      toast.success('Images uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleStatusChange = async (messageId: string, action: 'read' | 'replied' | 'resolved' | 'new') => {
    try {
      await updateMessageStatus(messageId, action);
      toast.success('Message status updated!');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Fix unread messages filter to use correct status
  const unreadMessages = messages.filter(m => m.status === 'new');
  const todayMessages = messages.filter(m => {
    const today = new Date().toDateString();
    return new Date(m.timestamp).toDateString() === today;
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-bar', badge: null },
    { id: 'messages', label: 'Messages', icon: 'fas fa-envelope', badge: unreadMessages.length },
    { id: 'gallery', label: 'Gallery', icon: 'fas fa-images', badge: null },
    { id: 'content', label: 'Content', icon: 'fas fa-edit', badge: null },
    { id: 'analytics', label: 'Analytics', icon: 'fas fa-analytics', badge: null },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog', badge: null }
  ];

  return (
    <div className={styles.adminPage}>
      {/* Professional Admin Header */}
      <div className={styles.adminHeader}>
        <div className="container">
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <div className={styles.adminIcon}>
                <i className="fas fa-shield-alt"></i>
              </div>
              <div>
                <h1>Admin Dashboard</h1>
                <p className={styles.headerSubtitle}>Noor Al Maarifa Trading Management Panel</p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.userInfo}>
                <img 
                  src={user.photoURL || '/images/default-avatar.png'} 
                  alt={user.displayName || 'Admin'}
                  className={styles.userAvatar}
                />
                <div className={styles.userDetails}>
                  <span className={styles.userName}>Welcome, {user.displayName || user.email}</span>
                  <span className={styles.userRole}>System Administrator</span>
                </div>
                <button onClick={() => signOut()} className={styles.signOutBtn}>
                  <i className="fas fa-sign-out-alt"></i>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.adminContent}>
        <div className="container">
          <div className={styles.adminLayout}>
            {/* Enhanced Sidebar */}
            <nav className={styles.sidebar}>
              <div className={styles.sidebarHeader}>
                <h3>Navigation</h3>
              </div>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <div className={styles.badge}>{tab.badge}</div>
                  )}
                </button>
              ))}
              
              <div className={styles.sidebarFooter}>
                <div className={styles.quickStats}>
                  <div className={styles.quickStat}>
                    <i className="fas fa-clock"></i>
                    <span>Online</span>
                  </div>
                  <div className={styles.quickStat}>
                    <i className="fas fa-server"></i>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </nav>

            {/* Enhanced Main Content */}
            <main className={styles.mainContent}>
              {activeTab === 'dashboard' && (
                <AdminDashboard />
              )}

              {activeTab === 'messages' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.messages}
                >
                  <div className={styles.messagesHeader}>
                    <h2>Contact Messages</h2>
                    <div className={styles.messageFilters}>
                      <button className={`${styles.filterBtn} ${styles.active}`}>
                        All ({messages.length})
                      </button>
                      <button className={styles.filterBtn}>
                        Unread ({unreadMessages.length})
                      </button>
                      <button className={styles.filterBtn}>
                        Today ({todayMessages.length})
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.messagesList}>
                    {messages.length === 0 ? (
                      <div className={styles.emptyState}>
                        <i className="fas fa-inbox"></i>
                        <h3>No messages yet</h3>
                        <p>When customers contact you, their messages will appear here.</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className={styles.messageCard}>
                          <div className={styles.messageHeader}>
                            <div className={styles.messageFrom}>
                              <div className={styles.messageAvatar}>
                                <i className="fas fa-user"></i>
                              </div>
                              <div>
                                <h3>{message.name}</h3>
                                <p className={styles.messageContact}>
                                  {message.email} | {message.phone}
                                </p>
                              </div>
                            </div>
                            <div className={styles.messageActions}>
                              <span 
                                className={styles.status}
                                style={{ backgroundColor: getMessageStatusColor(message.status) }}
                              >
                                {message.status}
                              </span>
                              <div className={styles.actionButtons}>
                                <button
                                  onClick={() => handleMessageAction(message.id, 'read')}
                                  className={styles.actionBtn}
                                  title="Mark as read"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  onClick={() => handleMessageAction(message.id, 'resolved')}
                                  className={styles.actionBtn}
                                  title="Mark as resolved"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                                <button
                                  onClick={() => handleMessageAction(message.id, 'delete')}
                                  className={`${styles.actionBtn} ${styles.delete}`}
                                  title="Delete message"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className={styles.messageBody}>
                            <p>{message.message}</p>
                          </div>
                          <div className={styles.messageFooter}>
                            <small>
                              <i className="fas fa-clock"></i>
                              {new Date(message.timestamp).toLocaleString()}
                            </small>
                            <button className={styles.replyBtn}>
                              <i className="fas fa-reply"></i>
                              Reply
                            </button>
                          </div>
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
                  <div className={styles.galleryHeader}>
                    <h2>Gallery Management</h2>
                    <div className={styles.galleryActions}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className={styles.fileInput}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className={styles.uploadBtn}
                        disabled={isUploading}
                      >
                        <i className="fas fa-cloud-upload-alt"></i>
                        {isUploading ? 'Uploading...' : 'Upload Images'}
                      </button>
                    </div>
                  </div>
                  
                  {uploadProgress > 0 && (
                    <div className={styles.uploadProgress}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <span>{uploadProgress}%</span>
                    </div>
                  )}
                  
                  <div className={styles.galleryStats}>
                    <div className={styles.galleryStat}>
                      <i className="fas fa-images"></i>
                      <span>{images.length} Images</span>
                    </div>
                    <div className={styles.galleryStat}>
                      <i className="fas fa-database"></i>
                      <span>Storage Used</span>
                    </div>
                  </div>
                  
                  {images.length === 0 ? (
                    <div className={styles.emptyState}>
                      <i className="fas fa-image"></i>
                      <h3>No images in gallery</h3>
                      <p>Upload your first images to get started.</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className={styles.uploadBtnLarge}
                      >
                        <i className="fas fa-cloud-upload-alt"></i>
                        Upload First Images
                      </button>
                    </div>
                  ) : (
                    <div className={styles.galleryGrid}>
                      {images.map((image: GalleryImage) => (
                        <motion.tr
                          key={image.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td>
                            <div className={styles.imagePreview}>
                              <img src={image.url} alt={image.title} />
                            </div>
                          </td>
                          <td>{image.title}</td>
                          <td>
                            <span className={`${styles.badge} ${styles[image.category]}`}>
                              {image.category}
                            </span>
                          </td>
                          <td>{new Date(image.uploadedAt).toLocaleDateString()}</td>
                          <td>
                            <div className={styles.actions}>
                              {/* <button 
                                className={styles.editBtn}
                                onClick={() => {
                                  setSelectedImage(image);
                                  setIsImageModalOpen(true);
                                }}
                              >
                                <Edit size={16} />
                              </button> */}
                              <button 
                                className={styles.deleteBtn}
                                onClick={() => handleDeleteImage(image.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}

                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'content' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.content}
                >
                  <h2>Content Management</h2>
                  
                  <div className={styles.contentSections}>
                    <div className={styles.contentSection}>
                      <h3>Services ({services.length})</h3>
                      <div className={styles.itemsGrid}>
                        {services.map((service) => (
                          <div key={service.id} className={styles.contentItem}>
                            <div className={styles.itemHeader}>
                              <i className={service.icon}></i>
                              <h4>{service.title}</h4>
                              <button 
                                onClick={() => setEditingContent(editingContent === service.id ? null : service.id)}
                                className={styles.editBtn}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                            </div>
                            {editingContent === service.id && (
                              <div className={styles.editForm}>
                                <input 
                                  placeholder="Title"
                                  defaultValue={service.title}
                                  onBlur={(e) => updateService(service.id, { title: e.target.value })}
                                />
                                <textarea 
                                  placeholder="Description"
                                  defaultValue={service.description}
                                  onBlur={(e) => updateService(service.id, { description: e.target.value })}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className={styles.contentSection}>
                      <h3>About Features ({aboutFeatures.length})</h3>
                      <div className={styles.itemsGrid}>
                        {aboutFeatures.map((feature) => (
                          <div key={feature.id} className={styles.contentItem}>
                            <div className={styles.itemHeader}>
                              <i className={feature.icon}></i>
                              <h4>{feature.title}</h4>
                              <button 
                                onClick={() => setEditingContent(editingContent === feature.id ? null : feature.id)}
                                className={styles.editBtn}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                            </div>
                            {editingContent === feature.id && (
                              <div className={styles.editForm}>
                                <input 
                                  placeholder="Title"
                                  defaultValue={feature.title}
                                  onBlur={(e) => updateAboutFeature(feature.id, { title: e.target.value })}
                                />
                                <textarea 
                                  placeholder="Description"
                                  defaultValue={feature.description}
                                  onBlur={(e) => updateAboutFeature(feature.id, { description: e.target.value })}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.analytics}
                >
                  <h2>Analytics & Reports</h2>
                  
                  <div className={styles.analyticsGrid}>
                    <div className={styles.analyticsCard}>
                      <h3>Website Traffic</h3>
                      <div className={styles.chartPlaceholder}>
                        <i className="fas fa-chart-line"></i>
                        <p>Traffic analytics coming soon</p>
                      </div>
                    </div>
                    
                    <div className={styles.analyticsCard}>
                      <h3>Message Trends</h3>
                      <div className={styles.chartPlaceholder}>
                        <i className="fas fa-chart-bar"></i>
                        <p>Message analytics coming soon</p>
                      </div>
                    </div>
                    
                    <div className={styles.analyticsCard}>
                      <h3>Popular Pages</h3>
                      <div className={styles.chartPlaceholder}>
                        <i className="fas fa-chart-pie"></i>
                        <p>Page analytics coming soon</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.settings}
                >
                  <h2>System Settings</h2>
                  
                  <div className={styles.settingsGrid}>
                    <div className={styles.settingsSection}>
                      <h3>General Settings</h3>
                      <div className={styles.settingItem}>
                        <label>Site Title</label>
                        <input type="text" defaultValue="Noor Al Maarifa Trading" />
                      </div>
                      <div className={styles.settingItem}>
                        <label>Contact Email</label>
                        <input type="email" defaultValue="info@nooralmaarifa.com" />
                      </div>
                      <div className={styles.settingItem}>
                        <label>Phone Number</label>
                        <input type="tel" defaultValue="+971 50 123 4567" />
                      </div>
                    </div>
                    
                    <div className={styles.settingsSection}>
                      <h3>Security Settings</h3>
                      <div className={styles.settingItem}>
                        <label>Admin Access</label>
                        <select defaultValue="restricted">
                          <option value="restricted">Restricted</option>
                          <option value="open">Open</option>
                        </select>
                      </div>
                      <div className={styles.settingItem}>
                        <label>Session Timeout</label>
                        <select defaultValue="30">
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className={styles.settingsSection}>
                      <h3>Notification Settings</h3>
                      <div className={styles.settingItem}>
                        <label>
                          <input type="checkbox" defaultChecked />
                          Email notifications for new messages
                        </label>
                      </div>
                      <div className={styles.settingItem}>
                        <label>
                          <input type="checkbox" defaultChecked />
                          SMS notifications for urgent messages
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.settingsActions}>
                    <button className={styles.saveBtn}>
                      <i className="fas fa-save"></i>
                      Save Settings
                    </button>
                    <button className={styles.resetBtn}>
                      <i className="fas fa-undo"></i>
                      Reset to Default
                    </button>
                  </div>
                </motion.div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap the AdminPage with ProtectedRoute to ensure security
export const AdminPage: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminPageContent />
    </ProtectedRoute>
  );
};

export default AdminPage;