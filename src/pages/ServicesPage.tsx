import React from 'react';
import styles from './ServicesPage.module.css';

export const ServicesPage: React.FC = () => {
  return (
    <div className={styles.servicesPage}>
      <div className="container">
        <div className={styles.hero}>
          <h1 className={styles.title}>Our Services</h1>
          <p className={styles.subtitle}>
            Comprehensive stationery and office supply solutions for your business needs
          </p>
        </div>

        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <i className="fas fa-truck"></i>
            </div>
            <h3>Delivery Services</h3>
            <p>Fast and reliable delivery of office supplies across Dubai and UAE</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <i className="fas fa-handshake"></i>
            </div>
            <h3>Corporate Solutions</h3>
            <p>Bulk orders and customized solutions for businesses and organizations</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <i className="fas fa-cogs"></i>
            </div>
            <h3>Custom Orders</h3>
            <p>Specialized stationery products tailored to your specific requirements</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <i className="fas fa-users"></i>
            </div>
            <h3>Consultation</h3>
            <p>Expert advice on office setup and stationery management solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;