/**
 * Touch Targets Component
 * 
 * Provides touch target optimization for motor accessibility.
 * Implements WCAG 2.1 AA touch target requirements and gesture alternatives.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';
import { useTouchSupport } from '../core/accessibility-hooks';

// Touch Targets Variants
const touchTargetsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      size: {
        'small': 'touch-target-small',
        'medium': 'touch-target-medium',
        'large': 'touch-target-large',
        'extra-large': 'touch-target-extra-large'
      },
      spacing: {
        'tight': 'touch-spacing-tight',
        'normal': 'touch-spacing-normal',
        'relaxed': 'touch-spacing-relaxed',
        'loose': 'touch-spacing-loose'
      },
      style: {
        'default': 'touch-style-default',
        'highlight': 'touch-style-highlight',
        'outline': 'touch-style-outline',
        'glow': 'touch-style-glow'
      },
      feedback: {
        'none': 'touch-feedback-none',
        'visual': 'touch-feedback-visual',
        'haptic': 'touch-feedback-haptic',
        'both': 'touch-feedback-both'
      }
    },
    defaultVariants: {
      size: 'medium',
      spacing: 'normal',
      style: 'default',
      feedback: 'visual'
    }
  }
);

// Touch Targets Toggle Props
interface TouchTargetsToggleProps extends VariantProps<typeof touchTargetsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Touch Targets Toggle Component
export const TouchTargetsToggle = React.forwardRef<HTMLButtonElement, TouchTargetsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.motor.touchTargets !== 'small');
    const isTouchSupported = useTouchSupport();

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        motor: {
          touchTargets: newState ? 'large' : 'small'
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
            ? 'bg-purple-600 text-white border-purple-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable large touch targets' : 'Enable large touch targets'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Large touch targets enabled' : 'Large touch targets disabled'}
            {!isTouchSupported && ' (Touch not supported)'}
          </span>
        )}
      </button>
    );
  }
);

TouchTargetsToggle.displayName = 'TouchTargetsToggle';

// Touch Targets Selector Props
interface TouchTargetsSelectorProps extends VariantProps<typeof touchTargetsVariants> {
  className?: string;
  onSizeChange?: (size: string) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Touch Targets Selector Component
export const TouchTargetsSelector = React.forwardRef<HTMLDivElement, TouchTargetsSelectorProps>(
  ({ 
    className, 
    onSizeChange, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [currentSize, setCurrentSize] = useState(config.motor.touchTargets);

    const sizes = [
      { value: 'small', label: 'Small', description: '44px minimum', icon: '👆' },
      { value: 'medium', label: 'Medium', description: '48px recommended', icon: '👆' },
      { value: 'large', label: 'Large', description: '56px comfortable', icon: '👆' },
      { value: 'extra-large', label: 'Extra Large', description: '64px accessible', icon: '👆' }
    ];

    const handleSizeChange = useCallback((newSize: string) => {
      setCurrentSize(newSize as any);
      
      updateConfig({
        motor: {
          touchTargets: newSize as any
        }
      });
      
      onSizeChange?.(newSize);
    }, [updateConfig, onSizeChange]);

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
            Touch Target Size
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
              aria-label={`Set touch target size to ${sizeOption.label}`}
              aria-pressed={currentSize === sizeOption.value}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{sizeOption.icon}</span>
                <div className="flex flex-col">
                  <div className="font-medium">{sizeOption.label}</div>
                  <div className="text-xs opacity-80">{sizeOption.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

TouchTargetsSelector.displayName = 'TouchTargetsSelector';

// Touch Targets Provider Props
interface TouchTargetsProviderProps {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  spacing?: 'tight' | 'normal' | 'relaxed' | 'loose';
  style?: 'default' | 'highlight' | 'outline' | 'glow';
  applyToBody?: boolean;
}

// Touch Targets Provider Component
export const TouchTargetsProvider = React.forwardRef<HTMLDivElement, TouchTargetsProviderProps>(
  ({ 
    children, 
    className, 
    size = 'medium', 
    spacing = 'normal',
    style = 'default',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentSize, setCurrentSize] = useState(size);

    useEffect(() => {
      setCurrentSize(config.motor.touchTargets);
    }, [config.motor.touchTargets]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing touch target classes
        document.body.classList.remove(
          'touch-target-small',
          'touch-target-medium',
          'touch-target-large',
          'touch-target-extra-large'
        );
        
        document.body.classList.add(`touch-target-${currentSize}`);
      }
    }, [currentSize, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          touchTargetsVariants({ size: currentSize, spacing, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TouchTargetsProvider.displayName = 'TouchTargetsProvider';

// Touch Targets Button Component
interface TouchTargetsButtonProps extends VariantProps<typeof touchTargetsVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  feedback?: 'none' | 'visual' | 'haptic' | 'both';
}

export const TouchTargetsButton = React.forwardRef<HTMLButtonElement, TouchTargetsButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    size,
    feedback = 'visual',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const currentSize = size || config.motor.touchTargets;

    const sizeClasses = {
      small: 'min-h-[44px] min-w-[44px] px-3 py-2',
      medium: 'min-h-[48px] min-w-[48px] px-4 py-2',
      large: 'min-h-[56px] min-w-[56px] px-4 py-3',
      'extra-large': 'min-h-[64px] min-w-[64px] px-6 py-4'
    };

    const handleTouchStart = useCallback(() => {
      if (feedback === 'haptic' || feedback === 'both') {
        // Trigger haptic feedback if supported
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    }, [feedback]);

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        onTouchStart={handleTouchStart}
        className={cn(
          'rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[currentSize],
          touchTargetsVariants({ 
            size: currentSize,
            feedback
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

TouchTargetsButton.displayName = 'TouchTargetsButton';

// Touch Targets Status Component
interface TouchTargetsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const TouchTargetsStatus = React.forwardRef<HTMLDivElement, TouchTargetsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const currentSize = config.motor.touchTargets;
    const isTouchSupported = useTouchSupport();

    const sizeMap = {
      small: 'Small (44px)',
      medium: 'Medium (48px)',
      large: 'Large (56px)',
      'extra-large': 'Extra Large (64px)'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-purple-500" />
        <span className="font-medium">
          Touch Targets: {sizeMap[currentSize]}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isTouchSupported 
              ? `Optimized for ${currentSize} touch targets` 
              : 'Touch not supported'
            }
          </div>
        )}
      </div>
    );
  }
);

TouchTargetsStatus.displayName = 'TouchTargetsStatus';

// Touch Targets Demo Component
interface TouchTargetsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const TouchTargetsDemo = React.forwardRef<HTMLDivElement, TouchTargetsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const currentSize = config.motor.touchTargets;
    const isTouchSupported = useTouchSupport();

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Touch Targets Demo</h3>
        
        <div className="flex flex-wrap gap-4">
          <TouchTargetsButton
            size={currentSize}
            feedback="both"
            onClick={() => console.log('Small button clicked')}
          >
            Small Button
          </TouchTargetsButton>
          
          <TouchTargetsButton
            size={currentSize}
            feedback="both"
            onClick={() => console.log('Medium button clicked')}
          >
            Medium Button
          </TouchTargetsButton>
          
          <TouchTargetsButton
            size={currentSize}
            feedback="both"
            onClick={() => console.log('Large button clicked')}
          >
            Large Button
          </TouchTargetsButton>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <TouchTargetsButton
            size={currentSize}
            feedback="both"
            onClick={() => console.log('Grid button 1 clicked')}
          >
            Grid Button 1
          </TouchTargetsButton>
          
          <TouchTargetsButton
            size={currentSize}
            feedback="both"
            onClick={() => console.log('Grid button 2 clicked')}
          >
            Grid Button 2
          </TouchTargetsButton>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isTouchSupported 
                ? `Touch targets are optimized for ${currentSize} size. Try tapping the buttons above.`
                : 'Touch targets are not applicable on this device.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

TouchTargetsDemo.displayName = 'TouchTargetsDemo';

// Export all components
export {
  touchTargetsVariants,
  type TouchTargetsToggleProps,
  type TouchTargetsSelectorProps,
  type TouchTargetsProviderProps,
  type TouchTargetsButtonProps,
  type TouchTargetsStatusProps,
  type TouchTargetsDemoProps
};
