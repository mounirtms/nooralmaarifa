import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  order: number;
  isActive: boolean;
}

export interface AboutFeature {
  id: string;
  icon: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  order: number;
  isActive: boolean;
}

export interface CompanyInfo {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  mission: string;
  missionAr: string;
  vision: string;
  visionAr: string;
  lastUpdated: string;
}

export interface EventItem {
  id: string;
  icon: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  date: string;
  location: string;
  locationAr: string;
  order: number;
  isActive: boolean;
}

interface ContentContextType {
  services: ServiceItem[];
  aboutFeatures: AboutFeature[];
  events: EventItem[];
  companyInfo: CompanyInfo;
  loading: boolean;

  // Service management
  addService: (service: Omit<ServiceItem, 'id' | 'order'>) => Promise<void>;
  updateService: (id: string, updates: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  reorderServices: (services: ServiceItem[]) => Promise<void>;

  // About features management
  addAboutFeature: (feature: Omit<AboutFeature, 'id' | 'order'>) => Promise<void>;
  updateAboutFeature: (id: string, updates: Partial<AboutFeature>) => Promise<void>;
  deleteAboutFeature: (id: string) => Promise<void>;
  reorderAboutFeatures: (features: AboutFeature[]) => Promise<void>;

  // Events management
  addEvent: (event: Omit<EventItem, 'id' | 'order'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<EventItem>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  reorderEvents: (events: EventItem[]) => Promise<void>;

  // Company info management
  updateCompanyInfo: (updates: Partial<CompanyInfo>) => Promise<void>;

  // Data refresh
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Default data used before / instead of Firestore content
const defaultServices: ServiceItem[] = [
  {
    id: '1',
    icon: 'fas fa-pen',
    title: 'Writing Instruments',
    titleAr: 'أدوات الكتابة',
    description: 'Premium pens, pencils, markers, and highlighters from leading international brands.',
    descriptionAr: 'أقلام وأدوات كتابة عالية الجودة من أفضل العلامات التجارية العالمية.',
    order: 1,
    isActive: true
  },
  {
    id: '2',
    icon: 'fas fa-copy',
    title: 'Paper Products',
    titleAr: 'منتجات ورقية',
    description: 'High-quality paper, notebooks, files, and organizational supplies.',
    descriptionAr: 'أوراق عالية الجودة ودفاتر وملفات ولوازم تنظيمية.',
    order: 2,
    isActive: true
  },
  {
    id: '3',
    icon: 'fas fa-laptop',
    title: 'Office Equipment',
    titleAr: 'معدات مكتبية',
    description: 'Modern office equipment and accessories for enhanced productivity.',
    descriptionAr: 'معدات مكتبية حديثة وإكسسوارات لتعزيز الإنتاجية.',
    order: 3,
    isActive: true
  },
  {
    id: '4',
    icon: 'fas fa-palette',
    title: 'Art Supplies',
    titleAr: 'لوازم فنية',
    description: 'Complete range of art materials for creative professionals and students.',
    descriptionAr: 'مجموعة كاملة من المواد الفنية للمحترفين والطلاب المبدعين.',
    order: 4,
    isActive: true
  }
];

const defaultAboutFeatures: AboutFeature[] = [
  {
    id: '1',
    icon: 'fas fa-award',
    title: 'Premium Quality',
    titleAr: 'جودة عالية',
    description: 'Only the finest products from trusted international brands.',
    descriptionAr: 'أفضل المنتجات من العلامات التجارية العالمية الموثوقة.',
    order: 1,
    isActive: true
  },
  {
    id: '2',
    icon: 'fas fa-shipping-fast',
    title: 'Fast Delivery',
    titleAr: 'توصيل سريع',
    description: 'Quick and reliable delivery across Dubai and UAE.',
    descriptionAr: 'توصيل سريع وموثوق في جميع أنحاء دبي والإمارات.',
    order: 2,
    isActive: true
  },
  {
    id: '3',
    icon: 'fas fa-headset',
    title: '24/7 Support',
    titleAr: 'دعم على مدار الساعة',
    description: 'Round-the-clock customer support for all your needs.',
    descriptionAr: 'دعم العملاء على مدار الساعة لجميع احتياجاتك.',
    order: 3,
    isActive: true
  },
  {
    id: '4',
    icon: 'fas fa-handshake',
    title: 'Trusted Partner',
    titleAr: 'شريك موثوق',
    description: 'Building long-term relationships with our valued clients.',
    descriptionAr: 'بناء علاقات طويلة الأمد مع عملائنا الكرام.',
    order: 4,
    isActive: true
  }
];

const defaultCompanyInfo: CompanyInfo = {
  id: '1',
  name: 'Noor Al Maarifa Trading L.L.C',
  nameAr: 'شركة نور المعرفة للتجارة ذ.م.م',
  description: 'Leading provider of premium stationery and office supplies in Dubai and UAE. We specialize in high-quality products for businesses, schools, and professionals.',
  descriptionAr: 'مزود رائد للقرطاسية ولوازم المكاتب عالية الجودة في دبي والإمارات. نحن متخصصون في المنتجات عالية الجودة للشركات والمدارس والمهنيين.',
  mission: 'To provide exceptional stationery and office solutions that enhance productivity and creativity for our clients across the UAE.',
  missionAr: 'تقديم حلول قرطاسية ومكتبية استثنائية تعزز الإنتاجية والإبداع لعملائنا في جميع أنحاء الإمارات.',
  vision: 'To be the most trusted and innovative supplier of office solutions in the Middle East, setting new standards in quality and service excellence.',
  visionAr: 'أن نكون أكثر مورد موثوق ومبتكر لحلول المكاتب في الشرق الأوسط، ووضع معايير جديدة في الجودة وتميز الخدمة.',
  lastUpdated: new Date().toISOString()
};

const defaultEvents: EventItem[] = [
  {
    id: '1',
    icon: 'fas fa-calendar-check',
    title: 'Back to School Promotion',
    titleAr: 'عروض العودة إلى المدارس',
    description: 'Special discounts on school essentials and stationery kits for the new academic year.',
    descriptionAr: 'خصومات خاصة على اللوازم المدرسية ومجموعات القرطاسية للعام الدراسي الجديد.',
    date: new Date().toISOString(),
    location: 'Dubai, UAE',
    locationAr: 'دبي، الإمارات',
    order: 1,
    isActive: true
  },
  {
    id: '2',
    icon: 'fas fa-box-open',
    title: 'Office Supplies Expo',
    titleAr: 'معرض اللوازم المكتبية',
    description: 'Visit our booth to discover the latest office solutions and exclusive trade pricing.',
    descriptionAr: 'قم بزيارة جناحنا لاكتشاف أحدث الحلول المكتبية وأسعار التجزئة الحصرية.',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Dubai World Trade Centre',
    locationAr: 'مركز دبي التجاري العالمي',
    order: 2,
    isActive: true
  }
];

// Firestore document paths (collection "content" with fixed doc ids)
const servicesDocRef = doc(db, 'content', 'services');
const aboutFeaturesDocRef = doc(db, 'content', 'aboutFeatures');
const eventsDocRef = doc(db, 'content', 'events');
const companyInfoDocRef = doc(db, 'content', 'companyInfo');

const sortByOrder = <T extends { order: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => a.order - b.order);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [aboutFeatures, setAboutFeatures] = useState<AboutFeature[]>(defaultAboutFeatures);
  const [events, setEvents] = useState<EventItem[]>(defaultEvents);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo);
  const [loading, setLoading] = useState(false);

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);

