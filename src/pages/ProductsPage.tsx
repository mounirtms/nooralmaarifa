import React from 'react';
import { motion } from 'framer-motion';
import { downloadCatalog } from '@/utils';
import styles from './ProductsPage.module.css';

export const ProductsPage: React.FC = () => {
  const products = [
    { name: 'Writing Instruments', nameAr: 'أدوات الكتابة', image: '/images/products (1).jpeg' },
    { name: 'Paper Products', nameAr: 'منتجات ورقية', image: '/images/products (2).jpeg' },
    { name: 'Office Equipment', nameAr: 'معدات مكتبية', image: '/images/products (3).jpeg' },
    { name: 'Art Supplies', nameAr: 'لوازم فنية', image: '/images/products (4).jpeg' },
    { name: 'Filing Systems', nameAr: 'أنظمة الأرشفة', image: '/images/products (5).jpeg' },
    { name: 'Calculators', nameAr: 'آلات حاسبة', image: '/images/products (6).jpeg' }
  ];

  return (
    <div className={styles.productsPage}>
      <section className={styles.headerSection}>
        <div className="container">
          <h1>Our Products | منتجاتنا</h1>
          <p>Premium stationery and office supplies for your business needs</p>
          <button onClick={downloadCatalog} className={styles.catalogBtn}>
            <i className="fas fa-download"></i>
            Download Catalog | تحميل الكتالوج
          </button>
        </div>
      </section>

      <section className={styles.productsSection}>
        <div className="container">
          <div className={styles.productsGrid}>
            {products.map((product, index) => (
              <motion.div
                key={index}
                className={styles.productCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.nameAr}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};