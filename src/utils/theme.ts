import type { Theme, EffectiveTheme, ThemeConfig } from '@/types';

export const THEME_STORAGE_KEY = 'noor-al-maarifa-theme';

/**
 * Get the system's preferred color scheme
 */
export const getSystemTheme = (): EffectiveTheme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

/**
 * Get the stored theme preference or default to system
 */
export const getStoredTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as Theme;
    }
  }
  return 'system';
};

/**
 * Store theme preference in localStorage
 */
export const storeTheme = (theme: Theme): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
};

/**
 * Calculate the effective theme based on theme setting
 */
export const calculateEffectiveTheme = (theme: Theme): EffectiveTheme => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

/**
 * Apply theme to document element
 */
export const applyThemeToDocument = (effectiveTheme: EffectiveTheme): void => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    
    // Also update classes for backward compatibility
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }
};

/**
 * Get the next theme in the cycle (light -> dark -> system -> light)
 */
export const getNextTheme = (currentTheme: Theme): Theme => {
  const themes: Theme[] = ['light', 'dark', 'system'];
  const currentIndex = themes.indexOf(currentTheme);
  return themes[(currentIndex + 1) % themes.length];
};

/**
 * Check if the current environment supports theme detection
 */
export const supportsThemeDetection = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.matchMedia === 'function';
};

/**
 * Create a media query listener for system theme changes
 */
export const createSystemThemeListener = (
  callback: (isDark: boolean) => void
): (() => void) | null => {
  if (!supportsThemeDetection()) {
    return null;
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  } 
  // Legacy browsers
  else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }

  return null;
};

/**
 * Default theme configurations
 */
export const defaultThemeConfigs: Record<EffectiveTheme, ThemeConfig> = {
  light: {
    colors: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#f97316',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      info: '#3b82f6',
    },
    shadows: {
      small: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
    },
  },
  dark: {
    colors: {
      primary: '#f8fafc',
      secondary: '#e2e8f0',
      accent: '#fb923c',
      background: '#020617',
      surface: '#0f172a',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      border: '#1e293b',
      error: '#f87171',
      warning: '#fbbf24',
      success: '#34d399',
      info: '#60a5fa',
    },
    shadows: {
      small: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.2)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.25)',
    },
  },
};

/**
 * Generate CSS custom properties from theme config
 */
export const generateThemeCSS = (config: ThemeConfig): string => {
  const cssVars = [
    `--color-primary: ${config.colors.primary};`,
    `--color-secondary: ${config.colors.secondary};`,
    `--color-accent: ${config.colors.accent};`,
    `--color-background: ${config.colors.background};`,
    `--color-surface: ${config.colors.surface};`,
    `--color-text: ${config.colors.text};`,
    `--color-text-secondary: ${config.colors.textSecondary};`,
    `--color-border: ${config.colors.border};`,
    `--color-error: ${config.colors.error};`,
    `--color-warning: ${config.colors.warning};`,
    `--color-success: ${config.colors.success};`,
    `--color-info: ${config.colors.info};`,
    `--shadow-small: ${config.shadows.small};`,
    `--shadow-medium: ${config.shadows.medium};`,
    `--shadow-large: ${config.shadows.large};`,
  ];

  return cssVars.join('\n  ');
};