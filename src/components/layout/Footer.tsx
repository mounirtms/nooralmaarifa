import React from 'react';
import { Link } from 'react-router-dom';
import { downloadCatalog } from '@/utils';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@nooralmaarifa.com';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+971501234567';
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      {/* Main Footer Content */}
      <div className={styles.footerMain}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Company Info */}
            <div className={styles.footerSection}>
              <div className={styles.footerLogo}>
                <img 
                  src="/images/LOGOICON.png" 
                  alt="Noor Al Maarifa Trading" 
                  className={styles.logoImg}
                />
                <h3 className={styles.logoText}>Noor Al Maarifa Trading L.L.C</h3>
              </div>
              <p className={styles.companyDescription}>
                Your trusted partner for premium stationery and office supplies across Dubai and UAE. 
                Quality products for businesses and professionals.
              </p>
              <p className={styles.companyDescriptionAr}>
                شريكك الموثوق لتوفير لوازم القرطاسية والمكاتب عالية الجودة في دبي والإمارات. 
                منتجات متميزة للشركات والمهنيين.
              </p>
              
              {/* Social Links */}
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink} aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className={styles.socialLink} aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className={styles.socialLink} aria-label="WhatsApp">
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.footerSection}>
              <h4 className={styles.sectionTitle}>Quick Links | روابط سريعة</h4>
              <ul className={styles.footerLinks}>
                <li><Link to="/" className={styles.footerLink}>Home | الرئيسية</Link></li>
                <li><Link to="/about" className={styles.footerLink}>About Us | عن الشركة</Link></li>
                <li><Link to="/services" className={styles.footerLink}>Services | خدماتنا</Link></li>
                <li><Link to="/products" className={styles.footerLink}>Products | المنتجات</Link></li>
                <li><Link to="/gallery" className={styles.footerLink}>Gallery | المعرض</Link></li>
                <li><Link to="/contact" className={styles.footerLink}>Contact | تواصل</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className={styles.footerSection}>
              <h4 className={styles.sectionTitle}>Our Services | خدماتنا</h4>
              <ul className={styles.footerLinks}>
                <li><span className={styles.footerLink}>Office Supplies | لوازم مكتبية</span></li>
                <li><span className={styles.footerLink}>Stationery | قرطاسية</span></li>
                <li><span className={styles.footerLink}>Writing Instruments | أدوات كتابة</span></li>
                <li><span className={styles.footerLink}>Paper Products | منتجات ورقية</span></li>
                <li><span className={styles.footerLink}>Art Supplies | لوازم فنية</span></li>
                <li>
                  <button 
                    onClick={downloadCatalog}
                    className={styles.catalogLink}
                  >
                    <i className="fas fa-download"></i>
                    Download Catalog | تحميل الكتالوج
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className={styles.footerSection}>
              <h4 className={styles.sectionTitle}>Contact Us | تواصل معنا</h4>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <p>Dubai, United Arab Emirates</p>
                    <p className={styles.contactArabic}>دبي، الإمارات العربية المتحدة</p>
                  </div>
                </div>
                
                <button className={styles.contactItem} onClick={handlePhoneClick}>
                  <i className="fas fa-phone"></i>
                  <div>
                    <p>+971 50 123 4567</p>
                    <p className={styles.contactArabic}>اتصل بنا</p>
                  </div>
                </button>
                
                <button className={styles.contactItem} onClick={handleEmailClick}>
                  <i className="fas fa-envelope"></i>
                  <div>
                    <p>info@nooralmaarifa.com</p>
                    <p className={styles.contactArabic}>راسلنا إلكترونياً</p>
                  </div>
                </button>
                
                <div className={styles.contactItem}>
                  <i className="fas fa-clock"></i>
                  <div>
                    <p>Sun - Thu: 9:00 AM - 6:00 PM</p>
                    <p className={styles.contactArabic}>الأحد - الخميس: 9 صباحاً - 6 مساءً</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.footerBottomContent}>
            <div className={styles.copyright}>
              <p>
                © {currentYear} Noor Al Maarifa Trading L.L.C. All rights reserved.
              </p>
              <p className={styles.copyrightArabic}>
                © {currentYear} شركة نور المعرفة للتجارة ذ.م.م. جميع الحقوق محفوظة.
              </p>
            </div>
            
            {/* Developer Signature */}
            <div className={styles.developerSignature}>
              <p className={styles.developedBy}>Developed by</p>
              <a 
                href="https://mounir1.github.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.developerLink}
              >
                <div className={styles.developerIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H3C1.9 1 1 1.9 1 3V21C1 22.1 1.9 23 3 23H21C22.1 23 23 22.1 23 21V9H21ZM15 3.5L19.5 8H15V3.5ZM12 8C14.8 8 17 10.2 17 13S14.8 18 12 18 7 15.8 7 13 9.2 8 12 8ZM12 10C10.3 10 9 11.3 9 13S10.3 16 12 16 15 14.7 15 13 13.7 10 12 10Z"/>
                  </svg>
                </div>
                <span className={styles.developerName}>MAB</span>
                <div className={styles.developerBadge}>Dev</div>
                <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        className={styles.backToTop}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <i className="fas fa-chevron-up"></i>
      </button>
    </footer>
  );
};