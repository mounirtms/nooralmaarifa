import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import {
  getSystemTheme,
  getStoredTheme,
  calculateEffectiveTheme,
  getNextTheme,
  supportsThemeDetection,
} from '@/utils/theme';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
const matchMediaMock = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  value: matchMediaMock,
});

// Test component to access theme context
const ThemeTestComponent = () => {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="effective-theme">{effectiveTheme}</div>
      <button data-testid="set-light" onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>
        Set Dark
      </button>
      <button data-testid="set-system" onClick={() => setTheme('system')}>
        Set System
      </button>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

describe('Theme System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Theme Utilities', () => {
    it('should detect system theme correctly', () => {
      matchMediaMock.mockReturnValue({ matches: true });
      expect(getSystemTheme()).toBe('dark');

      matchMediaMock.mockReturnValue({ matches: false });
      expect(getSystemTheme()).toBe('light');
    });

    it('should get stored theme or default to system', () => {
      expect(getStoredTheme()).toBe('system');

      localStorageMock.getItem.mockReturnValue('dark');
      expect(getStoredTheme()).toBe('dark');

      localStorageMock.getItem.mockReturnValue('invalid');
      expect(getStoredTheme()).toBe('system');
    });

    it('should calculate effective theme correctly', () => {
      expect(calculateEffectiveTheme('light')).toBe('light');
      expect(calculateEffectiveTheme('dark')).toBe('dark');

      matchMediaMock.mockReturnValue({ matches: true });
      expect(calculateEffectiveTheme('system')).toBe('dark');

      matchMediaMock.mockReturnValue({ matches: false });
      expect(calculateEffectiveTheme('system')).toBe('light');
    });

    it('should cycle through themes correctly', () => {
      expect(getNextTheme('light')).toBe('dark');
      expect(getNextTheme('dark')).toBe('system');
      expect(getNextTheme('system')).toBe('light');
    });

    it('should detect theme support correctly', () => {
      expect(supportsThemeDetection()).toBe(true);

      delete (window as any).matchMedia;
      expect(supportsThemeDetection()).toBe(false);
    });
  });

  describe('ThemeProvider', () => {
    it('should provide default theme context', () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('light');
    });

    it('should allow theme changes', () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('set-dark'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('dark');

      fireEvent.click(screen.getByTestId('set-light'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('light');
    });

    it('should persist theme changes', () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('set-dark'));
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'noor-al-maarifa-theme',
        'dark'
      );
    });

    it('should toggle themes correctly', () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      // Start with system (effective: light), toggle should go to dark
      fireEvent.click(screen.getByTestId('toggle-theme'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

      // From dark to light
      fireEvent.click(screen.getByTestId('toggle-theme'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

      // From light to dark
      fireEvent.click(screen.getByTestId('toggle-theme'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
  });

  describe('ThemeToggle Component', () => {
    it('should render theme toggle button', () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('switch');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('aria-checked');
    });

    it('should render with label when showLabel is true', () => {
      render(
        <ThemeProvider>
          <ThemeToggle showLabel={true} />
        </ThemeProvider>
      );

      expect(screen.getByText('System')).toBeInTheDocument();
    });

    it('should cycle themes when clicked', () => {
      render(
        <ThemeProvider>
          <ThemeToggle showLabel={true} />
          <ThemeTestComponent />
        </ThemeProvider>
      );

      const button = screen.getByLabelText(/Switch theme/);
      
      // Should start with system
      expect(screen.getByText('System')).toBeInTheDocument();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');

      // Click to toggle theme (system -> opposite of effective theme)
      fireEvent.click(button);
      const firstTheme = screen.getByTestId('current-theme').textContent;
      expect(['light', 'dark']).toContain(firstTheme);
      
      // Click to toggle theme (should switch to the other theme)
      fireEvent.click(button);
      const secondTheme = screen.getByTestId('current-theme').textContent;
      expect(['light', 'dark']).toContain(secondTheme);
      expect(secondTheme).not.toBe(firstTheme);
      
      // Verify the label matches the theme
      if (secondTheme === 'light') {
        expect(screen.getByText('Light')).toBeInTheDocument();
      } else {
        expect(screen.getByText('Dark')).toBeInTheDocument();
      }
    });
  });

  describe('Error Handling', () => {
    it('should throw error when useTheme is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<ThemeTestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');
      
      consoleSpy.mockRestore();
    });
  });
});