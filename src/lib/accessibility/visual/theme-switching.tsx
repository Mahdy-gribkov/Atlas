/**
 * Theme Switching Component
 * 
 * Provides theme switching controls for light/dark mode accessibility.
 * Implements WCAG 2.1 AA color contrast requirements and user preferences.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';
import { useDarkModePreference } from '../core/accessibility-hooks';

// Theme Switching Variants
const themeSwitchingVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      theme: {
        light: 'bg-white text-black border-gray-200',
        dark: 'bg-gray-900 text-white border-gray-700',
        auto: 'bg-white text-black border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-700',
        highContrast: 'bg-white text-black border-black dark:bg-black dark:text-white dark:border-white',
        sepia: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900 dark:text-amber-50 dark:border-amber-700'
      },
      mode: {
        light: 'theme-light',
        dark: 'theme-dark',
        auto: 'theme-auto',
        highContrast: 'theme-high-contrast',
        sepia: 'theme-sepia'
      },
      transition: {
        smooth: 'transition-all duration-300 ease-in-out',
        instant: 'transition-none',
        slow: 'transition-all duration-500 ease-in-out',
        fast: 'transition-all duration-150 ease-in-out'
      }
    },
    defaultVariants: {
      theme: 'auto',
      mode: 'auto',
      transition: 'smooth'
    }
  }
);

// Theme Switching Toggle Props
interface ThemeSwitchingToggleProps extends VariantProps<typeof themeSwitchingVariants> {
  className?: string;
  onToggle?: (theme: string) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Theme Switching Toggle Component
export const ThemeSwitchingToggle = React.forwardRef<HTMLButtonElement, ThemeSwitchingToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [currentTheme, setCurrentTheme] = useState(config.visual.theme);
    const systemDarkMode = useDarkModePreference();

    const themes = [
      { value: 'light', label: 'Light', icon: '☀️' },
      { value: 'dark', label: 'Dark', icon: '🌙' },
      { value: 'auto', label: 'Auto', icon: '🔄' },
      { value: 'highContrast', label: 'High Contrast', icon: '⚡' },
      { value: 'sepia', label: 'Sepia', icon: '📜' }
    ];

    const handleThemeChange = useCallback((newTheme: string) => {
      setCurrentTheme(newTheme as any);
      
      updateConfig({
        visual: {
          theme: newTheme as any
        }
      });
      
      onToggle?.(newTheme);
    }, [updateConfig, onToggle]);

    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg'
    };

    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };

    const currentThemeConfig = themes.find(t => t.value === currentTheme) || themes[0];

    return (
      <button
        ref={ref}
        className={cn(
          'fixed z-50 flex items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500',
          sizeClasses[size],
          positionClasses[position],
          themeSwitchingVariants({ theme: currentTheme }),
          className
        )}
        onClick={() => {
          const currentIndex = themes.findIndex(t => t.value === currentTheme);
          const nextIndex = (currentIndex + 1) % themes.length;
          handleThemeChange(themes[nextIndex].value);
        }}
        aria-label={`Switch theme to ${currentThemeConfig.label}`}
        aria-pressed={currentTheme !== 'auto'}
        {...props}
      >
        <span className="text-lg">{currentThemeConfig.icon}</span>
        {showLabel && (
          <span className="sr-only">
            Current theme: {currentThemeConfig.label}
          </span>
        )}
      </button>
    );
  }
);

ThemeSwitchingToggle.displayName = 'ThemeSwitchingToggle';

// Theme Switching Selector Props
interface ThemeSwitchingSelectorProps extends VariantProps<typeof themeSwitchingVariants> {
  className?: string;
  onThemeChange?: (theme: string) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Theme Switching Selector Component
export const ThemeSwitchingSelector = React.forwardRef<HTMLDivElement, ThemeSwitchingSelectorProps>(
  ({ 
    className, 
    onThemeChange, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [currentTheme, setCurrentTheme] = useState(config.visual.theme);

    const themes = [
      { value: 'light', label: 'Light', description: 'Bright theme for daytime use', icon: '☀️' },
      { value: 'dark', label: 'Dark', description: 'Dark theme for nighttime use', icon: '🌙' },
      { value: 'auto', label: 'Auto', description: 'Follows system preference', icon: '🔄' },
      { value: 'highContrast', label: 'High Contrast', description: 'High contrast for accessibility', icon: '⚡' },
      { value: 'sepia', label: 'Sepia', description: 'Warm sepia tone for reading', icon: '📜' }
    ];

    const handleThemeChange = useCallback((newTheme: string) => {
      setCurrentTheme(newTheme as any);
      
      updateConfig({
        visual: {
          theme: newTheme as any
        }
      });
      
      onThemeChange?.(newTheme);
    }, [updateConfig, onThemeChange]);

    const sizeClasses = {
      sm: 'w-48',
      md: 'w-56',
      lg: 'w-64'
    };

    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col gap-2 p-3 bg-white border-2 border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600',
          sizeClasses[size],
          positionClasses[position],
          className
        )}
        {...props}
      >
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme
          </span>
        )}
        
        <div className="flex flex-col gap-1">
          {themes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => handleThemeChange(theme.value)}
              className={cn(
                'w-full px-2 py-1 text-xs rounded transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
                currentTheme === theme.value 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 dark:text-gray-300'
              )}
              aria-label={`Set theme to ${theme.label}`}
              aria-pressed={currentTheme === theme.value}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{theme.icon}</span>
                <div className="flex flex-col">
                  <div className="font-medium">{theme.label}</div>
                  <div className="text-xs opacity-80">{theme.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

ThemeSwitchingSelector.displayName = 'ThemeSwitchingSelector';

// Theme Switching Provider Props
interface ThemeSwitchingProviderProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'light' | 'dark' | 'auto' | 'highContrast' | 'sepia';
  transition?: 'smooth' | 'instant' | 'slow' | 'fast';
  applyToBody?: boolean;
}

// Theme Switching Provider Component
export const ThemeSwitchingProvider = React.forwardRef<HTMLDivElement, ThemeSwitchingProviderProps>(
  ({ 
    children, 
    className, 
    theme = 'auto', 
    transition = 'smooth',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentTheme, setCurrentTheme] = useState(config.visual.theme);
    const systemDarkMode = useDarkModePreference();

    useEffect(() => {
      setCurrentTheme(config.visual.theme);
    }, [config.visual.theme]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing theme classes
        document.body.classList.remove(
          'theme-light',
          'theme-dark',
          'theme-auto',
          'theme-high-contrast',
          'theme-sepia'
        );
        
        // Apply new theme
        if (currentTheme === 'auto') {
          document.body.classList.add(systemDarkMode ? 'theme-dark' : 'theme-light');
        } else {
          document.body.classList.add(`theme-${currentTheme}`);
        }
      }
    }, [currentTheme, applyToBody, systemDarkMode]);

    return (
      <div
        ref={ref}
        className={cn(
          themeSwitchingVariants({ theme: currentTheme, transition }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ThemeSwitchingProvider.displayName = 'ThemeSwitchingProvider';

// Theme Switching Text Component
interface ThemeSwitchingTextProps extends VariantProps<typeof themeSwitchingVariants> {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  theme?: 'light' | 'dark' | 'auto' | 'highContrast' | 'sepia';
}

export const ThemeSwitchingText = React.forwardRef<HTMLElement, ThemeSwitchingTextProps>(
  ({ children, className, as: Component = 'span', theme, ...props }, ref) => {
    const { config } = useAccessibility();
    const currentTheme = theme || config.visual.theme;

    return (
      <Component
        ref={ref as any}
        className={cn(
          themeSwitchingVariants({ theme: currentTheme }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ThemeSwitchingText.displayName = 'ThemeSwitchingText';

// Theme Switching Button Component
interface ThemeSwitchingButtonProps extends VariantProps<typeof themeSwitchingVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  theme?: 'light' | 'dark' | 'auto' | 'highContrast' | 'sepia';
}

export const ThemeSwitchingButton = React.forwardRef<HTMLButtonElement, ThemeSwitchingButtonProps>(
  ({ children, className, onClick, disabled, type = 'button', theme, ...props }, ref) => {
    const { config } = useAccessibility();
    const currentTheme = theme || config.visual.theme;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          themeSwitchingVariants({ theme: currentTheme }),
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ThemeSwitchingButton.displayName = 'ThemeSwitchingButton';

// Theme Switching Card Component
interface ThemeSwitchingCardProps extends VariantProps<typeof themeSwitchingVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  theme?: 'light' | 'dark' | 'auto' | 'highContrast' | 'sepia';
}

export const ThemeSwitchingCard = React.forwardRef<HTMLDivElement, ThemeSwitchingCardProps>(
  ({ children, className, title, description, theme, ...props }, ref) => {
    const { config } = useAccessibility();
    const currentTheme = theme || config.visual.theme;

    return (
      <div
        ref={ref}
        className={cn(
          'p-6 rounded-lg border-2 shadow-lg transition-all duration-300',
          themeSwitchingVariants({ theme: currentTheme }),
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="font-semibold mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="opacity-80 mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    );
  }
);

ThemeSwitchingCard.displayName = 'ThemeSwitchingCard';

// Theme Switching Status Component
interface ThemeSwitchingStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ThemeSwitchingStatus = React.forwardRef<HTMLDivElement, ThemeSwitchingStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const currentTheme = config.visual.theme;
    const systemDarkMode = useDarkModePreference();

    const themeMap = {
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto',
      highContrast: 'High Contrast',
      sepia: 'Sepia'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span className="font-medium">
          Theme: {themeMap[currentTheme]}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {currentTheme === 'auto' && `System preference: ${systemDarkMode ? 'Dark' : 'Light'}`}
            {currentTheme === 'light' && 'Bright theme for daytime use'}
            {currentTheme === 'dark' && 'Dark theme for nighttime use'}
            {currentTheme === 'highContrast' && 'High contrast for accessibility'}
            {currentTheme === 'sepia' && 'Warm sepia tone for reading'}
          </div>
        )}
      </div>
    );
  }
);

ThemeSwitchingStatus.displayName = 'ThemeSwitchingStatus';

// Export all components
export {
  themeSwitchingVariants,
  type ThemeSwitchingToggleProps,
  type ThemeSwitchingSelectorProps,
  type ThemeSwitchingProviderProps,
  type ThemeSwitchingTextProps,
  type ThemeSwitchingButtonProps,
  type ThemeSwitchingCardProps,
  type ThemeSwitchingStatusProps
};
