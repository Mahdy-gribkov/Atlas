/**
 * Timeout Controls Component
 * 
 * Provides timeout controls for motor accessibility.
 * Implements WCAG 2.1 AA timeout control requirements and user preference management.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Timeout Controls Variants
const timeoutControlsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'timeout-standard',
        'extended': 'timeout-extended',
        'disabled': 'timeout-disabled',
        'custom': 'timeout-custom'
      },
      duration: {
        'short': 'timeout-duration-short',
        'medium': 'timeout-duration-medium',
        'long': 'timeout-duration-long',
        'custom': 'timeout-duration-custom'
      },
      warning: {
        'none': 'timeout-warning-none',
        'early': 'timeout-warning-early',
        'late': 'timeout-warning-late',
        'custom': 'timeout-warning-custom'
      },
      action: {
        'none': 'timeout-action-none',
        'pause': 'timeout-action-pause',
        'extend': 'timeout-action-extend',
        'reset': 'timeout-action-reset'
      }
    },
    defaultVariants: {
      mode: 'standard',
      duration: 'medium',
      warning: 'early',
      action: 'extend'
    }
  }
);

// Timeout Controls Toggle Props
interface TimeoutControlsToggleProps extends VariantProps<typeof timeoutControlsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Timeout Controls Toggle Component
export const TimeoutControlsToggle = React.forwardRef<HTMLButtonElement, TimeoutControlsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.motor.timeoutControls);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        motor: {
          timeoutControls: newState
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
            ? 'bg-amber-600 text-white border-amber-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable timeout controls' : 'Enable timeout controls'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Timeout controls enabled' : 'Timeout controls disabled'}
          </span>
        )}
      </button>
    );
  }
);

TimeoutControlsToggle.displayName = 'TimeoutControlsToggle';

// Timeout Controls Selector Props
interface TimeoutControlsSelectorProps extends VariantProps<typeof timeoutControlsVariants> {
  className?: string;
  onModeChange?: (mode: string) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Timeout Controls Selector Component
export const TimeoutControlsSelector = React.forwardRef<HTMLDivElement, TimeoutControlsSelectorProps>(
  ({ 
    className, 
    onModeChange, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [currentMode, setCurrentMode] = useState('standard');

    const modes = [
      { value: 'standard', label: 'Standard', description: 'Default timeout settings', icon: '⏱️' },
      { value: 'extended', label: 'Extended', description: 'Longer timeout periods', icon: '⏰' },
      { value: 'disabled', label: 'Disabled', description: 'No timeouts', icon: '🚫' },
      { value: 'custom', label: 'Custom', description: 'User-defined settings', icon: '⚙️' }
    ];

    const handleModeChange = useCallback((newMode: string) => {
      setCurrentMode(newMode);
      
      updateConfig({
        motor: {
          timeoutControls: newMode !== 'disabled'
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
            Timeout Controls
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
              aria-label={`Set timeout mode to ${mode.label}`}
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

TimeoutControlsSelector.displayName = 'TimeoutControlsSelector';

// Timeout Controls Provider Props
interface TimeoutControlsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'extended' | 'disabled' | 'custom';
  duration?: 'short' | 'medium' | 'long' | 'custom';
  warning?: 'none' | 'early' | 'late' | 'custom';
  applyToBody?: boolean;
}

// Timeout Controls Provider Component
export const TimeoutControlsProvider = React.forwardRef<HTMLDivElement, TimeoutControlsProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    duration = 'medium',
    warning = 'early',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.motor.timeoutControls) {
        setCurrentMode(mode);
      } else {
        setCurrentMode('disabled');
      }
    }, [config.motor.timeoutControls, mode]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing timeout controls classes
        document.body.classList.remove(
          'timeout-standard',
          'timeout-extended',
          'timeout-disabled',
          'timeout-custom'
        );
        
        document.body.classList.add(`timeout-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          timeoutControlsVariants({ mode: currentMode, duration, warning }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TimeoutControlsProvider.displayName = 'TimeoutControlsProvider';

// Timeout Controls Button Component
interface TimeoutControlsButtonProps extends VariantProps<typeof timeoutControlsVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  timeoutAction?: string;
  mode?: 'standard' | 'extended' | 'disabled' | 'custom';
}

export const TimeoutControlsButton = React.forwardRef<HTMLButtonElement, TimeoutControlsButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    timeoutAction,
    mode = 'standard',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isTimeoutControlsEnabled = config.motor.timeoutControls;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          timeoutControlsVariants({ 
            mode: isTimeoutControlsEnabled ? mode : 'disabled'
          }),
          className
        )}
        data-timeout-action={timeoutAction}
        aria-describedby={timeoutAction ? `${ref}-timeout-info` : undefined}
        {...props}
      >
        {children}
        {timeoutAction && (
          <span id={`${ref}-timeout-info`} className="sr-only">
            Timeout action: {timeoutAction}
          </span>
        )}
      </button>
    );
  }
);

TimeoutControlsButton.displayName = 'TimeoutControlsButton';

// Timeout Controls Status Component
interface TimeoutControlsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const TimeoutControlsStatus = React.forwardRef<HTMLDivElement, TimeoutControlsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isTimeoutControlsEnabled = config.motor.timeoutControls;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-amber-500" />
        <span className="font-medium">
          Timeout Controls: {isTimeoutControlsEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isTimeoutControlsEnabled 
              ? 'Extended timeout periods and user control' 
              : 'Standard timeout behavior'
            }
          </div>
        )}
      </div>
    );
  }
);

TimeoutControlsStatus.displayName = 'TimeoutControlsStatus';

// Timeout Controls Demo Component
interface TimeoutControlsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const TimeoutControlsDemo = React.forwardRef<HTMLDivElement, TimeoutControlsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isTimeoutControlsEnabled = config.motor.timeoutControls;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Timeout Controls Demo</h3>
        
        <div className="flex gap-2">
          <TimeoutControlsButton
            mode={isTimeoutControlsEnabled ? 'extended' : 'standard'}
            timeoutAction="extend"
            onClick={() => console.log('Extend timeout clicked')}
          >
            Extend Timeout
          </TimeoutControlsButton>
          
          <TimeoutControlsButton
            mode={isTimeoutControlsEnabled ? 'extended' : 'standard'}
            timeoutAction="pause"
            onClick={() => console.log('Pause timeout clicked')}
          >
            Pause Timeout
          </TimeoutControlsButton>
          
          <TimeoutControlsButton
            mode={isTimeoutControlsEnabled ? 'extended' : 'standard'}
            timeoutAction="reset"
            onClick={() => console.log('Reset timeout clicked')}
          >
            Reset Timeout
          </TimeoutControlsButton>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <TimeoutControlsButton
            mode={isTimeoutControlsEnabled ? 'extended' : 'standard'}
            timeoutAction="disable"
            onClick={() => console.log('Disable timeout clicked')}
          >
            Disable Timeout
          </TimeoutControlsButton>
          
          <TimeoutControlsButton
            mode={isTimeoutControlsEnabled ? 'extended' : 'standard'}
            timeoutAction="custom"
            onClick={() => console.log('Custom timeout clicked')}
          >
            Custom Timeout
          </TimeoutControlsButton>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isTimeoutControlsEnabled 
                ? 'Timeout controls are enabled. Use the buttons to manage timeout behavior.'
                : 'Standard timeout behavior is used. Enable timeout controls for extended periods.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

TimeoutControlsDemo.displayName = 'TimeoutControlsDemo';

// Export all components
export {
  timeoutControlsVariants,
  type TimeoutControlsToggleProps,
  type TimeoutControlsSelectorProps,
  type TimeoutControlsProviderProps,
  type TimeoutControlsButtonProps,
  type TimeoutControlsStatusProps,
  type TimeoutControlsDemoProps
};
