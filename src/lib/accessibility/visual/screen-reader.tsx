/**
 * Screen Reader Component
 * 
 * Provides screen reader accessibility features and ARIA optimization.
 * Implements WCAG 2.1 AA screen reader requirements and semantic markup.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';
import { screenReaderUtils } from '../core/accessibility-utils';

// Screen Reader Variants
const screenReaderVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        optimized: 'sr-optimized',
        standard: 'sr-standard',
        enhanced: 'sr-enhanced',
        minimal: 'sr-minimal'
      },
        level: {
        basic: 'sr-basic',
        intermediate: 'sr-intermediate',
        advanced: 'sr-advanced',
        expert: 'sr-expert'
      },
      announcement: {
        polite: 'sr-polite',
        assertive: 'sr-assertive',
        off: 'sr-off'
      }
    },
    defaultVariants: {
      mode: 'standard',
      level: 'intermediate',
      announcement: 'polite'
    }
  }
);

// Screen Reader Toggle Props
interface ScreenReaderToggleProps extends VariantProps<typeof screenReaderVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Screen Reader Toggle Component
export const ScreenReaderToggle = React.forwardRef<HTMLButtonElement, ScreenReaderToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.visual.screenReaderOptimized);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        visual: {
          screenReaderOptimized: newState
        }
      });
      
      onToggle?.(newState);
    }, [isEnabled, updateConfig, onToggle]);

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
          isEnabled 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable screen reader optimization' : 'Enable screen reader optimization'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Screen reader optimization enabled' : 'Screen reader optimization disabled'}
          </span>
        )}
      </button>
    );
  }
);

ScreenReaderToggle.displayName = 'ScreenReaderToggle';

// Screen Reader Provider Props
interface ScreenReaderProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'optimized' | 'standard' | 'enhanced' | 'minimal';
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
  applyToBody?: boolean;
}

// Screen Reader Provider Component
export const ScreenReaderProvider = React.forwardRef<HTMLDivElement, ScreenReaderProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    level = 'intermediate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.visual.screenReaderOptimized) {
        setCurrentMode('optimized');
      } else {
        setCurrentMode('standard');
      }
    }, [config.visual.screenReaderOptimized]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing screen reader classes
        document.body.classList.remove(
          'sr-optimized',
          'sr-standard',
          'sr-enhanced',
          'sr-minimal'
        );
        
        document.body.classList.add(`sr-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          screenReaderVariants({ mode: currentMode, level }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScreenReaderProvider.displayName = 'ScreenReaderProvider';

// Screen Reader Text Component
interface ScreenReaderTextProps extends VariantProps<typeof screenReaderVariants> {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  hidden?: boolean;
  live?: 'polite' | 'assertive' | 'off';
}

export const ScreenReaderText = React.forwardRef<HTMLElement, ScreenReaderTextProps>(
  ({ children, className, as: Component = 'span', hidden = false, live = 'off', ...props }, ref) => {
    const { config } = useAccessibility();
    const isScreenReaderOptimized = config.visual.screenReaderOptimized;

    if (hidden && !isScreenReaderOptimized) {
      return null;
    }

    return (
      <Component
        ref={ref as any}
        className={cn(
          hidden ? 'sr-only' : '',
          live !== 'off' ? `sr-${live}` : '',
          className
        )}
        aria-live={live !== 'off' ? live : undefined}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ScreenReaderText.displayName = 'ScreenReaderText';

// Screen Reader Button Component
interface ScreenReaderButtonProps extends VariantProps<typeof screenReaderVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
}

export const ScreenReaderButton = React.forwardRef<HTMLButtonElement, ScreenReaderButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    ariaLabel,
    ariaDescribedBy,
    ariaExpanded,
    ariaControls,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isScreenReaderOptimized = config.visual.screenReaderOptimized;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          screenReaderVariants({ mode: isScreenReaderOptimized ? 'optimized' : 'standard' }),
          className
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ScreenReaderButton.displayName = 'ScreenReaderButton';

// Screen Reader Input Component
interface ScreenReaderInputProps extends VariantProps<typeof screenReaderVariants> {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
}

export const ScreenReaderInput = React.forwardRef<HTMLInputElement, ScreenReaderInputProps>(
  ({ 
    className, 
    placeholder, 
    value, 
    onChange, 
    type = 'text', 
    disabled, 
    required,
    ariaLabel,
    ariaDescribedBy,
    ariaInvalid,
    ariaRequired,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isScreenReaderOptimized = config.visual.screenReaderOptimized;

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
          'w-full px-3 py-2 rounded-md border-2 border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          screenReaderVariants({ mode: isScreenReaderOptimized ? 'optimized' : 'standard' }),
          className
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        aria-required={ariaRequired}
        {...props}
      />
    );
  }
);

ScreenReaderInput.displayName = 'ScreenReaderInput';

// Screen Reader Card Component
interface ScreenReaderCardProps extends VariantProps<typeof screenReaderVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const ScreenReaderCard = React.forwardRef<HTMLDivElement, ScreenReaderCardProps>(
  ({ 
    children, 
    className, 
    title, 
    description, 
    role = 'region',
    ariaLabel,
    ariaDescribedBy,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isScreenReaderOptimized = config.visual.screenReaderOptimized;

    return (
      <div
        ref={ref}
        role={role}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={cn(
          'p-6 rounded-lg border-2 border-gray-200 bg-white shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          screenReaderVariants({ mode: isScreenReaderOptimized ? 'optimized' : 'standard' }),
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="font-semibold mb-2" id={ariaDescribedBy ? `${ariaDescribedBy}-title` : undefined}>
            {title}
          </h3>
        )}
        {description && (
          <p className="opacity-80 mb-4" id={ariaDescribedBy ? `${ariaDescribedBy}-description` : undefined}>
            {description}
          </p>
        )}
        {children}
      </div>
    );
  }
);

ScreenReaderCard.displayName = 'ScreenReaderCard';

// Screen Reader Status Component
interface ScreenReaderStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ScreenReaderStatus = React.forwardRef<HTMLDivElement, ScreenReaderStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isScreenReaderOptimized = config.visual.screenReaderOptimized;

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
          Screen Reader: {isScreenReaderOptimized ? 'Optimized' : 'Standard'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isScreenReaderOptimized 
              ? 'Enhanced ARIA support and semantic markup' 
              : 'Standard accessibility features'
            }
          </div>
        )}
      </div>
    );
  }
);

ScreenReaderStatus.displayName = 'ScreenReaderStatus';

// Screen Reader Announcement Component
interface ScreenReaderAnnouncementProps {
  className?: string;
  message: string;
  priority?: 'polite' | 'assertive';
  autoHide?: boolean;
  delay?: number;
}

export const ScreenReaderAnnouncement = React.forwardRef<HTMLDivElement, ScreenReaderAnnouncementProps>(
  ({ className, message, priority = 'polite', autoHide = true, delay = 3000 }, ref) => {
    const { config } = useAccessibility();
    const isScreenReaderOptimized = config.visual.screenReaderOptimized;
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      if (autoHide && delay > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, delay);

        return () => clearTimeout(timer);
      }
    }, [autoHide, delay]);

    useEffect(() => {
      if (isScreenReaderOptimized) {
        screenReaderUtils.announce(message, priority);
      }
    }, [message, priority, isScreenReaderOptimized]);

    if (!isVisible) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'sr-only',
          className
        )}
        aria-live={priority}
        aria-atomic="true"
      >
        {message}
      </div>
    );
  }
);

ScreenReaderAnnouncement.displayName = 'ScreenReaderAnnouncement';

// Screen Reader Navigation Component
interface ScreenReaderNavigationProps {
  className?: string;
  items: Array<{
    id: string;
    label: string;
    href?: string;
    onClick?: () => void;
    current?: boolean;
  }>;
  orientation?: 'horizontal' | 'vertical';
  ariaLabel?: string;
}

export const ScreenReaderNavigation = React.forwardRef<HTMLNavElement, ScreenReaderNavigationProps>(
  ({ className, items, orientation = 'horizontal', ariaLabel }, ref) => {
    const { config } = useAccessibility();
    const isScreenReaderOptimized = config.visual.screenReaderOptimized;

    return (
      <nav
        ref={ref}
        className={cn(
          'flex gap-2',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          className
        )}
        aria-label={ariaLabel}
        role="navigation"
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            onClick={item.onClick}
            className={cn(
              'px-3 py-2 rounded-md transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
              item.current 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                : 'text-gray-700 dark:text-gray-300'
            )}
            aria-current={item.current ? 'page' : undefined}
            aria-describedby={isScreenReaderOptimized ? `${item.id}-description` : undefined}
          >
            {item.label}
            {isScreenReaderOptimized && (
              <span id={`${item.id}-description`} className="sr-only">
                {item.current ? 'Current page' : 'Navigate to page'}
              </span>
            )}
          </a>
        ))}
      </nav>
    );
  }
);

ScreenReaderNavigation.displayName = 'ScreenReaderNavigation';

// Export all components
export {
  screenReaderVariants,
  type ScreenReaderToggleProps,
  type ScreenReaderProviderProps,
  type ScreenReaderTextProps,
  type ScreenReaderButtonProps,
  type ScreenReaderInputProps,
  type ScreenReaderCardProps,
  type ScreenReaderStatusProps,
  type ScreenReaderAnnouncementProps,
  type ScreenReaderNavigationProps
};
