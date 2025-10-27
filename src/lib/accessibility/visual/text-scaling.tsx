/**
 * Text Scaling Component
 * 
 * Provides text scaling controls for improved readability and accessibility.
 * Implements WCAG 2.1 AA text scaling requirements and user preferences.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Text Scaling Variants
const textScalingVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      scale: {
        '0.75': 'text-xs scale-75',
        '0.875': 'text-sm scale-87',
        '1.0': 'text-base scale-100',
        '1.125': 'text-lg scale-112',
        '1.25': 'text-xl scale-125',
        '1.5': 'text-2xl scale-150',
        '1.75': 'text-3xl scale-175',
        '2.0': 'text-4xl scale-200'
      },
      method: {
        'font-size': 'text-scaling-font-size',
        'transform': 'text-scaling-transform',
        'zoom': 'text-scaling-zoom',
        'custom': 'text-scaling-custom'
      },
      unit: {
        'rem': 'text-scaling-rem',
        'em': 'text-scaling-em',
        'px': 'text-scaling-px',
        'percent': 'text-scaling-percent'
      }
    },
    defaultVariants: {
      scale: '1.0',
      method: 'font-size',
      unit: 'rem'
    }
  }
);

// Text Scaling Control Props
interface TextScalingControlProps extends VariantProps<typeof textScalingVariants> {
  className?: string;
  onScaleChange?: (scale: number) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  min?: number;
  max?: number;
  step?: number;
}

// Text Scaling Control Component
export const TextScalingControl = React.forwardRef<HTMLDivElement, TextScalingControlProps>(
  ({ 
    className, 
    onScaleChange, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    min = 0.75,
    max = 2.0,
    step = 0.125,
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [currentScale, setCurrentScale] = useState(config.visual.textScaling);

    const handleScaleChange = useCallback((newScale: number) => {
      setCurrentScale(newScale);
      
      updateConfig({
        visual: {
          textScaling: newScale
        }
      });
      
      onScaleChange?.(newScale);
    }, [updateConfig, onScaleChange]);

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
            Text Scale: {Math.round(currentScale * 100)}%
          </span>
        )}
        
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentScale}
          onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          aria-label="Text scaling slider"
        />
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{Math.round(min * 100)}%</span>
          <span>{Math.round(max * 100)}%</span>
        </div>
        
        <div className="flex gap-1">
          {[0.75, 1.0, 1.25, 1.5, 2.0].map((scale) => (
            <button
              key={scale}
              onClick={() => handleScaleChange(scale)}
              className={cn(
                'px-2 py-1 text-xs rounded transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
                currentScale === scale 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 dark:text-gray-300'
              )}
              aria-label={`Set text scale to ${Math.round(scale * 100)}%`}
              aria-pressed={currentScale === scale}
            >
              {Math.round(scale * 100)}%
            </button>
          ))}
        </div>
      </div>
    );
  }
);

TextScalingControl.displayName = 'TextScalingControl';

// Text Scaling Toggle Props
interface TextScalingToggleProps extends VariantProps<typeof textScalingVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  targetScale?: number;
}

// Text Scaling Toggle Component
export const TextScalingToggle = React.forwardRef<HTMLButtonElement, TextScalingToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    targetScale = 1.25,
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isScaled, setIsScaled] = useState(config.visual.textScaling > 1.0);

    const handleToggle = useCallback(() => {
      const newState = !isScaled;
      setIsScaled(newState);
      
      const newScale = newState ? targetScale : 1.0;
      updateConfig({
        visual: {
          textScaling: newScale
        }
      });
      
      onToggle?.(newState);
    }, [isScaled, updateConfig, onToggle, targetScale]);

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
          isScaled 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isScaled ? 'Reset text scale to normal' : `Scale text to ${Math.round(targetScale * 100)}%`}
        aria-pressed={isScaled}
        {...props}
      >
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold">A</div>
          <div className="text-xs font-bold">A</div>
        </div>
        {showLabel && (
          <span className="sr-only">
            {isScaled ? 'Text scaling enabled' : 'Text scaling disabled'}
          </span>
        )}
      </button>
    );
  }
);

TextScalingToggle.displayName = 'TextScalingToggle';

// Text Scaling Provider Props
interface TextScalingProviderProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  method?: 'font-size' | 'transform' | 'zoom' | 'custom';
  unit?: 'rem' | 'em' | 'px' | 'percent';
  applyToBody?: boolean;
}

// Text Scaling Provider Component
export const TextScalingProvider = React.forwardRef<HTMLDivElement, TextScalingProviderProps>(
  ({ 
    children, 
    className, 
    scale = 1.0, 
    method = 'font-size',
    unit = 'rem',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentScale, setCurrentScale] = useState(config.visual.textScaling);

    useEffect(() => {
      setCurrentScale(config.visual.textScaling);
    }, [config.visual.textScaling]);

    useEffect(() => {
      if (applyToBody) {
        const scaleMap = {
          'font-size': () => {
            document.body.style.fontSize = `${currentScale}${unit}`;
            document.body.classList.add('text-scaling-font-size');
          },
          'transform': () => {
            document.body.style.transform = `scale(${currentScale})`;
            document.body.classList.add('text-scaling-transform');
          },
          'zoom': () => {
            document.body.style.zoom = `${currentScale}`;
            document.body.classList.add('text-scaling-zoom');
          },
          'custom': () => {
            document.body.style.setProperty('--text-scale', `${currentScale}`);
            document.body.classList.add('text-scaling-custom');
          }
        };
        
        // Remove existing scaling classes
        document.body.classList.remove(
          'text-scaling-font-size',
          'text-scaling-transform',
          'text-scaling-zoom',
          'text-scaling-custom'
        );
        
        // Apply new scaling
        scaleMap[method]();
      }
    }, [currentScale, method, unit, applyToBody]);

    const scaleClass = currentScale === 1.0 ? '1.0' : 
                      currentScale === 1.125 ? '1.125' :
                      currentScale === 1.25 ? '1.25' :
                      currentScale === 1.5 ? '1.5' :
                      currentScale === 1.75 ? '1.75' :
                      currentScale === 2.0 ? '2.0' : '1.0';

    return (
      <div
        ref={ref}
        className={cn(
          textScalingVariants({ scale: scaleClass as any, method, unit }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TextScalingProvider.displayName = 'TextScalingProvider';

// Text Scaling Text Component
interface TextScalingTextProps extends VariantProps<typeof textScalingVariants> {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  scale?: number;
  method?: 'font-size' | 'transform' | 'zoom' | 'custom';
}

export const TextScalingText = React.forwardRef<HTMLElement, TextScalingTextProps>(
  ({ children, className, as: Component = 'span', scale, method = 'font-size', ...props }, ref) => {
    const { config } = useAccessibility();
    const currentScale = scale || config.visual.textScaling;

    const scaleClass = currentScale === 1.0 ? '1.0' : 
                      currentScale === 1.125 ? '1.125' :
                      currentScale === 1.25 ? '1.25' :
                      currentScale === 1.5 ? '1.5' :
                      currentScale === 1.75 ? '1.75' :
                      currentScale === 2.0 ? '2.0' : '1.0';

    return (
      <Component
        ref={ref as any}
        className={cn(
          textScalingVariants({ scale: scaleClass as any, method }),
          className
        )}
        style={method === 'custom' ? { '--text-scale': `${currentScale}` } as React.CSSProperties : undefined}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

TextScalingText.displayName = 'TextScalingText';

// Text Scaling Button Component
interface TextScalingButtonProps extends VariantProps<typeof textScalingVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  scale?: number;
  method?: 'font-size' | 'transform' | 'zoom' | 'custom';
}

export const TextScalingButton = React.forwardRef<HTMLButtonElement, TextScalingButtonProps>(
  ({ children, className, onClick, disabled, type = 'button', scale, method = 'font-size', ...props }, ref) => {
    const { config } = useAccessibility();
    const currentScale = scale || config.visual.textScaling;

    const scaleClass = currentScale === 1.0 ? '1.0' : 
                      currentScale === 1.125 ? '1.125' :
                      currentScale === 1.25 ? '1.25' :
                      currentScale === 1.5 ? '1.5' :
                      currentScale === 1.75 ? '1.75' :
                      currentScale === 2.0 ? '2.0' : '1.0';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          textScalingVariants({ scale: scaleClass as any, method }),
          className
        )}
        style={method === 'custom' ? { '--text-scale': `${currentScale}` } as React.CSSProperties : undefined}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TextScalingButton.displayName = 'TextScalingButton';

// Text Scaling Input Component
interface TextScalingInputProps extends VariantProps<typeof textScalingVariants> {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  disabled?: boolean;
  required?: boolean;
  scale?: number;
  method?: 'font-size' | 'transform' | 'zoom' | 'custom';
}

export const TextScalingInput = React.forwardRef<HTMLInputElement, TextScalingInputProps>(
  ({ className, placeholder, value, onChange, type = 'text', disabled, required, scale, method = 'font-size', ...props }, ref) => {
    const { config } = useAccessibility();
    const currentScale = scale || config.visual.textScaling;

    const scaleClass = currentScale === 1.0 ? '1.0' : 
                      currentScale === 1.125 ? '1.125' :
                      currentScale === 1.25 ? '1.25' :
                      currentScale === 1.5 ? '1.5' :
                      currentScale === 1.75 ? '1.75' :
                      currentScale === 2.0 ? '2.0' : '1.0';

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
          textScalingVariants({ scale: scaleClass as any, method }),
          className
        )}
        style={method === 'custom' ? { '--text-scale': `${currentScale}` } as React.CSSProperties : undefined}
        {...props}
      />
    );
  }
);

TextScalingInput.displayName = 'TextScalingInput';

// Text Scaling Card Component
interface TextScalingCardProps extends VariantProps<typeof textScalingVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  scale?: number;
  method?: 'font-size' | 'transform' | 'zoom' | 'custom';
}

export const TextScalingCard = React.forwardRef<HTMLDivElement, TextScalingCardProps>(
  ({ children, className, title, description, scale, method = 'font-size', ...props }, ref) => {
    const { config } = useAccessibility();
    const currentScale = scale || config.visual.textScaling;

    const scaleClass = currentScale === 1.0 ? '1.0' : 
                      currentScale === 1.125 ? '1.125' :
                      currentScale === 1.25 ? '1.25' :
                      currentScale === 1.5 ? '1.5' :
                      currentScale === 1.75 ? '1.75' :
                      currentScale === 2.0 ? '2.0' : '1.0';

    return (
      <div
        ref={ref}
        className={cn(
          'p-6 rounded-lg border-2 border-gray-200 bg-white shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          textScalingVariants({ scale: scaleClass as any, method }),
          className
        )}
        style={method === 'custom' ? { '--text-scale': `${currentScale}` } as React.CSSProperties : undefined}
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

TextScalingCard.displayName = 'TextScalingCard';

// Text Scaling Status Component
interface TextScalingStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const TextScalingStatus = React.forwardRef<HTMLDivElement, TextScalingStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const currentScale = config.visual.textScaling;

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
          Text Scale: {Math.round(currentScale * 100)}%
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {currentScale === 1.0 && 'Normal text size'}
            {currentScale > 1.0 && currentScale < 1.25 && 'Slightly enlarged text'}
            {currentScale >= 1.25 && currentScale < 1.5 && 'Enlarged text for better readability'}
            {currentScale >= 1.5 && 'Significantly enlarged text for accessibility'}
          </div>
        )}
      </div>
    );
  }
);

TextScalingStatus.displayName = 'TextScalingStatus';

// Export all components
export {
  textScalingVariants,
  type TextScalingControlProps,
  type TextScalingToggleProps,
  type TextScalingProviderProps,
  type TextScalingTextProps,
  type TextScalingButtonProps,
  type TextScalingInputProps,
  type TextScalingCardProps,
  type TextScalingStatusProps
};
