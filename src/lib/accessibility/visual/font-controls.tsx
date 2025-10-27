/**
 * Font Controls Component
 * 
 * Provides font size controls and typography accessibility features.
 * Implements WCAG 2.1 AA text scaling requirements and user preferences.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Font Controls Variants
const fontControlsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      size: {
        'xs': 'text-xs',
        'sm': 'text-sm',
        'base': 'text-base',
        'lg': 'text-lg',
        'xl': 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl'
      },
      weight: {
        'thin': 'font-thin',
        'light': 'font-light',
        'normal': 'font-normal',
        'medium': 'font-medium',
        'semibold': 'font-semibold',
        'bold': 'font-bold',
        'extrabold': 'font-extrabold',
        'black': 'font-black'
      },
      lineHeight: {
        'tight': 'leading-tight',
        'snug': 'leading-snug',
        'normal': 'leading-normal',
        'relaxed': 'leading-relaxed',
        'loose': 'leading-loose'
      },
      letterSpacing: {
        'tighter': 'tracking-tighter',
        'tight': 'tracking-tight',
        'normal': 'tracking-normal',
        'wide': 'tracking-wide',
        'wider': 'tracking-wider',
        'widest': 'tracking-widest'
      },
      scaling: {
        'small': 'scale-90',
        'medium': 'scale-100',
        'large': 'scale-110',
        'extra-large': 'scale-125',
        'custom': 'scale-[var(--font-scale)]'
      }
    },
    defaultVariants: {
      size: 'base',
      weight: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      scaling: 'medium'
    }
  }
);

// Font Size Control Props
interface FontSizeControlProps extends VariantProps<typeof fontControlsVariants> {
  className?: string;
  onSizeChange?: (size: string) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Font Size Control Component
export const FontSizeControl = React.forwardRef<HTMLDivElement, FontSizeControlProps>(
  ({ 
    className, 
    onSizeChange, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [currentSize, setCurrentSize] = useState(config.visual.fontSize);

    const sizes = [
      { value: 'small', label: 'Small', scale: 0.875 },
      { value: 'medium', label: 'Medium', scale: 1.0 },
      { value: 'large', label: 'Large', scale: 1.125 },
      { value: 'extra-large', label: 'Extra Large', scale: 1.25 }
    ];

    const handleSizeChange = useCallback((newSize: string) => {
      setCurrentSize(newSize as any);
      
      updateConfig({
        visual: {
          fontSize: newSize as any
        }
      });
      
      onSizeChange?.(newSize);
    }, [updateConfig, onSizeChange]);

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
      <div
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col gap-2 p-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600',
          positionClasses[position],
          className
        )}
        {...props}
      >
        {showLabel && (
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Font Size
          </span>
        )}
        
        <div className="flex flex-col gap-1">
          {sizes.map((sizeOption) => (
            <button
              key={sizeOption.value}
              onClick={() => handleSizeChange(sizeOption.value)}
              className={cn(
                'w-full px-2 py-1 text-xs rounded transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
                currentSize === sizeOption.value 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 dark:text-gray-300'
              )}
              aria-label={`Set font size to ${sizeOption.label}`}
              aria-pressed={currentSize === sizeOption.value}
            >
              {sizeOption.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

FontSizeControl.displayName = 'FontSizeControl';

// Font Size Toggle Props
interface FontSizeToggleProps extends VariantProps<typeof fontControlsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Font Size Toggle Component
export const FontSizeToggle = React.forwardRef<HTMLButtonElement, FontSizeToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isLarge, setIsLarge] = useState(config.visual.fontSize === 'large' || config.visual.fontSize === 'extra-large');

    const handleToggle = useCallback(() => {
      const newState = !isLarge;
      setIsLarge(newState);
      
      const newSize = newState ? 'large' : 'medium';
      updateConfig({
        visual: {
          fontSize: newSize as any
        }
      });
      
      onToggle?.(newState);
    }, [isLarge, updateConfig, onToggle]);

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
          isLarge 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isLarge ? 'Use smaller font size' : 'Use larger font size'}
        aria-pressed={isLarge}
        {...props}
      >
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold">A</div>
          <div className="text-xs font-bold">A</div>
        </div>
        {showLabel && (
          <span className="sr-only">
            {isLarge ? 'Large font size enabled' : 'Large font size disabled'}
          </span>
        )}
      </button>
    );
  }
);

FontSizeToggle.displayName = 'FontSizeToggle';

// Font Size Provider Props
interface FontSizeProviderProps {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  applyToBody?: boolean;
}

// Font Size Provider Component
export const FontSizeProvider = React.forwardRef<HTMLDivElement, FontSizeProviderProps>(
  ({ 
    children, 
    className, 
    size = 'medium', 
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentSize, setCurrentSize] = useState(config.visual.fontSize);

    useEffect(() => {
      setCurrentSize(config.visual.fontSize);
    }, [config.visual.fontSize]);

    useEffect(() => {
      if (applyToBody) {
        const scaleMap = {
          small: 0.875,
          medium: 1.0,
          large: 1.125,
          'extra-large': 1.25
        };
        
        const scale = scaleMap[currentSize];
        document.body.style.fontSize = `${scale}rem`;
        document.body.classList.add('font-size-adjusted');
      }
    }, [currentSize, applyToBody]);

    const sizeClasses = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
      'extra-large': 'text-xl'
    };

    return (
      <div
        ref={ref}
        className={cn(
          fontControlsVariants({ size: currentSize }),
          sizeClasses[currentSize],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FontSizeProvider.displayName = 'FontSizeProvider';

// Font Size Text Component
interface FontSizeTextProps extends VariantProps<typeof fontControlsVariants> {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'small' | 'medium' | 'large' | 'extra-large';
}

export const FontSizeText = React.forwardRef<HTMLElement, FontSizeTextProps>(
  ({ children, className, as: Component = 'span', size, ...props }, ref) => {
    const { config } = useAccessibility();
    const currentSize = size || config.visual.fontSize;

    return (
      <Component
        ref={ref as any}
        className={cn(
          fontControlsVariants({ size: currentSize }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

FontSizeText.displayName = 'FontSizeText';

// Font Size Button Component
interface FontSizeButtonProps extends VariantProps<typeof fontControlsVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'medium' | 'large' | 'extra-large';
}

export const FontSizeButton = React.forwardRef<HTMLButtonElement, FontSizeButtonProps>(
  ({ children, className, onClick, disabled, type = 'button', size, ...props }, ref) => {
    const { config } = useAccessibility();
    const currentSize = size || config.visual.fontSize;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          fontControlsVariants({ size: currentSize }),
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FontSizeButton.displayName = 'FontSizeButton';

// Font Size Input Component
interface FontSizeInputProps extends VariantProps<typeof fontControlsVariants> {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  disabled?: boolean;
  required?: boolean;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
}

export const FontSizeInput = React.forwardRef<HTMLInputElement, FontSizeInputProps>(
  ({ className, placeholder, value, onChange, type = 'text', disabled, required, size, ...props }, ref) => {
    const { config } = useAccessibility();
    const currentSize = size || config.visual.fontSize;

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
          fontControlsVariants({ size: currentSize }),
          className
        )}
        {...props}
      />
    );
  }
);

FontSizeInput.displayName = 'FontSizeInput';

// Font Size Card Component
interface FontSizeCardProps extends VariantProps<typeof fontControlsVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
}

export const FontSizeCard = React.forwardRef<HTMLDivElement, FontSizeCardProps>(
  ({ children, className, title, description, size, ...props }, ref) => {
    const { config } = useAccessibility();
    const currentSize = size || config.visual.fontSize;

    return (
      <div
        ref={ref}
        className={cn(
          'p-6 rounded-lg border-2 border-gray-200 bg-white shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          fontControlsVariants({ size: currentSize }),
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

FontSizeCard.displayName = 'FontSizeCard';

// Font Size Status Component
interface FontSizeStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const FontSizeStatus = React.forwardRef<HTMLDivElement, FontSizeStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const currentSize = config.visual.fontSize;

    const sizeMap = {
      small: 'Small (87.5%)',
      medium: 'Medium (100%)',
      large: 'Large (112.5%)',
      'extra-large': 'Extra Large (125%)'
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
          Font Size: {sizeMap[currentSize]}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {currentSize === 'small' && 'Smaller text for compact layouts'}
            {currentSize === 'medium' && 'Standard text size'}
            {currentSize === 'large' && 'Larger text for better readability'}
            {currentSize === 'extra-large' && 'Extra large text for accessibility'}
          </div>
        )}
      </div>
    );
  }
);

FontSizeStatus.displayName = 'FontSizeStatus';

// Font Size Slider Component
interface FontSizeSliderProps {
  className?: string;
  onSizeChange?: (size: string) => void;
  showLabel?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export const FontSizeSlider = React.forwardRef<HTMLInputElement, FontSizeSliderProps>(
  ({ className, onSizeChange, showLabel = true, min = 0.75, max = 1.5, step = 0.05 }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [currentScale, setCurrentScale] = useState(config.visual.textScaling);

    const handleScaleChange = useCallback((value: number) => {
      setCurrentScale(value);
      
      updateConfig({
        visual: {
          textScaling: value
        }
      });
      
      onSizeChange?.(value.toString());
    }, [updateConfig, onSizeChange]);

    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {showLabel && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Font Scale: {Math.round(currentScale * 100)}%
          </label>
        )}
        
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentScale}
          onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          aria-label="Font size slider"
        />
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{Math.round(min * 100)}%</span>
          <span>{Math.round(max * 100)}%</span>
        </div>
      </div>
    );
  }
);

FontSizeSlider.displayName = 'FontSizeSlider';

// Export all components
export {
  fontControlsVariants,
  type FontSizeControlProps,
  type FontSizeToggleProps,
  type FontSizeProviderProps,
  type FontSizeTextProps,
  type FontSizeButtonProps,
  type FontSizeInputProps,
  type FontSizeCardProps,
  type FontSizeStatusProps,
  type FontSizeSliderProps
};
