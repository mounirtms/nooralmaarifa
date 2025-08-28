import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleEmailClick = () => {
    window.location.href = 'mailto:sales@nooralmaarifa.com';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+971555505618';
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
                <h3 className={styles.logoText}>Noor Al Maarifa Trading</h3>
              </div>
              <p className={styles.companyDescription}>
                Premium Stationery & Office Supplies
              </p>
              <p className={styles.companyDescriptionAr}>
                لوازم قرطاسية ومكتب عالية الجودة
              </p>
            </div>

            {/* Quick Links */}
            <div className={styles.footerSection}>
              <h4 className={styles.sectionTitle}>Quick Links</h4>
              <ul className={styles.footerLinks}>
                <li><Link to="/" className={styles.footerLink}>Home</Link></li>
                <li><Link to="/about" className={styles.footerLink}>About</Link></li>
                <li><Link to="/services" className={styles.footerLink}>Services</Link></li>
                <li><Link to="/products" className={styles.footerLink}>Products</Link></li>
                <li><Link to="/contact" className={styles.footerLink}>Contact</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className={styles.footerSection}>
              <h4 className={styles.sectionTitle}>Contact</h4>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <MapPin />
                  <span>Al Ras, Dubai, UAE</span>
                </div>
                <button className={styles.contactItem} onClick={handlePhoneClick}>
                  <Phone />
                  <span>+971 555 505 618</span>
                </button>
                <button className={styles.contactItem} onClick={handleEmailClick}>
                  <Mail />
                  <span>sales@nooralmaarifa.com</span>
                </button>
              </div>
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
                  <img src="/images/logo_techno.png" alt="Techno Stationery" />
                </div>
                <div className={styles.technoInfo}>
                  <h5>Techno Stationery</h5>
                </div>
                <i className="fas fa-external-link-alt"></i>
              </a>
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
            </div>
          </div>
        </div>
      </div>

      {/* Simple Developer Signature */}
      <div className={styles.developerSignature}>
        <a 
          href="https://bit.ly/mounir1" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.developerLink}
          title="Developed by Mounir"
        >
          <img 
            src="/images/mounir-signature.svg" 
            alt="Mounir" 
            className={styles.developerSvg}
          />
        </a>
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