import React from 'react';
import { motion } from 'framer-motion';
import { useGallery } from '@/contexts/GalleryContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import type { GalleryImage } from '@/types';
import styles from './GalleryPage.module.css';

export const GalleryPage: React.FC = () => {
  const { images, loading } = useGallery();

  // Sample images if none loaded from Firebase
  const sampleImages = [
    { id: '1', url: '/images/products (7).jpeg', title: 'Office Setup', category: 'office' },
    { id: '2', url: '/images/products (8).jpeg', title: 'Stationery Collection', category: 'products' },
    { id: '3', url: '/images/products (9).jpeg', title: 'Writing Tools', category: 'products' },
    { id: '4', url: '/images/stand.jpg', title: 'Exhibition Stand', category: 'events' },
    { id: '5', url: '/images/stand1.jpg', title: 'Trade Show', category: 'events' },
    { id: '6', url: '/images/techno_stand.jpeg', title: 'Product Display', category: 'showcases' }
  ];

  const displayImages = images.length > 0 ? images : sampleImages;

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className={styles.galleryPage}>
      <section className={styles.headerSection}>
        <div className="container">
          <h1>Our Gallery | معرض الصور</h1>
          <p>Explore our products and showcase moments</p>
          <p className={styles.arabicText}>استكشف منتجاتنا ولحظات العرض</p>
        </div>
      </section>

      <section className={styles.gallerySection}>
        <div className="container">
          <div className={styles.imageGrid}>
            {displayImages.map((image: GalleryImage, index: number) => (
              <motion.div
                key={image.id}
                className={styles.imageCard}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.imageWrapper}>
                  <ImageWithFallback
                    src={image.url}
                    alt={image.title}
                    fallbackSrc={(image as any).fallbackUrl || '/images/LOGOICON.png'}
                    className={styles.galleryImage}
                  />
                  <div className={styles.imageOverlay}>
                    <h3 className={styles.imageTitle}>{image.title}</h3>
                    <span className={styles.imageCategory}>{image.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};