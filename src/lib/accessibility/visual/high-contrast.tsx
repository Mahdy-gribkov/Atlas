/**
 * High Contrast Component
 * 
 * Provides high contrast mode for improved visibility and accessibility.
 * Implements WCAG 2.1 AA contrast requirements and user preferences.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';
import { useHighContrastMode } from '../core/accessibility-hooks';

// High Contrast Variants
const highContrastVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        light: 'bg-white text-black border-black',
        dark: 'bg-black text-white border-white',
        auto: 'bg-white text-black border-black dark:bg-black dark:text-white dark:border-white',
        high: 'bg-white text-black border-2 border-black dark:bg-black dark:text-white dark:border-white',
        extreme: 'bg-white text-black border-4 border-black dark:bg-black dark:text-white dark:border-white'
      },
      intensity: {
        low: 'contrast-125',
        medium: 'contrast-150',
        high: 'contrast-200',
        extreme: 'contrast-300'
      },
      element: {
        text: 'text-black dark:text-white',
        background: 'bg-white dark:bg-black',
        border: 'border-black dark:border-white',
        button: 'bg-black text-white border-2 border-white hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-black dark:hover:bg-black dark:hover:text-white',
        input: 'bg-white text-black border-2 border-black focus:border-blue-600 dark:bg-black dark:text-white dark:border-white dark:focus:border-blue-400',
        card: 'bg-white text-black border-2 border-black shadow-lg dark:bg-black dark:text-white dark:border-white',
        link: 'text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200'
      }
    },
    defaultVariants: {
      mode: 'auto',
      intensity: 'medium',
      element: 'text'
    }
  }
);

// High Contrast Toggle Props
interface HighContrastToggleProps extends VariantProps<typeof highContrastVariants> {
  className?: string;
  children?: React.ReactNode;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// High Contrast Toggle Component
export const HighContrastToggle = React.forwardRef<HTMLButtonElement, HighContrastToggleProps>(
  ({ 
    className, 
    children, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.visual.highContrast);
    const systemHighContrast = useHighContrastMode();

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        visual: {
          highContrast: newState
        }
      });
      
      onToggle?.(newState);
    }, [isEnabled, updateConfig, onToggle]);

    useEffect(() => {
      setIsEnabled(config.visual.highContrast);
    }, [config.visual.highContrast]);

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

    return (
      <button
        ref={ref}
        className={cn(
          'fixed z-50 flex items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500',
          sizeClasses[size],
          positionClasses[position],
          highContrastVariants({ mode: isEnabled ? 'high' : 'auto' }),
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable high contrast mode' : 'Enable high contrast mode'}
        aria-pressed={isEnabled}
        {...props}
      >
        {children || (
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 border-2 border-current rounded-sm" />
            <div className="w-2 h-2 bg-current rounded-full mt-1" />
          </div>
        )}
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'High contrast mode enabled' : 'High contrast mode disabled'}
          </span>
        )}
      </button>
    );
  }
);

HighContrastToggle.displayName = 'HighContrastToggle';

// High Contrast Provider Props
interface HighContrastProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'light' | 'dark' | 'auto' | 'high' | 'extreme';
  intensity?: 'low' | 'medium' | 'high' | 'extreme';
  applyToBody?: boolean;
}

// High Contrast Provider Component
export const HighContrastProvider = React.forwardRef<HTMLDivElement, HighContrastProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'auto', 
    intensity = 'medium',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const systemHighContrast = useHighContrastMode();
    const [isHighContrast, setIsHighContrast] = useState(
      config.visual.highContrast || systemHighContrast
    );

    useEffect(() => {
      setIsHighContrast(config.visual.highContrast || systemHighContrast);
    }, [config.visual.highContrast, systemHighContrast]);

    useEffect(() => {
      if (applyToBody) {
        if (isHighContrast) {
          document.body.classList.add('high-contrast');
          document.body.style.filter = `contrast(${intensity === 'low' ? '1.25' : intensity === 'medium' ? '1.5' : intensity === 'high' ? '2' : '3'})`;
        } else {
          document.body.classList.remove('high-contrast');
          document.body.style.filter = '';
        }
      }
    }, [isHighContrast, intensity, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          highContrastVariants({ mode: isHighContrast ? 'high' : mode, intensity }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

HighContrastProvider.displayName = 'HighContrastProvider';

// High Contrast Text Component
interface HighContrastTextProps extends VariantProps<typeof highContrastVariants> {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const HighContrastText = React.forwardRef<HTMLElement, HighContrastTextProps>(
  ({ children, className, as: Component = 'span', ...props }, ref) => {
    const { config } = useAccessibility();
    const systemHighContrast = useHighContrastMode();
    const isHighContrast = config.visual.highContrast || systemHighContrast;

    return (
      <Component
        ref={ref as any}
        className={cn(
          highContrastVariants({ 
            element: 'text',
            mode: isHighContrast ? 'high' : 'auto'
          }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

HighContrastText.displayName = 'HighContrastText';

// High Contrast Button Component
interface HighContrastButtonProps extends VariantProps<typeof highContrastVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const HighContrastButton = React.forwardRef<HTMLButtonElement, HighContrastButtonProps>(
  ({ children, className, onClick, disabled, type = 'button', ...props }, ref) => {
    const { config } = useAccessibility();
    const systemHighContrast = useHighContrastMode();
    const isHighContrast = config.visual.highContrast || systemHighContrast;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          highContrastVariants({ 
            element: 'button',
            mode: isHighContrast ? 'high' : 'auto'
          }),
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

HighContrastButton.displayName = 'HighContrastButton';

// High Contrast Input Component
interface HighContrastInputProps extends VariantProps<typeof highContrastVariants> {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  disabled?: boolean;
  required?: boolean;
}

export const HighContrastInput = React.forwardRef<HTMLInputElement, HighContrastInputProps>(
  ({ className, placeholder, value, onChange, type = 'text', disabled, required, ...props }, ref) => {
    const { config } = useAccessibility();
    const systemHighContrast = useHighContrastMode();
    const isHighContrast = config.visual.highContrast || systemHighContrast;

    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        className={cn(
          'w-full px-3 py-2 rounded-md border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          highContrastVariants({ 
            element: 'input',
            mode: isHighContrast ? 'high' : 'auto'
          }),
          className
        )}
        {...props}
      />
    );
  }
);

HighContrastInput.displayName = 'HighContrastInput';

// High Contrast Card Component
interface HighContrastCardProps extends VariantProps<typeof highContrastVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const HighContrastCard = React.forwardRef<HTMLDivElement, HighContrastCardProps>(
  ({ children, className, title, description, ...props }, ref) => {
    const { config } = useAccessibility();
    const systemHighContrast = useHighContrastMode();
    const isHighContrast = config.visual.highContrast || systemHighContrast;

    return (
      <div
        ref={ref}
        className={cn(
          'p-6 rounded-lg transition-all duration-300',
          highContrastVariants({ 
            element: 'card',
            mode: isHighContrast ? 'high' : 'auto'
          }),
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm opacity-80 mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    );
  }
);

HighContrastCard.displayName = 'HighContrastCard';

// High Contrast Link Component
interface HighContrastLinkProps extends VariantProps<typeof highContrastVariants> {
  children: React.ReactNode;
  href: string;
  className?: string;
  external?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export const HighContrastLink = React.forwardRef<HTMLAnchorElement, HighContrastLinkProps>(
  ({ children, href, className, external, target = '_self', ...props }, ref) => {
    const { config } = useAccessibility();
    const systemHighContrast = useHighContrastMode();
    const isHighContrast = config.visual.highContrast || systemHighContrast;

    return (
      <a
        ref={ref}
        href={href}
        target={external ? '_blank' : target}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cn(
          'transition-all duration-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500',
          highContrastVariants({ 
            element: 'link',
            mode: isHighContrast ? 'high' : 'auto'
          }),
          className
        )}
        {...props}
      >
        {children}
        {external && (
          <span className="sr-only">(opens in new tab)</span>
        )}
      </a>
    );
  }
);

HighContrastLink.displayName = 'HighContrastLink';

// High Contrast Status Component
interface HighContrastStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const HighContrastStatus = React.forwardRef<HTMLDivElement, HighContrastStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const systemHighContrast = useHighContrastMode();
    const isHighContrast = config.visual.highContrast || systemHighContrast;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 transition-all duration-300',
          highContrastVariants({ 
            element: 'card',
            mode: isHighContrast ? 'high' : 'auto'
          }),
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-current" />
        <span className="font-medium">
          High Contrast: {isHighContrast ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {systemHighContrast && 'System preference detected'}
          </div>
        )}
      </div>
    );
  }
);

HighContrastStatus.displayName = 'HighContrastStatus';

// Export all components
export {
  highContrastVariants,
  type HighContrastToggleProps,
  type HighContrastProviderProps,
  type HighContrastTextProps,
  type HighContrastButtonProps,
  type HighContrastInputProps,
  type HighContrastCardProps,
  type HighContrastLinkProps,
  type HighContrastStatusProps
};
