import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = false 
}) => {
  const { theme, effectiveTheme, toggleTheme } = useTheme();

  // Get the current effective theme for display
  const isDark = effectiveTheme === 'dark';
  const isSystem = theme === 'system';

  const getThemeLabel = () => {
    if (isSystem) return 'System';
    return isDark ? 'Dark' : 'Light';
  };

  const getAriaLabel = () => {
    if (isSystem) {
      return `Switch theme. Current: System (${effectiveTheme}). Click to toggle.`;
    }
    return `Switch to ${isDark ? 'light' : 'dark'} theme. Current: ${getThemeLabel()}`;
  };

  return (
    <div className={`${styles.themeToggle} ${className}`}>
      <button
        className={`${styles.themeToggleButton} ${isDark ? styles.dark : styles.light} ${isSystem ? styles.system : ''}`}
        onClick={toggleTheme}
        title={getAriaLabel()}
        aria-label={getAriaLabel()}
        role="switch"
        aria-checked={isDark}
      >
        <div className={styles.iconContainer}>
          {/* Sun Icon */}
          <Sun 
            size={16} 
            className={`${styles.sunIcon} ${!isDark ? styles.active : ''}`}
            aria-hidden="true"
          />
          
          {/* Moon Icon */}
          <Moon 
            size={16} 
            className={`${styles.moonIcon} ${isDark ? styles.active : ''}`}
            aria-hidden="true"
          />
          
          {/* System indicator */}
          {isSystem && (
            <Monitor 
              size={12} 
              className={styles.systemIcon}
              aria-hidden="true"
            />
          )}
        </div>
        
        {showLabel && (
          <span className={styles.themeLabel}>
            {getThemeLabel()}
          </span>
        )}
        
        {/* Animated background slider */}
        <div 
          className={`${styles.slider} ${isDark ? styles.sliderDark : styles.sliderLight}`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
};