import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { useContent } from '@/contexts/ContentContext';
import { downloadCatalog, trackPageView, trackCatalogDownload } from '@/utils';
import { updatePageSEO } from '@/utils/seo';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const { ref: heroRef, inView: heroInView } = useScrollAnimation();
  const { ref: aboutRef, inView: aboutInView } = useScrollAnimation();
  const { ref: servicesRef, inView: servicesInView } = useScrollAnimation();
  
  const { services, aboutFeatures, companyInfo } = useContent();
  
  useEffect(() => {
    // Update SEO for homepage
    updatePageSEO({
      title: 'Noor Al Maarifa Trading - Premium Stationery & Office Supplies Dubai UAE',
      description: companyInfo.description || 'Leading supplier of premium stationery, office supplies, and business equipment in Dubai and UAE.',
      keywords: [
        'stationery dubai', 'office supplies uae', 'قرطاسية دبي', 'لوازم مكتبية الإمارات',
        'noor al maarifa', 'نور المعرفة', 'business supplies', 'writing instruments'
      ]
    });
    
    // Track page view
    trackPageView('Homepage');
  }, [companyInfo.description]);
  
  const handleCatalogDownload = () => {
    trackCatalogDownload();
    downloadCatalog();
  };

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section ref={heroRef} className={styles.heroSection}>
        <div className="container">
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.heroText}>
              <motion.h1
                className={styles.heroTitle}
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className={styles.gradientText}>Noor Al Maarifa</span>
                <br />
                Trading L.L.C
              </motion.h1>
              
              <motion.h2
                className={styles.heroTitleArabic}
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                شركة نور المعرفة للتجارة
              </motion.h2>
              
              <motion.p
                className={styles.heroSubtitle}
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Premium Stationery & Office Supplies Across Dubai & UAE
              </motion.p>
              
              <motion.p
                className={styles.heroSubtitleArabic}
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                نقدم لوازم قرطاسية ومكتبية عالية الجودة في كافة أنحاء دبي والإمارات
              </motion.p>
              
              <motion.div
                className={styles.heroButtons}
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link to="/contact" className={`${styles.btn} ${styles.btnRed}`}>
                  Get In Touch | تواصل معنا
                </Link>
                <button onClick={handleCatalogDownload} className={`${styles.btn} ${styles.btnCatalog} ${styles.flashy}`}>
                  <div className={styles.catalogIcon}>
                    <i className="fas fa-download"></i>
                  </div>
                  <div className={styles.catalogText}>
                    <span className={styles.catalogTitle}>Download Catalog 2026</span>
                    <span className={styles.catalogTitleAr}>تحميل كتالوج المنتجات 2026</span>
                    <span className={styles.catalogSubtitle}>Complete Product Guide</span>
                  </div>
                  <div className={styles.catalogBadge}>PDF</div>
                </button>
              </motion.div>
            </div>
            
            <motion.div
              className={styles.heroImage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <img src="/images/LOGONOOR.png" alt="Noor Al Maarifa Trading" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className={styles.aboutSection}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>About Our Company | عن شركتنا</h2>
            <p className={styles.sectionSubtitle}>
              Your trusted partner for quality stationery and office supplies
            </p>
            <p className={styles.sectionSubtitleArabic}>
              شريك موثوق لتوفير لوازم القرطاسية والمكاتب بأعلى جودة
            </p>
          </motion.div>

          <div className={styles.aboutGrid}>
            {aboutFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 30 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.featureIcon}>
                  <i className={feature.icon}></i>
                </div>
                <h3 className={styles.featureTitle}>
                  {feature.title} | {feature.titleAr}
                </h3>
                <p className={styles.featureDescription}>{feature.description}</p>
                <p className={styles.featureDescriptionArabic}>{feature.descriptionAr}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className={styles.servicesSection}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Our Products & Services | منتجاتنا وخدماتنا</h2>
            <p className={styles.sectionSubtitle}>
              Complete range of stationery and office supplies for your business
            </p>
            <p className={styles.sectionSubtitleArabic}>
              مجموعة كاملة من القرطاسية ولوازم المكاتب لأعمالك
            </p>
          </motion.div>

          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <motion.div
                key={index}
                className={styles.serviceCard}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.serviceIcon}>
                  <i className={service.icon}></i>
                </div>
                <h3 className={styles.serviceTitle}>
                  {service.title} | {service.titleAr}
                </h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                <p className={styles.serviceDescriptionArabic}>{service.descriptionAr}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className={styles.servicesAction}
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/products" className={`${styles.btn} ${styles.btnYellow}`}>
              View All Products | عرض جميع المنتجات
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
            <h3 className={styles.ctaTitleArabic}>مستعد للبدء؟</h3>
            <p className={styles.ctaDescription}>
              Contact us today for premium stationery and office supplies that elevate your business.
            </p>
            <p className={styles.ctaDescriptionArabic}>
              اتصل بنا اليوم للحصول على قرطاسية ولوازم مكتبية عالية الجودة ترفع من مستوى أعمالك.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={`${styles.btn} ${styles.btnRed}`}>
                Contact Us | تواصل معنا
              </Link>
              <Link to="/gallery" className={`${styles.btn} ${styles.btnOutline}`}>
                View Gallery | عرض المعرض
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};