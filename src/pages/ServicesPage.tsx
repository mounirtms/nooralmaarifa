import React from 'react';
import { useContent } from '@/contexts/ContentContext';
import styles from './ServicesPage.module.css';

export const ServicesPage: React.FC = () => {
  const { services } = useContent();

  return (
    <div className={styles.servicesPage}>
      <div className="container">
        <div className={styles.hero}>
          <h1 className={styles.title}>Our Services | خدماتنا</h1>
          <p className={styles.subtitle}>
            Comprehensive stationery and office supply solutions for your business needs
          </p>
          <p className={`${styles.subtitle} ${styles.arabicText}`}>
            حلول شاملة للقرطاسية ولوازم المكاتب لتلبية احتياجات عملك
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <i className={service.icon}></i>
              </div>
              <h3>{service.title} | {service.titleAr}</h3>
              <p>{service.description}</p>
              <p className={styles.arabicText}>{service.descriptionAr}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;