import React from 'react';
import styles from './AboutPage.module.css';

export const AboutPage: React.FC = () => {
  return (
    <div className={styles.aboutPage}>
      <div className="container">
        <div className={styles.hero}>
          <h1 className={styles.title}>About Noor Al Maarifa Trading</h1>
          <p className={styles.subtitle}>
            Your trusted partner for premium stationery and office supplies in Dubai, UAE
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2>Our Story</h2>
            <p>
              Noor Al Maarifa Trading L.L.C has been serving the Dubai business community 
              with high-quality stationery and office supplies. We understand the importance 
              of reliable office materials for business success.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Our Mission</h2>
            <p>
              To provide businesses and individuals with premium stationery products 
              and exceptional service, supporting productivity and creativity in every workspace.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <i className="fas fa-star"></i>
              </div>
              <h3>Quality</h3>
              <p>Premium products from trusted brands</p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h3>Reliability</h3>
              <p>Fast delivery and consistent service</p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <i className="fas fa-heart"></i>
              </div>
              <h3>Service</h3>
              <p>Customer satisfaction is our priority</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;