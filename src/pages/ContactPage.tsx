import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from '@/hooks';
import { useContact } from '@/contexts/ContactContext';
import styles from './ContactPage.module.css';

export const ContactPage: React.FC = () => {
  const { submitMessage, loading } = useContact();

  const { values, errors, setValue, validateAll, reset } = useForm(
    {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    },
    {
      name: (value) => !value ? 'Name is required' : undefined,
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return undefined;
      },
      message: (value) => !value ? 'Message is required' : undefined
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) return;

    try {
      await submitMessage({
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company,
        message: values.message,
        priority: 'medium'
      });
      reset();
    } catch (error) {
      console.error('Error submitting message:', error);
    }
  };

  return (
    <div className={styles.contactPage}>
      <section className={styles.headerSection}>
        <div className="container">
          <h1>Contact Us | تواصل معنا</h1>
          <p>Get in touch with our team for all your stationery needs</p>
          <p className={styles.arabicText}>تواصل مع فريقنا لجميع احتياجاتك من القرطاسية</p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.contactGrid}>
            {/* Contact Info */}
            <motion.div
              className={styles.contactInfo}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2>Get In Touch | تواصل معنا</h2>
              
              <div className={styles.contactItem}>
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Location</h3>
                  <p>Dubai, United Arab Emirates</p>
                  <p className={styles.arabicText}>دبي، الإمارات العربية المتحدة</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <i className="fas fa-phone"></i>
                <div>
                  <h3>Phone</h3>
                  <p>+971 50 123 4567</p>
                  <p className={styles.arabicText}>اتصل بنا</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p>info@nooralmaarifa.com</p>
                  <p className={styles.arabicText}>راسلنا إلكترونياً</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <i className="fas fa-clock"></i>
                <div>
                  <h3>Business Hours</h3>
                  <p>Sunday - Thursday: 9:00 AM - 6:00 PM</p>
                  <p className={styles.arabicText}>الأحد - الخميس: 9 صباحاً - 6 مساءً</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className={styles.contactForm}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name | الاسم *</label>
                  <input
                    type="text"
                    id="name"
                    value={values.name}
                    onChange={(e) => setValue('name', e.target.value)}
                    className={errors.name ? styles.error : ''}
                  />
                  {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email | البريد الإلكتروني *</label>
                  <input
                    type="email"
                    id="email"
                    value={values.email}
                    onChange={(e) => setValue('email', e.target.value)}
                    className={errors.email ? styles.error : ''}
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone | الهاتف</label>
                  <input
                    type="tel"
                    id="phone"
                    value={values.phone}
                    onChange={(e) => setValue('phone', e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="company">Company | الشركة</label>
                  <input
                    type="text"
                    id="company"
                    value={values.company}
                    onChange={(e) => setValue('company', e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message | الرسالة *</label>
                  <textarea
                    id="message"
                    rows={5}
                    value={values.message}
                    onChange={(e) => setValue('message', e.target.value)}
                    className={errors.message ? styles.error : ''}
                  />
                  {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                </div>

                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send Message | إرسال الرسالة
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};