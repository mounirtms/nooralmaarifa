import React, { Component, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>
              <span className={styles.errorTitleEn}>Something went wrong</span>
              <span className={styles.errorTitleAr}>حدث خطأ ما</span>
            </h2>
            <p className={styles.errorMessage}>
              <span className={styles.errorMessageEn}>
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </span>
              <span className={styles.errorMessageAr}>
                نعتذر، لكن حدث شيء غير متوقع. يرجى تحديث الصفحة.
              </span>
            </p>
            <button 
              className={styles.refreshButton}
              onClick={() => window.location.reload()}
            >
              <span className={styles.buttonTextEn}>Refresh Page</span>
              <span className={styles.buttonTextAr}>تحديث الصفحة</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}