      const [servicesSnap, featuresSnap, eventsSnap, infoSnap] = await Promise.all([
        getDoc(servicesDocRef),
        getDoc(aboutFeaturesDocRef),
        getDoc(eventsDocRef),
        getDoc(companyInfoDocRef),
      ]);

      if (servicesSnap.exists()) {
        const items = servicesSnap.data()?.items;
        if (Array.isArray(items) && items.length > 0) {
          setServices(sortByOrder(items));
        }
      }

      if (featuresSnap.exists()) {
        const items = featuresSnap.data()?.items;
        if (Array.isArray(items) && items.length > 0) {
          setAboutFeatures(sortByOrder(items));
        }
      }

      if (eventsSnap.exists()) {
        const items = eventsSnap.data()?.items;
        if (Array.isArray(items) && items.length > 0) {
          setEvents(sortByOrder(items));
        }
      }

      if (infoSnap.exists()) {
        const data = infoSnap.data();
        if (data && data.name) {
          setCompanyInfo(data as CompanyInfo);
        }
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const saveServices = useCallback(async (updatedServices: ServiceItem[]) => {
    setServices(updatedServices);
    await setDoc(servicesDocRef, {
      items: updatedServices,
      updatedAt: serverTimestamp(),
    });
  }, []);

  const saveAboutFeatures = useCallback(async (updatedFeatures: AboutFeature[]) => {
    setAboutFeatures(updatedFeatures);
    await setDoc(aboutFeaturesDocRef, {
      items: updatedFeatures,
      updatedAt: serverTimestamp(),
    });
  }, []);

  const saveEvents = useCallback(async (updatedEvents: EventItem[]) => {
    setEvents(updatedEvents);
    await setDoc(eventsDocRef, {
      items: updatedEvents,
      updatedAt: serverTimestamp(),
    });
  }, []);

  const saveCompanyInfo = useCallback(async (updatedInfo: CompanyInfo) => {
    setCompanyInfo(updatedInfo);
    await setDoc(companyInfoDocRef, updatedInfo);
  }, []);

  // Service management functions
  const addService = async (service: Omit<ServiceItem, 'id' | 'order'>) => {
    try {
      const newService: ServiceItem = {
        ...service,
        id: Date.now().toString(),
        order: services.length + 1
      };

      await saveServices([...services, newService]);
      toast.success('Service added successfully');
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service');
    }
  };

  const updateService = async (id: string, updates: Partial<ServiceItem>) => {
    try {
      const updatedServices = services.map(service =>
        service.id === id ? { ...service, ...updates } : service
      );
      await saveServices(updatedServices);
      toast.success('Service updated successfully');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  const deleteService = async (id: string) => {
    try {
      const updatedServices = services.filter(service => service.id !== id);
      await saveServices(updatedServices);
      toast.success('Service deleted successfully');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const reorderServices = async (reorderedServices: ServiceItem[]) => {
    try {
      const updatedServices = reorderedServices.map((service, index) => ({
        ...service,
        order: index + 1
      }));
      await saveServices(updatedServices);
      toast.success('Services reordered successfully');
    } catch (error) {
      console.error('Error reordering services:', error);
      toast.error('Failed to reorder services');
    }
  };

  // About features management functions
  const addAboutFeature = async (feature: Omit<AboutFeature, 'id' | 'order'>) => {
    try {
      const newFeature: AboutFeature = {
        ...feature,
        id: Date.now().toString(),
        order: aboutFeatures.length + 1
      };

      await saveAboutFeatures([...aboutFeatures, newFeature]);
      toast.success('Feature added successfully');
    } catch (error) {
      console.error('Error adding feature:', error);
      toast.error('Failed to add feature');
    }
  };

  const updateAboutFeature = async (id: string, updates: Partial<AboutFeature>) => {
    try {
      const updatedFeatures = aboutFeatures.map(feature =>
        feature.id === id ? { ...feature, ...updates } : feature
      );
      await saveAboutFeatures(updatedFeatures);
      toast.success('Feature updated successfully');
    } catch (error) {
      console.error('Error updating feature:', error);
      toast.error('Failed to update feature');
    }
  };

  const deleteAboutFeature = async (id: string) => {
    try {
      const updatedFeatures = aboutFeatures.filter(feature => feature.id !== id);
      await saveAboutFeatures(updatedFeatures);
      toast.success('Feature deleted successfully');
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error('Failed to delete feature');
    }
  };

  const reorderAboutFeatures = async (reorderedFeatures: AboutFeature[]) => {
    try {
      const updatedFeatures = reorderedFeatures.map((feature, index) => ({
        ...feature,
        order: index + 1
      }));
      await saveAboutFeatures(updatedFeatures);
      toast.success('Features reordered successfully');
    } catch (error) {
      console.error('Error reordering features:', error);
      toast.error('Failed to reorder features');
    }
  };

  // Events management functions
  const addEvent = async (event: Omit<EventItem, 'id' | 'order'>) => {
    try {
      const newEvent: EventItem = {
        ...event,
        id: Date.now().toString(),
        order: events.length + 1
      };

      await saveEvents([...events, newEvent]);
      toast.success('Event added successfully');
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  };

  const updateEvent = async (id: string, updates: Partial<EventItem>) => {
    try {
      const updatedEvents = events.map(event =>
        event.id === id ? { ...event, ...updates } : event
      );
      await saveEvents(updatedEvents);
      toast.success('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const updatedEvents = events.filter(event => event.id !== id);
      await saveEvents(updatedEvents);
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const reorderEvents = async (reorderedEvents: EventItem[]) => {
    try {
      const updatedEvents = reorderedEvents.map((event, index) => ({
        ...event,
        order: index + 1
      }));
      await saveEvents(updatedEvents);
      toast.success('Events reordered successfully');
    } catch (error) {
      console.error('Error reordering events:', error);
      toast.error('Failed to reorder events');
    }
  };

  // Company info management
  const updateCompanyInfo = async (updates: Partial<CompanyInfo>) => {
    try {
      const updatedInfo: CompanyInfo = {
        ...companyInfo,
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      await saveCompanyInfo(updatedInfo);
      toast.success('Company information updated successfully');
    } catch (error) {
      console.error('Error updating company info:', error);
      toast.error('Failed to update company information');
    }
  };

  const refreshContent = async () => {
    await loadContent();
    toast.success('Content refreshed successfully');
  };

  const value: ContentContextType = {
    services: services.filter(s => s.isActive !== false),
    aboutFeatures: aboutFeatures.filter(f => f.isActive !== false),
    events: events.filter(e => e.isActive !== false),
    companyInfo,
    loading,
    addService,
    updateService,
    deleteService,
    reorderServices,
    addAboutFeature,
    updateAboutFeature,
    deleteAboutFeature,
    reorderAboutFeatures,
    addEvent,
    updateEvent,
    deleteEvent,
    reorderEvents,
    updateCompanyInfo,
    refreshContent
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
