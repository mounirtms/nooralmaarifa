import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Theme, EffectiveTheme, ThemeContextType } from '@/types';
import {
  getStoredTheme,
  storeTheme,
  calculateEffectiveTheme,
  applyThemeToDocument,
  createSystemThemeListener,
} from '@/utils/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() => 
    calculateEffectiveTheme(getStoredTheme())
  );

  // Update effective theme when theme changes
  useEffect(() => {
    const newEffectiveTheme = calculateEffectiveTheme(theme);
    setEffectiveTheme(newEffectiveTheme);
    applyThemeToDocument(newEffectiveTheme);
  }, [theme]);

  // Listen for system theme changes when using system theme
  useEffect(() => {
    if (theme !== 'system') return;

    const cleanup = createSystemThemeListener((isDark) => {
      const newEffectiveTheme = isDark ? 'dark' : 'light';
      setEffectiveTheme(newEffectiveTheme);
      applyThemeToDocument(newEffectiveTheme);
    });

    return cleanup || undefined;
  }, [theme]);

  // Apply theme on initial load
  useEffect(() => {
    applyThemeToDocument(effectiveTheme);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    storeTheme(newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'system') {
      // If currently system, switch to opposite of current effective theme
      setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const value: ThemeContextType = {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};