import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useContact } from '@/contexts/ContactContext';
import { useGallery } from '@/contexts/GalleryContext';
import { useContent } from '@/contexts/ContentContext';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { toast } from 'react-hot-toast';
import { isAdminUser } from '@/config/admin';
import type { GalleryImage, ContactMessage } from '@/types';
import type { EventItem } from '@/contexts/ContentContext';
import styles from './AdminPage.module.css';
import { Trash2 } from 'lucide-react';

const defaultAdminSettings = {
  siteTitle: 'Noor Al Maarifa Trading',
  contactEmail: 'sales@nooralmaarifa.com',
  phoneNumber: '+971 555 505 618',
};

interface EventFormProps {
  initial?: EventItem;
  onSubmit: (event: Omit<EventItem, 'id' | 'order'>) => Promise<void>;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ initial, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [titleAr, setTitleAr] = useState(initial?.titleAr || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [descriptionAr, setDescriptionAr] = useState(initial?.descriptionAr || '');
  const [icon, setIcon] = useState(initial?.icon || 'fas fa-calendar-alt');
  const [date, setDate] = useState(initial?.date ? new Date(initial.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState(initial?.location || '');
  const [locationAr, setLocationAr] = useState(initial?.locationAr || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        titleAr: titleAr.trim(),
        description: description.trim(),
        descriptionAr: descriptionAr.trim(),
        icon,
        date: new Date(date).toISOString(),
        location: location.trim(),
        locationAr: locationAr.trim(),
        isActive: true,
      });
      toast.success(initial ? 'Event updated successfully!' : 'Event added successfully!');
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.eventForm}>
      <div className={styles.eventFormGrid}>
        <div className={styles.eventFormField}>
          <label>Title (English)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Back to School Promotion"
            required
          />
        </div>
        <div className={styles.eventFormField}>
          <label>Title (Arabic)</label>
          <input
            type="text"
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            placeholder="مثال: عروض العودة إلى المدارس"
          />
        </div>
        <div className={styles.eventFormField}>
          <label>Description (English)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the event..."
            required
          />
        </div>
        <div className={styles.eventFormField}>
          <label>Description (Arabic)</label>
          <textarea
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
            placeholder="وصف الحدث..."
          />
        </div>
        <div className={styles.eventFormField}>
          <label>Icon (FontAwesome class)</label>
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="fas fa-calendar-check"
          />
        </div>
        <div className={styles.eventFormField}>
          <label>Event Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className={styles.eventFormField}>
          <label>Location (English)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Dubai World Trade Centre"
          />
        </div>
        <div className={styles.eventFormField}>
          <label>Location (Arabic)</label>
          <input
            type="text"
            value={locationAr}
            onChange={(e) => setLocationAr(e.target.value)}
            placeholder="مثال: مركز دبي التجاري العالمي"
          />
        </div>
      </div>
      <div className={styles.eventFormActions}>
        <button type="submit" className={styles.uploadBtn} disabled={saving}>
          <i className="fas fa-save"></i>
          {saving ? 'Saving...' : initial ? 'Update Event' : 'Add Event'}
        </button>
        <button type="button" className={styles.resetBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

const AdminPageContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'today'>('all');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [settings, setSettings] = useState<typeof defaultAdminSettings>(() => {
    const saved = localStorage.getItem('noor_admin_settings');
    if (saved) {
      try {
        return { ...defaultAdminSettings, ...(JSON.parse(saved) as Partial<typeof defaultAdminSettings>) };
      } catch {
        return defaultAdminSettings;
      }
    }
    return defaultAdminSettings;
  });
  // const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  // const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, signOut } = useAuth();
  const isAdmin = isAdminUser(user);
  const { messages, updateMessageStatus, deleteMessage } = useContact();
  const { images, uploadImage, deleteImage } = useGallery();
  const { 
    services,
    updateService,
    aboutFeatures,
    updateAboutFeature,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
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
        try {
          await deleteMessage(messageId);
          toast.success('Message deleted!');
        } catch (error) {
          console.error('Error deleting message:', error);
          toast.error('Failed to delete message');
        }
      }
    } else {
      await handleStatusChange(messageId, action as ContactMessage['status']);
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

  const handleSettingChange = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('noor_admin_settings', JSON.stringify(settings));
      document.title = `${settings.siteTitle} | نور المعرفة للتجارة`;
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleResetSettings = () => {
    setSettings(defaultAdminSettings);
    toast.success('Settings reset to defaults');
  };

  if (!user || !isAdmin) {
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

  const filteredMessages = messageFilter === 'unread'
    ? messages.filter(m => m.status === 'new')
    : messageFilter === 'today'
      ? todayMessages
      : messages;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-bar', badge: null },
    { id: 'messages', label: 'Messages', icon: 'fas fa-envelope', badge: unreadMessages.length },
    { id: 'gallery', label: 'Gallery', icon: 'fas fa-images', badge: null },
    { id: 'content', label: 'Content', icon: 'fas fa-edit', badge: null },
    { id: 'events', label: 'Events', icon: 'fas fa-calendar-alt', badge: null },
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
                <AdminDashboard onNavigate={setActiveTab} />
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
                      <button
                        className={`${styles.filterBtn} ${messageFilter === 'all' ? styles.active : ''}`}
                        onClick={() => setMessageFilter('all')}
                      >
                        All ({messages.length})
                      </button>
                      <button
                        className={`${styles.filterBtn} ${messageFilter === 'unread' ? styles.active : ''}`}
                        onClick={() => setMessageFilter('unread')}
                      >
                        Unread ({unreadMessages.length})
                      </button>
                      <button
                        className={`${styles.filterBtn} ${messageFilter === 'today' ? styles.active : ''}`}
                        onClick={() => setMessageFilter('today')}
                      >
                        Today ({todayMessages.length})
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.messagesList}>
                    {filteredMessages.length === 0 ? (
                      <div className={styles.emptyState}>
                        <i className="fas fa-inbox"></i>
                        <h3>{messages.length === 0 ? 'No messages yet' : 'No messages match this filter'}</h3>
                        <p>When customers contact you, their messages will appear here.</p>
                      </div>
                    ) : (
                      filteredMessages.map((message) => (
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
                        <motion.div
                          key={image.id}
                          className={styles.galleryCard}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={styles.imagePreview}>
                            <img src={image.url} alt={image.title} loading="lazy" />
                          </div>
                          <div className={styles.galleryCardBody}>
                            <h4 className={styles.galleryCardTitle}>{image.title}</h4>
                            <div className={styles.galleryCardMeta}>
                              <span className={`${styles.badge} ${styles[image.category] || ''}`}>
                                {image.category}
                              </span>
                              <span className={styles.galleryCardDate}>
                                {new Date(image.uploadedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className={styles.galleryCardActions}>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleDeleteImage(image.id)}
                              aria-label={`Delete ${image.title}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </motion.div>
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

              {activeTab === 'events' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.events}
                >
                  <div className={styles.eventsHeader}>
                    <h2>Events Management</h2>
                    <button
                      className={styles.uploadBtn}
                      onClick={() => setEditingContent(editingContent === 'new-event' ? null : 'new-event')}
                    >
                      <i className="fas fa-plus"></i>
                      Add Event
                    </button>
                  </div>

                  {editingContent === 'new-event' && (
                    <EventForm
                      onSubmit={async (event) => {
                        await addEvent(event);
                        setEditingContent(null);
                      }}
                      onCancel={() => setEditingContent(null)}
                    />
                  )}

                  <div className={styles.eventsList}>
                    {events.length === 0 ? (
                      <div className={styles.emptyState}>
                        <i className="fas fa-calendar-times"></i>
                        <h3>No events yet</h3>
                        <p>Add your first event to keep visitors informed about promotions and exhibitions.</p>
                      </div>
                    ) : (
                      events.map((event) => (
                        <div key={event.id} className={styles.eventCard}>
                          <div className={styles.eventIcon}>
                            <i className={event.icon}></i>
                          </div>
                          <div className={styles.eventBody}>
                            <h4>{event.title} | {event.titleAr}</h4>
                            <p className={styles.eventDescription}>{event.description}</p>
                            <div className={styles.eventMeta}>
                              <span>
                                <i className="fas fa-calendar-day"></i>
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                              <span>
                                <i className="fas fa-map-marker-alt"></i>
                                {event.location} | {event.locationAr}
                              </span>
                            </div>
                          </div>
                          <div className={styles.eventActions}>
                            {editingContent === event.id ? (
                              <EventForm
                                initial={event}
                                onSubmit={async (updates) => {
                                  await updateEvent(event.id, updates);
                                  setEditingContent(null);
                                }}
                                onCancel={() => setEditingContent(null)}
                              />
                            ) : (
                              <>
                                <button
                                  className={styles.actionBtn}
                                  onClick={() => setEditingContent(event.id)}
                                  title="Edit event"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className={`${styles.actionBtn} ${styles.delete}`}
                                  onClick={() => {
                                    if (window.confirm(`Delete event "${event.title}"?`)) {
                                      deleteEvent(event.id);
                                    }
                                  }}
                                  title="Delete event"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
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
                      <h3>Messages by Status</h3>
                      <div className={styles.analyticsList}>
                        <div className={styles.analyticsRow}>
                          <span className={styles.analyticsLabel}>New</span>
                          <span className={styles.analyticsValue}>{messages.filter(m => m.status === 'new').length}</span>
                        </div>
                        <div className={styles.analyticsRow}>
                          <span className={styles.analyticsLabel}>Read</span>
                          <span className={styles.analyticsValue}>{messages.filter(m => m.status === 'read').length}</span>
                        </div>
                        <div className={styles.analyticsRow}>
                          <span className={styles.analyticsLabel}>Replied</span>
                          <span className={styles.analyticsValue}>{messages.filter(m => m.status === 'replied').length}</span>
                        </div>
                        <div className={styles.analyticsRow}>
                          <span className={styles.analyticsLabel}>Resolved</span>
                          <span className={styles.analyticsValue}>{messages.filter(m => m.status === 'resolved').length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.analyticsCard}>
                      <h3>Gallery</h3>
                      <div className={styles.analyticsList}>
                        <div className={styles.analyticsRow}>
                          <span className={styles.analyticsLabel}>Total Images</span>
                          <span className={styles.analyticsValue}>{images.length}</span>
                        </div>
                        <div className={styles.analyticsRow}>
                          <span className={styles.analyticsLabel}>Products</span>
                          <span className={styles.analyticsValue}>{images.filter((img: GalleryImage) => img.category === 'products').length}</span>
                        </div>
                        <div className={styles.analyticsRow}>
                          <span className={styles.analyticsLabel}>Office</span>
                          <span className={styles.analyticsValue}>{images.filter((img: GalleryImage) => img.category === 'office').length}</span>
                        </div>
                        <div className={styles.analyticsRow}>
                          <span className={styles.analyticsLabel}>Events</span>
                          <span className={styles.analyticsValue}>{images.filter((img: GalleryImage) => img.category === 'events').length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.analyticsCard}>
                      <h3>Recent Activity</h3>
                      <div className={styles.analyticsList}>
                        {[...messages].slice(0, 4).map(msg => (
                          <div key={msg.id} className={styles.analyticsRow}>
                            <span className={styles.analyticsLabel}>
                              {new Date(msg.timestamp).toLocaleDateString()}
                            </span>
                            <span className={styles.analyticsValue}>Message</span>
                          </div>
                        ))}
                        {messages.length === 0 && (
                          <div className={styles.analyticsEmpty}>No recent activity yet</div>
                        )}
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
                        <input
                          type="text"
                          value={settings.siteTitle}
                          onChange={(e) => handleSettingChange('siteTitle', e.target.value)}
                        />
                      </div>
                      <div className={styles.settingItem}>
                        <label>Contact Email</label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                        />
                      </div>
                      <div className={styles.settingItem}>
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          value={settings.phoneNumber}
                          onChange={(e) => handleSettingChange('phoneNumber', e.target.value)}
                        />
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
                    <button className={styles.saveBtn} onClick={handleSaveSettings}>
                      <i className="fas fa-save"></i>
                      Save Settings
                    </button>
                    <button className={styles.resetBtn} onClick={handleResetSettings}>
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