/**
 * One-Handed Mode Component
 * 
 * Provides one-handed mode support for motor accessibility.
 * Implements WCAG 2.1 AA one-handed mode requirements and reach optimization.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// One-Handed Mode Variants
const oneHandedModeVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'disabled': 'one-handed-disabled',
        'left': 'one-handed-left',
        'right': 'one-handed-right',
        'auto': 'one-handed-auto'
      },
      layout: {
        'standard': 'one-handed-layout-standard',
        'compact': 'one-handed-layout-compact',
        'expanded': 'one-handed-layout-expanded',
        'custom': 'one-handed-layout-custom'
      },
      position: {
        'top': 'one-handed-position-top',
        'bottom': 'one-handed-position-bottom',
        'side': 'one-handed-position-side',
        'center': 'one-handed-position-center'
      },
      size: {
        'small': 'one-handed-size-small',
        'medium': 'one-handed-size-medium',
        'large': 'one-handed-size-large',
        'extra-large': 'one-handed-size-extra-large'
      }
    },
    defaultVariants: {
      mode: 'disabled',
      layout: 'standard',
      position: 'bottom',
      size: 'medium'
    }
  }
);

// One-Handed Mode Toggle Props
interface OneHandedModeToggleProps extends VariantProps<typeof oneHandedModeVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// One-Handed Mode Toggle Component
export const OneHandedModeToggle = React.forwardRef<HTMLButtonElement, OneHandedModeToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.motor.oneHandedMode);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        motor: {
          oneHandedMode: newState
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
            ? 'bg-pink-600 text-white border-pink-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable one-handed mode' : 'Enable one-handed mode'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'One-handed mode enabled' : 'One-handed mode disabled'}
          </span>
        )}
      </button>
    );
  }
);

OneHandedModeToggle.displayName = 'OneHandedModeToggle';

// One-Handed Mode Selector Props
interface OneHandedModeSelectorProps extends VariantProps<typeof oneHandedModeVariants> {
  className?: string;
  onModeChange?: (mode: string) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// One-Handed Mode Selector Component
export const OneHandedModeSelector = React.forwardRef<HTMLDivElement, OneHandedModeSelectorProps>(
  ({ 
    className, 
    onModeChange, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [currentMode, setCurrentMode] = useState('disabled');

    const modes = [
      { value: 'disabled', label: 'Disabled', description: 'Standard two-handed layout', icon: '👥' },
      { value: 'left', label: 'Left Hand', description: 'Optimized for left hand', icon: '👈' },
      { value: 'right', label: 'Right Hand', description: 'Optimized for right hand', icon: '👉' },
      { value: 'auto', label: 'Auto', description: 'Automatic detection', icon: '🔄' }
    ];

    const handleModeChange = useCallback((newMode: string) => {
      setCurrentMode(newMode);
      
      updateConfig({
        motor: {
          oneHandedMode: newMode !== 'disabled'
        }
      });
      
      onModeChange?.(newMode);
    }, [updateConfig, onModeChange]);

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
            One-Handed Mode
          </span>
        )}
        
        <div className="flex flex-col gap-1">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => handleModeChange(mode.value)}
              className={cn(
                'w-full px-2 py-1 text-xs rounded transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
                currentMode === mode.value 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 dark:text-gray-300'
              )}
              aria-label={`Set one-handed mode to ${mode.label}`}
              aria-pressed={currentMode === mode.value}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{mode.icon}</span>
                <div className="flex flex-col">
                  <div className="font-medium">{mode.label}</div>
                  <div className="text-xs opacity-80">{mode.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

OneHandedModeSelector.displayName = 'OneHandedModeSelector';

// One-Handed Mode Provider Props
interface OneHandedModeProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'disabled' | 'left' | 'right' | 'auto';
  layout?: 'standard' | 'compact' | 'expanded' | 'custom';
  position?: 'top' | 'bottom' | 'side' | 'center';
  applyToBody?: boolean;
}

// One-Handed Mode Provider Component
export const OneHandedModeProvider = React.forwardRef<HTMLDivElement, OneHandedModeProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'disabled', 
    layout = 'standard',
    position = 'bottom',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.motor.oneHandedMode) {
        setCurrentMode('right'); // Default to right hand
      } else {
        setCurrentMode('disabled');
      }
    }, [config.motor.oneHandedMode]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing one-handed mode classes
        document.body.classList.remove(
          'one-handed-disabled',
          'one-handed-left',
          'one-handed-right',
          'one-handed-auto'
        );
        
        document.body.classList.add(`one-handed-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          oneHandedModeVariants({ mode: currentMode, layout, position }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

OneHandedModeProvider.displayName = 'OneHandedModeProvider';

// One-Handed Mode Button Component
interface OneHandedModeButtonProps extends VariantProps<typeof oneHandedModeVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  mode?: 'disabled' | 'left' | 'right' | 'auto';
  position?: 'top' | 'bottom' | 'side' | 'center';
}

export const OneHandedModeButton = React.forwardRef<HTMLButtonElement, OneHandedModeButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    mode = 'disabled',
    position = 'bottom',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const currentMode = config.motor.oneHandedMode ? 'right' : 'disabled';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          oneHandedModeVariants({ 
            mode: currentMode,
            position
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

OneHandedModeButton.displayName = 'OneHandedModeButton';

// One-Handed Mode Status Component
interface OneHandedModeStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const OneHandedModeStatus = React.forwardRef<HTMLDivElement, OneHandedModeStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isOneHandedModeEnabled = config.motor.oneHandedMode;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-pink-500" />
        <span className="font-medium">
          One-Handed Mode: {isOneHandedModeEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isOneHandedModeEnabled 
              ? 'Layout optimized for single-handed operation' 
              : 'Standard two-handed layout'
            }
          </div>
        )}
      </div>
    );
  }
);

OneHandedModeStatus.displayName = 'OneHandedModeStatus';

// One-Handed Mode Demo Component
interface OneHandedModeDemoProps {
  className?: string;
  showControls?: boolean;
}

export const OneHandedModeDemo = React.forwardRef<HTMLDivElement, OneHandedModeDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isOneHandedModeEnabled = config.motor.oneHandedMode;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">One-Handed Mode Demo</h3>
        
        <div className={cn(
          'flex gap-2',
          isOneHandedModeEnabled ? 'flex-col items-end' : 'flex-row'
        )}>
          <OneHandedModeButton
            mode={isOneHandedModeEnabled ? 'right' : 'disabled'}
            position={isOneHandedModeEnabled ? 'bottom' : 'center'}
            onClick={() => console.log('Primary button clicked')}
          >
            Primary Action
          </OneHandedModeButton>
          
          <OneHandedModeButton
            mode={isOneHandedModeEnabled ? 'right' : 'disabled'}
            position={isOneHandedModeEnabled ? 'bottom' : 'center'}
            onClick={() => console.log('Secondary button clicked')}
          >
            Secondary Action
          </OneHandedModeButton>
          
          <OneHandedModeButton
            mode={isOneHandedModeEnabled ? 'right' : 'disabled'}
            position={isOneHandedModeEnabled ? 'bottom' : 'center'}
            onClick={() => console.log('Tertiary button clicked')}
          >
            Tertiary Action
          </OneHandedModeButton>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isOneHandedModeEnabled 
                ? 'One-handed mode is enabled. Controls are positioned for easy single-handed access.'
                : 'Standard layout is used. Enable one-handed mode for single-handed operation.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

OneHandedModeDemo.displayName = 'OneHandedModeDemo';

// Export all components
export {
  oneHandedModeVariants,
  type OneHandedModeToggleProps,
  type OneHandedModeSelectorProps,
  type OneHandedModeProviderProps,
  type OneHandedModeButtonProps,
  type OneHandedModeStatusProps,
  type OneHandedModeDemoProps
};
