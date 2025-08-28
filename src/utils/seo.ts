export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
}

export const defaultSEO: SEOConfig = {
  title: 'Noor Al Maarifa Trading - Premium Stationery & Office Supplies Dubai UAE',
  description: 'Leading supplier of premium stationery, office supplies, and business equipment in Dubai and UAE. Quality products from international brands for businesses and professionals.',
  keywords: [
    'stationery dubai',
    'office supplies uae',
    'قرطاسية دبي',
    'لوازم مكتبية الإمارات',
    'noor al maarifa',
    'نور المعرفة',
    'business supplies',
    'writing instruments',
    'paper products',
    'office equipment',
    'art supplies',
    'dubai stationery store',
    'bulk office supplies',
    'corporate stationery',
    'school supplies dubai'
  ],
  ogImage: '/images/LOGONOOR.png',
  ogType: 'website'
};

export const updatePageSEO = (config: Partial<SEOConfig>) => {
  const seoConfig = { ...defaultSEO, ...config };
  
  // Update title
  document.title = seoConfig.title;
  
  // Update meta description
  updateMetaTag('description', seoConfig.description);
  
  // Update keywords
  updateMetaTag('keywords', seoConfig.keywords.join(', '));
  
  // Update Open Graph tags
  updateMetaTag('og:title', seoConfig.title, 'property');
  updateMetaTag('og:description', seoConfig.description, 'property');
  updateMetaTag('og:type', seoConfig.ogType || 'website', 'property');
  updateMetaTag('og:url', window.location.href, 'property');
  
  if (seoConfig.ogImage) {
    updateMetaTag('og:image', seoConfig.ogImage, 'property');
  }
  
  // Update Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image', 'name');
  updateMetaTag('twitter:title', seoConfig.title, 'name');
  updateMetaTag('twitter:description', seoConfig.description, 'name');
  
  if (seoConfig.ogImage) {
    updateMetaTag('twitter:image', seoConfig.ogImage, 'name');
  }
  
  // Update canonical URL
  if (seoConfig.canonicalUrl) {
    updateLinkTag('canonical', seoConfig.canonicalUrl);
  }
  
  // Add structured data
  if (seoConfig.structuredData) {
    updateStructuredData(seoConfig.structuredData);
  }
};

const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
};

const updateStructuredData = (data: object) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// Business structured data
export const businessStructuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Noor Al Maarifa Trading L.L.C",
  "alternateName": "شركة نور المعرفة للتجارة",
  "description": "Premium stationery and office supplies provider in Dubai, UAE",
  "url": "https://nooralmaarifa.com",
  "telephone": "+971501234567",
  "email": "info@nooralmaarifa.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Business Address",
    "addressLocality": "Dubai",
    "addressCountry": "AE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 25.2048,
    "longitude": 55.2708
  },
  "openingHours": "Mo-Th 09:00-18:00",
  "sameAs": [
    "https://technostationery.com"
  ],
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 25.2048,
      "longitude": 55.2708
    },
    "geoRadius": 100000
  }
};

// Product catalog structured data
export const productCatalogStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProductGroup",
  "name": "Stationery and Office Supplies",
  "description": "Complete range of premium stationery and office supplies",
  "category": "Office Supplies",
  "brand": {
    "@type": "Brand",
    "name": "Noor Al Maarifa Trading"
  }
};