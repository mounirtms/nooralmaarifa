import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import styles from './Footer.module.css';

interface QuickLink {
  path: string;
  label: string;
  labelAr: string;
}

const quickLinks: QuickLink[] = [
  { path: '/', label: 'Home', labelAr: 'الرئيسية' },
  { path: '/about', label: 'About', labelAr: 'عن الشركة' },
  { path: '/services', label: 'Services', labelAr: 'خدماتنا' },
  { path: '/products', label: 'Products', labelAr: 'المنتجات' },
  { path: '/gallery', label: 'Gallery', labelAr: 'معرض الصور' },
  { path: '/contact', label: 'Contact', labelAr: 'تواصل' },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGlow} />

      {/* Main Footer Content */}
      <div className={styles.footerMain}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Company Info */}
            <div className={styles.footerSection}>
              <div className={styles.footerLogo}>
                <ImageWithFallback
                  src="/images/LOGOICON.png"
                  alt="Noor Al Maarifa Trading"
                  className={styles.logoImg}
                />
                <h3 className={styles.logoText}>Noor Al Maarifa</h3>
              </div>
              <p className={styles.companyDescription}>
                Premium Stationery & Office Supplies
              </p>
              <p className={styles.companyDescriptionAr}>
                لوازم قرطاسية ومكتب عالية الجودة
              </p>
              <p className={styles.tagline}>
                Your trusted partner for quality stationery and office supplies across Dubai & the UAE.
              </p>
            </div>

            {/* Quick Links */}
            <div className={styles.footerSection}>
              <h4 className={styles.sectionTitle}>Quick Links</h4>
              <ul className={styles.footerLinks}>
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className={styles.footerLink}>
                      <span className={styles.linkArrow} />
                      <span>{link.label}</span>
                      <span className={styles.linkLabelAr}>| {link.labelAr}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className={styles.footerSection}>
              <h4 className={styles.sectionTitle}>Contact</h4>
              <ul className={styles.contactInfo}>
                <li className={styles.contactItem}>
                  <MapPin size={16} />
                  <span>Al Ras, Dubai, UAE</span>
                </li>
                <li>
                  <a href="tel:+971555505618" className={styles.contactItem}>
                    <Phone size={16} />
                    <span>+971 555 505 618</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:sales@nooralmaarifa.com" className={styles.contactItem}>
                    <Mail size={16} />
                    <span>sales@nooralmaarifa.com</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Partner Store */}
            <div className={styles.footerSection}>
              <h4 className={styles.sectionTitle}>Store</h4>
              <a
                href="https://technostationery.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.technoLink}
              >
                <div className={styles.technoLogo}>
                  <ImageWithFallback src="/images/logo_techno.png" alt="Techno Stationery" />
                </div>
                <div className={styles.technoInfo}>
                  <h5>Techno Stationery</h5>
                  <span>Visit our online store</span>
                </div>
                <i className="fas fa-external-link-alt" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.footerBottomContent}>
            <p className={styles.copyright}>
              © {currentYear} Noor Al Maarifa Trading L.L.C. All rights reserved.
            </p>

            <a
              href="https://mounir1.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.developerLink}
              title="Developed by Mounir Abderrahmani"
            >
              <span className={styles.developerText}>Developed by</span>
              <img
                src="/images/mounir-signature.svg"
                alt="Mounir Abderrahmani"
                className={styles.developerSvg}
              />
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        className={styles.backToTop}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ChevronUp size={20} />
      </button>
    </footer>
  );
};