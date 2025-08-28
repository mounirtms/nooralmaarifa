import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  messageAr?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  size = 'medium', 
  message = 'Loading...', 
  messageAr = 'جاري التحميل...',
  fullScreen = false 
}: LoadingSpinnerProps) {
  const containerClass = fullScreen 
    ? `${styles.container} ${styles.fullScreen}` 
    : styles.container;

  return (
    <div className={containerClass}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
      </div>
      
      {(message || messageAr) && (
        <div className={styles.message}>
          <span className={styles.messageEn}>{message}</span>
          <span className={styles.messageAr}>{messageAr}</span>
        </div>
      )}
    </div>
  );
}

// Page loading component specifically for code splitting
export function PageLoadingSpinner() {
  return (
    <LoadingSpinner 
      size="large" 
      message="Loading page..." 
      messageAr="جاري تحميل الصفحة..."
      fullScreen={true}
    />
  );
}

// Component loading spinner for smaller components
export function ComponentLoadingSpinner() {
  return (
    <LoadingSpinner 
      size="small" 
      message="Loading..." 
      messageAr="جاري التحميل..."
    />
  );
}