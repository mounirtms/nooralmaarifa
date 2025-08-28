import React from 'react';
import { useContent } from '@/contexts/ContentContext';
import styles from './AboutPage.module.css';

export const AboutPage: React.FC = () => {
  const { companyInfo, aboutFeatures } = useContent();

  return (
    <div className={styles.aboutPage}>
      <div className="container">
        <div className={styles.hero}>
          <h1 className={styles.title}>{companyInfo.name} | {companyInfo.nameAr}</h1>
          <p className={styles.subtitle}>
            {companyInfo.description}
          </p>
          <p className={`${styles.subtitle} ${styles.arabicText}`}>
            {companyInfo.descriptionAr}
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2>Our Mission | مهمتنا</h2>
            <p>{companyInfo.mission}</p>
            <p className={`${styles.arabicText} ${styles.arabicSection}`}>
              {companyInfo.missionAr}
            </p>
          </div>

          <div className={styles.section}>
            <h2>Our Vision | رؤيتنا</h2>
            <p>{companyInfo.vision}</p>
            <p className={`${styles.arabicText} ${styles.arabicSection}`}>
              {companyInfo.visionAr}
            </p>
          </div>

          <div className={styles.features}>
            <h2>Why Choose Us | لماذا تختارنا</h2>
            <div className={styles.featuresGrid}>
              {aboutFeatures.map((feature) => (
                <div key={feature.id} className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <i className={feature.icon}></i>
                  </div>
                  <h3>{feature.title} | {feature.titleAr}</h3>
                  <p>{feature.description}</p>
                  <p className={styles.arabicText}>{feature.descriptionAr}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};