/**
 * Color Blind Support Component
 * 
 * Provides color blind accessibility features and alternative visual indicators.
 * Implements WCAG 2.1 AA color contrast requirements and inclusive design.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Color Blind Support Variants
const colorBlindVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      type: {
        protanopia: 'filter-protanopia',
        deuteranopia: 'filter-deuteranopia',
        tritanopia: 'filter-tritanopia',
        achromatopsia: 'filter-achromatopsia',
        normal: 'filter-normal'
      },
      indicator: {
        shape: 'before:content-["●"] before:mr-1',
        pattern: 'before:content-["■"] before:mr-1',
        texture: 'before:content-["▲"] before:mr-1',
        border: 'border-2 border-current',
        background: 'bg-current bg-opacity-20',
        none: ''
      },
      severity: {
        low: 'opacity-60',
        medium: 'opacity-80',
        high: 'opacity-100',
        extreme: 'opacity-100 brightness-150'
      }
    },
    defaultVariants: {
      type: 'normal',
      indicator: 'none',
      severity: 'medium'
    }
  }
);

// Color Blind Toggle Props
interface ColorBlindToggleProps extends VariantProps<typeof colorBlindVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Color Blind Toggle Component
export const ColorBlindToggle = React.forwardRef<HTMLButtonElement, ColorBlindToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.visual.colorBlindSupport);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        visual: {
          colorBlindSupport: newState
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
        aria-label={isEnabled ? 'Disable color blind support' : 'Enable color blind support'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Color blind support enabled' : 'Color blind support disabled'}
          </span>
        )}
      </button>
    );
  }
);

ColorBlindToggle.displayName = 'ColorBlindToggle';

// Color Blind Type Selector Props
interface ColorBlindTypeSelectorProps extends VariantProps<typeof colorBlindVariants> {
  className?: string;
  onTypeChange?: (type: string) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Color Blind Type Selector Component
export const ColorBlindTypeSelector = React.forwardRef<HTMLDivElement, ColorBlindTypeSelectorProps>(
  ({ 
    className, 
    onTypeChange, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [currentType, setCurrentType] = useState('normal');

    const types = [
      { value: 'normal', label: 'Normal', description: 'Standard color vision' },
      { value: 'protanopia', label: 'Protanopia', description: 'Red-blind' },
      { value: 'deuteranopia', label: 'Deuteranopia', description: 'Green-blind' },
      { value: 'tritanopia', label: 'Tritanopia', description: 'Blue-blind' },
      { value: 'achromatopsia', label: 'Achromatopsia', description: 'Complete color blindness' }
    ];

    const handleTypeChange = useCallback((newType: string) => {
      setCurrentType(newType);
      
      updateConfig({
        visual: {
          colorBlindSupport: newType !== 'normal'
        }
      });
      
      onTypeChange?.(newType);
    }, [updateConfig, onTypeChange]);

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
            Color Vision Type
          </span>
        )}
        
        <div className="flex flex-col gap-1">
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeChange(type.value)}
              className={cn(
                'w-full px-2 py-1 text-xs rounded transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
                currentType === type.value 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 dark:text-gray-300'
              )}
              aria-label={`Set color vision type to ${type.label}`}
              aria-pressed={currentType === type.value}
            >
              <div className="font-medium">{type.label}</div>
              <div className="text-xs opacity-80">{type.description}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

ColorBlindTypeSelector.displayName = 'ColorBlindTypeSelector';

// Color Blind Provider Props
interface ColorBlindProviderProps {
  children: React.ReactNode;
  className?: string;
  type?: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'normal';
  applyToBody?: boolean;
}

// Color Blind Provider Component
export const ColorBlindProvider = React.forwardRef<HTMLDivElement, ColorBlindProviderProps>(
  ({ 
    children, 
    className, 
    type = 'normal', 
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentType, setCurrentType] = useState(type);

    useEffect(() => {
      if (config.visual.colorBlindSupport) {
        setCurrentType('protanopia'); // Default to protanopia when enabled
      } else {
        setCurrentType('normal');
      }
    }, [config.visual.colorBlindSupport]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing color blind filters
        document.body.classList.remove(
          'filter-protanopia',
          'filter-deuteranopia', 
          'filter-tritanopia',
          'filter-achromatopsia'
        );
        
        if (currentType !== 'normal') {
          document.body.classList.add(`filter-${currentType}`);
        }
      }
    }, [currentType, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          colorBlindVariants({ type: currentType }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ColorBlindProvider.displayName = 'ColorBlindProvider';

// Color Blind Text Component
interface ColorBlindTextProps extends VariantProps<typeof colorBlindVariants> {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  indicator?: 'shape' | 'pattern' | 'texture' | 'border' | 'background' | 'none';
}

export const ColorBlindText = React.forwardRef<HTMLElement, ColorBlindTextProps>(
  ({ children, className, as: Component = 'span', indicator = 'none', ...props }, ref) => {
    const { config } = useAccessibility();
    const isColorBlindSupport = config.visual.colorBlindSupport;

    return (
      <Component
        ref={ref as any}
        className={cn(
          colorBlindVariants({ 
            indicator: isColorBlindSupport ? indicator : 'none'
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

ColorBlindText.displayName = 'ColorBlindText';

// Color Blind Button Component
interface ColorBlindButtonProps extends VariantProps<typeof colorBlindVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  indicator?: 'shape' | 'pattern' | 'texture' | 'border' | 'background' | 'none';
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange';
}

export const ColorBlindButton = React.forwardRef<HTMLButtonElement, ColorBlindButtonProps>(
  ({ children, className, onClick, disabled, type = 'button', indicator = 'none', color = 'blue', ...props }, ref) => {
    const { config } = useAccessibility();
    const isColorBlindSupport = config.visual.colorBlindSupport;

    const colorClasses = {
      red: 'bg-red-500 hover:bg-red-600 text-white',
      green: 'bg-green-500 hover:bg-green-600 text-white',
      blue: 'bg-blue-500 hover:bg-blue-600 text-white',
      yellow: 'bg-yellow-500 hover:bg-yellow-600 text-black',
      purple: 'bg-purple-500 hover:bg-purple-600 text-white',
      orange: 'bg-orange-500 hover:bg-orange-600 text-white'
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          colorClasses[color],
          colorBlindVariants({ 
            indicator: isColorBlindSupport ? indicator : 'none'
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

ColorBlindButton.displayName = 'ColorBlindButton';

// Color Blind Card Component
interface ColorBlindCardProps extends VariantProps<typeof colorBlindVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  indicator?: 'shape' | 'pattern' | 'texture' | 'border' | 'background' | 'none';
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange';
}

export const ColorBlindCard = React.forwardRef<HTMLDivElement, ColorBlindCardProps>(
  ({ children, className, title, description, indicator = 'none', color = 'blue', ...props }, ref) => {
    const { config } = useAccessibility();
    const isColorBlindSupport = config.visual.colorBlindSupport;

    const colorClasses = {
      red: 'border-red-500 bg-red-50 dark:bg-red-900',
      green: 'border-green-500 bg-green-50 dark:bg-green-900',
      blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900',
      yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900',
      purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900',
      orange: 'border-orange-500 bg-orange-50 dark:bg-orange-900'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-6 rounded-lg border-2 transition-all duration-300',
          colorClasses[color],
          colorBlindVariants({ 
            indicator: isColorBlindSupport ? indicator : 'none'
          }),
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

ColorBlindCard.displayName = 'ColorBlindCard';

// Color Blind Status Component
interface ColorBlindStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ColorBlindStatus = React.forwardRef<HTMLDivElement, ColorBlindStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isColorBlindSupport = config.visual.colorBlindSupport;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
        </div>
        <span className="font-medium">
          Color Blind Support: {isColorBlindSupport ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isColorBlindSupport 
              ? 'Alternative visual indicators are shown' 
              : 'Standard color indicators are used'
            }
          </div>
        )}
      </div>
    );
  }
);

ColorBlindStatus.displayName = 'ColorBlindStatus';

// Color Blind Indicator Component
interface ColorBlindIndicatorProps {
  className?: string;
  type: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

export const ColorBlindIndicator = React.forwardRef<HTMLDivElement, ColorBlindIndicatorProps>(
  ({ className, type, children }, ref) => {
    const { config } = useAccessibility();
    const isColorBlindSupport = config.visual.colorBlindSupport;

    const typeConfig = {
      success: {
        color: 'text-green-600',
        shape: '●',
        pattern: '■',
        texture: '▲'
      },
      warning: {
        color: 'text-yellow-600',
        shape: '●',
        pattern: '■',
        texture: '▲'
      },
      error: {
        color: 'text-red-600',
        shape: '●',
        pattern: '■',
        texture: '▲'
      },
      info: {
        color: 'text-blue-600',
        shape: '●',
        pattern: '■',
        texture: '▲'
      }
    };

    const config_ = typeConfig[type];

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-2 rounded-md border-2 transition-all duration-300',
          config_.color,
          className
        )}
      >
        {isColorBlindSupport && (
          <span className="text-lg font-bold" aria-hidden="true">
            {config_.shape}
          </span>
        )}
        <span>{children}</span>
      </div>
    );
  }
);

ColorBlindIndicator.displayName = 'ColorBlindIndicator';

// Export all components
export {
  colorBlindVariants,
  type ColorBlindToggleProps,
  type ColorBlindTypeSelectorProps,
  type ColorBlindProviderProps,
  type ColorBlindTextProps,
  type ColorBlindButtonProps,
  type ColorBlindCardProps,
  type ColorBlindStatusProps,
  type ColorBlindIndicatorProps
};
