/**
 * Focus Indicators Component
 * 
 * Provides enhanced focus indicators for keyboard navigation accessibility.
 * Implements WCAG 2.1 AA focus requirements and visual focus management.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';
import { focusUtils } from '../core/accessibility-utils';

// Focus Indicators Variants
const focusIndicatorsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      style: {
        default: 'focus:outline-2 focus:outline-blue-500 focus:outline-offset-2',
        ring: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        border: 'focus:border-2 focus:border-blue-500',
        glow: 'focus:shadow-lg focus:shadow-blue-500/50',
        underline: 'focus:underline focus:decoration-2 focus:decoration-blue-500',
        custom: 'focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2'
      },
      size: {
        sm: 'focus:outline-1 focus:ring-1',
        md: 'focus:outline-2 focus:ring-2',
        lg: 'focus:outline-4 focus:ring-4',
        xl: 'focus:outline-6 focus:ring-6'
      },
      color: {
        blue: 'focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 focus:shadow-blue-500/50 focus:decoration-blue-500',
        green: 'focus:outline-green-500 focus:ring-green-500 focus:border-green-500 focus:shadow-green-500/50 focus:decoration-green-500',
        red: 'focus:outline-red-500 focus:ring-red-500 focus:border-red-500 focus:shadow-red-500/50 focus:decoration-red-500',
        yellow: 'focus:outline-yellow-500 focus:ring-yellow-500 focus:border-yellow-500 focus:shadow-yellow-500/50 focus:decoration-yellow-500',
        purple: 'focus:outline-purple-500 focus:ring-purple-500 focus:border-purple-500 focus:shadow-purple-500/50 focus:decoration-purple-500',
        current: 'focus:outline-current focus:ring-current focus:border-current focus:shadow-current/50 focus:decoration-current'
      },
      visibility: {
        always: 'focus:opacity-100',
        hover: 'focus:opacity-100 hover:opacity-80',
        keyboard: 'focus:opacity-100 focus-visible:opacity-100'
      }
    },
    defaultVariants: {
      style: 'default',
      size: 'md',
      color: 'blue',
      visibility: 'keyboard'
    }
  }
);

// Focus Indicators Toggle Props
interface FocusIndicatorsToggleProps extends VariantProps<typeof focusIndicatorsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Focus Indicators Toggle Component
export const FocusIndicatorsToggle = React.forwardRef<HTMLButtonElement, FocusIndicatorsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.visual.focusIndicators);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        visual: {
          focusIndicators: newState
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
            ? 'bg-green-600 text-white border-green-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable focus indicators' : 'Enable focus indicators'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Focus indicators enabled' : 'Focus indicators disabled'}
          </span>
        )}
      </button>
    );
  }
);

FocusIndicatorsToggle.displayName = 'FocusIndicatorsToggle';

// Focus Indicators Provider Props
interface FocusIndicatorsProviderProps {
  children: React.ReactNode;
  className?: string;
  style?: 'default' | 'ring' | 'border' | 'glow' | 'underline' | 'custom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'current';
  applyToBody?: boolean;
}

// Focus Indicators Provider Component
export const FocusIndicatorsProvider = React.forwardRef<HTMLDivElement, FocusIndicatorsProviderProps>(
  ({ 
    children, 
    className, 
    style = 'default', 
    size = 'md',
    color = 'blue',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentStyle, setCurrentStyle] = useState(style);

    useEffect(() => {
      if (config.visual.focusIndicators) {
        setCurrentStyle(style);
      } else {
        setCurrentStyle('default');
      }
    }, [config.visual.focusIndicators, style]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing focus indicator classes
        document.body.classList.remove(
          'focus-indicators-default',
          'focus-indicators-ring',
          'focus-indicators-border',
          'focus-indicators-glow',
          'focus-indicators-underline',
          'focus-indicators-custom'
        );
        
        if (config.visual.focusIndicators) {
          document.body.classList.add(`focus-indicators-${currentStyle}`);
        }
      }
    }, [currentStyle, applyToBody, config.visual.focusIndicators]);

    return (
      <div
        ref={ref}
        className={cn(
          focusIndicatorsVariants({ style: currentStyle, size, color }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FocusIndicatorsProvider.displayName = 'FocusIndicatorsProvider';

// Focus Indicators Button Component
interface FocusIndicatorsButtonProps extends VariantProps<typeof focusIndicatorsVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: 'default' | 'ring' | 'border' | 'glow' | 'underline' | 'custom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'current';
}

export const FocusIndicatorsButton = React.forwardRef<HTMLButtonElement, FocusIndicatorsButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    style = 'default',
    size = 'md',
    color = 'blue',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isFocusIndicatorsEnabled = config.visual.focusIndicators;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
          focusIndicatorsVariants({ 
            style: isFocusIndicatorsEnabled ? style : 'default',
            size: isFocusIndicatorsEnabled ? size : 'md',
            color: isFocusIndicatorsEnabled ? color : 'blue'
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

FocusIndicatorsButton.displayName = 'FocusIndicatorsButton';

// Focus Indicators Input Component
interface FocusIndicatorsInputProps extends VariantProps<typeof focusIndicatorsVariants> {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  disabled?: boolean;
  required?: boolean;
  style?: 'default' | 'ring' | 'border' | 'glow' | 'underline' | 'custom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'current';
}

export const FocusIndicatorsInput = React.forwardRef<HTMLInputElement, FocusIndicatorsInputProps>(
  ({ 
    className, 
    placeholder, 
    value, 
    onChange, 
    type = 'text', 
    disabled, 
    required,
    style = 'default',
    size = 'md',
    color = 'blue',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isFocusIndicatorsEnabled = config.visual.focusIndicators;

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
          'w-full px-3 py-2 rounded-md border-2 border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
          focusIndicatorsVariants({ 
            style: isFocusIndicatorsEnabled ? style : 'default',
            size: isFocusIndicatorsEnabled ? size : 'md',
            color: isFocusIndicatorsEnabled ? color : 'blue'
          }),
          className
        )}
        {...props}
      />
    );
  }
);

FocusIndicatorsInput.displayName = 'FocusIndicatorsInput';

// Focus Indicators Link Component
interface FocusIndicatorsLinkProps extends VariantProps<typeof focusIndicatorsVariants> {
  children: React.ReactNode;
  href: string;
  className?: string;
  external?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  style?: 'default' | 'ring' | 'border' | 'glow' | 'underline' | 'custom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'current';
}

export const FocusIndicatorsLink = React.forwardRef<HTMLAnchorElement, FocusIndicatorsLinkProps>(
  ({ 
    children, 
    href, 
    className, 
    external, 
    target = '_self',
    style = 'default',
    size = 'md',
    color = 'blue',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isFocusIndicatorsEnabled = config.visual.focusIndicators;

    return (
      <a
        ref={ref}
        href={href}
        target={external ? '_blank' : target}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cn(
          'transition-all duration-300 hover:underline',
          focusIndicatorsVariants({ 
            style: isFocusIndicatorsEnabled ? style : 'default',
            size: isFocusIndicatorsEnabled ? size : 'md',
            color: isFocusIndicatorsEnabled ? color : 'blue'
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

FocusIndicatorsLink.displayName = 'FocusIndicatorsLink';

// Focus Indicators Card Component
interface FocusIndicatorsCardProps extends VariantProps<typeof focusIndicatorsVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  style?: 'default' | 'ring' | 'border' | 'glow' | 'underline' | 'custom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'current';
  focusable?: boolean;
}

export const FocusIndicatorsCard = React.forwardRef<HTMLDivElement, FocusIndicatorsCardProps>(
  ({ 
    children, 
    className, 
    title, 
    description, 
    style = 'default',
    size = 'md',
    color = 'blue',
    focusable = false,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isFocusIndicatorsEnabled = config.visual.focusIndicators;

    return (
      <div
        ref={ref}
        className={cn(
          'p-6 rounded-lg border-2 border-gray-200 bg-white shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          focusIndicatorsVariants({ 
            style: isFocusIndicatorsEnabled ? style : 'default',
            size: isFocusIndicatorsEnabled ? size : 'md',
            color: isFocusIndicatorsEnabled ? color : 'blue'
          }),
          focusable ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : '',
          className
        )}
        tabIndex={focusable ? 0 : undefined}
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

FocusIndicatorsCard.displayName = 'FocusIndicatorsCard';

// Focus Indicators Status Component
interface FocusIndicatorsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const FocusIndicatorsStatus = React.forwardRef<HTMLDivElement, FocusIndicatorsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isFocusIndicatorsEnabled = config.visual.focusIndicators;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="font-medium">
          Focus Indicators: {isFocusIndicatorsEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isFocusIndicatorsEnabled 
              ? 'Enhanced focus indicators for keyboard navigation' 
              : 'Standard focus indicators'
            }
          </div>
        )}
      </div>
    );
  }
);

FocusIndicatorsStatus.displayName = 'FocusIndicatorsStatus';

// Focus Indicators Demo Component
interface FocusIndicatorsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const FocusIndicatorsDemo = React.forwardRef<HTMLDivElement, FocusIndicatorsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isFocusIndicatorsEnabled = config.visual.focusIndicators;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Focus Indicators Demo</h3>
        
        <div className="flex flex-wrap gap-4">
          <FocusIndicatorsButton
            style={isFocusIndicatorsEnabled ? 'ring' : 'default'}
            size={isFocusIndicatorsEnabled ? 'lg' : 'md'}
            color={isFocusIndicatorsEnabled ? 'blue' : 'blue'}
          >
            Button with Focus
          </FocusIndicatorsButton>
          
          <FocusIndicatorsInput
            placeholder="Input with focus"
            style={isFocusIndicatorsEnabled ? 'border' : 'default'}
            size={isFocusIndicatorsEnabled ? 'lg' : 'md'}
            color={isFocusIndicatorsEnabled ? 'green' : 'blue'}
          />
          
          <FocusIndicatorsLink
            href="#"
            style={isFocusIndicatorsEnabled ? 'underline' : 'default'}
            size={isFocusIndicatorsEnabled ? 'lg' : 'md'}
            color={isFocusIndicatorsEnabled ? 'purple' : 'blue'}
          >
            Link with Focus
          </FocusIndicatorsLink>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use Tab key to navigate between elements and see focus indicators.
            </p>
          </div>
        )}
      </div>
    );
  }
);

FocusIndicatorsDemo.displayName = 'FocusIndicatorsDemo';

// Export all components
export {
  focusIndicatorsVariants,
  type FocusIndicatorsToggleProps,
  type FocusIndicatorsProviderProps,
  type FocusIndicatorsButtonProps,
  type FocusIndicatorsInputProps,
  type FocusIndicatorsLinkProps,
  type FocusIndicatorsCardProps,
  type FocusIndicatorsStatusProps,
  type FocusIndicatorsDemoProps
};
