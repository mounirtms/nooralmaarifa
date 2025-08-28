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
                  <p>Al Ras, Dubai, United Arab Emirates</p>
                  <p className={styles.arabicText}>الرس، دبي، الإمارات العربية المتحدة</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <i className="fas fa-phone"></i>
                <div>
                  <h3>Phone</h3>
                  <p>+971 555 505 618</p>
                  <p className={styles.arabicText}>اتصل بنا</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p>sales@nooralmaarifa.com</p>
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

              {/* Google Maps */}
              <div className={styles.mapSection}>
                <h3>Find Us | موقعنا</h3>
                <div className={styles.mapContainer}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.5982977463934!2d55.29534821501504!3d25.267652083898654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0x1d4ca78ba1a2d8f!2sAl%20Ras%2C%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1697123456789!5m2!1sen!2s"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Noor Al Maarifa Trading Location"
                  ></iframe>
                </div>
                <a 
                  href="https://maps.app.goo.gl/iaHvqhK9RMYfXtt79?g_st=aw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  View on Google Maps
                </a>
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