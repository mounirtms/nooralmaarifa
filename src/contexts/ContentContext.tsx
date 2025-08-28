import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';

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

interface ContentContextType {
  services: ServiceItem[];
  aboutFeatures: AboutFeature[];
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
  
  // Company info management
  updateCompanyInfo: (updates: Partial<CompanyInfo>) => Promise<void>;
  
  // Data refresh
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Default data
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

export function ContentProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [aboutFeatures, setAboutFeatures] = useState<AboutFeature[]>(defaultAboutFeatures);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo);
  const [loading, setLoading] = useState(false);

  // Load content from localStorage on mount
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      const savedServices = localStorage.getItem('noor_services');
      const savedFeatures = localStorage.getItem('noor_about_features');
      const savedCompanyInfo = localStorage.getItem('noor_company_info');
      
      if (savedServices) {
        setServices(JSON.parse(savedServices));
      }
      
      if (savedFeatures) {
        setAboutFeatures(JSON.parse(savedFeatures));
      }
      
      if (savedCompanyInfo) {
        setCompanyInfo(JSON.parse(savedCompanyInfo));
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const saveServices = (updatedServices: ServiceItem[]) => {
    localStorage.setItem('noor_services', JSON.stringify(updatedServices));
    setServices(updatedServices);
  };

  const saveAboutFeatures = (updatedFeatures: AboutFeature[]) => {
    localStorage.setItem('noor_about_features', JSON.stringify(updatedFeatures));
    setAboutFeatures(updatedFeatures);
  };

  const saveCompanyInfo = (updatedInfo: CompanyInfo) => {
    localStorage.setItem('noor_company_info', JSON.stringify(updatedInfo));
    setCompanyInfo(updatedInfo);
  };

  // Service management functions
  const addService = async (service: Omit<ServiceItem, 'id' | 'order'>) => {
    try {
      const newService: ServiceItem = {
        ...service,
        id: Date.now().toString(),
        order: services.length + 1
      };
      
      const updatedServices = [...services, newService];
      saveServices(updatedServices);
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
      saveServices(updatedServices);
      toast.success('Service updated successfully');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  const deleteService = async (id: string) => {
    try {
      const updatedServices = services.filter(service => service.id !== id);
      saveServices(updatedServices);
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
      saveServices(updatedServices);
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
      
      const updatedFeatures = [...aboutFeatures, newFeature];
      saveAboutFeatures(updatedFeatures);
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
      saveAboutFeatures(updatedFeatures);
      toast.success('Feature updated successfully');
    } catch (error) {
      console.error('Error updating feature:', error);
      toast.error('Failed to update feature');
    }
  };

  const deleteAboutFeature = async (id: string) => {
    try {
      const updatedFeatures = aboutFeatures.filter(feature => feature.id !== id);
      saveAboutFeatures(updatedFeatures);
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
      saveAboutFeatures(updatedFeatures);
      toast.success('Features reordered successfully');
    } catch (error) {
      console.error('Error reordering features:', error);
      toast.error('Failed to reorder features');
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
      saveCompanyInfo(updatedInfo);
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
    services: services.filter(s => s.isActive).sort((a, b) => a.order - b.order),
    aboutFeatures: aboutFeatures.filter(f => f.isActive).sort((a, b) => a.order - b.order),
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
    updateCompanyInfo,
    refreshContent
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}