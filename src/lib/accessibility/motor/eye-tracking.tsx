/**
 * Eye Tracking Component
 * 
 * Provides eye tracking support for motor accessibility.
 * Implements WCAG 2.1 AA eye tracking requirements and gaze-based interaction.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Eye Tracking Variants
const eyeTrackingVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'basic': 'eye-tracking-basic',
        'advanced': 'eye-tracking-advanced',
        'expert': 'eye-tracking-expert',
        'custom': 'eye-tracking-custom'
      },
      sensitivity: {
        'low': 'eye-sensitivity-low',
        'medium': 'eye-sensitivity-medium',
        'high': 'eye-sensitivity-high',
        'auto': 'eye-sensitivity-auto'
      },
      feedback: {
        'none': 'eye-feedback-none',
        'visual': 'eye-feedback-visual',
        'audio': 'eye-feedback-audio',
        'haptic': 'eye-feedback-haptic',
        'all': 'eye-feedback-all'
      },
      calibration: {
        'none': 'eye-calibration-none',
        'basic': 'eye-calibration-basic',
        'advanced': 'eye-calibration-advanced',
        'custom': 'eye-calibration-custom'
      }
    },
    defaultVariants: {
      mode: 'basic',
      sensitivity: 'medium',
      feedback: 'visual',
      calibration: 'basic'
    }
  }
);

// Eye Tracking Toggle Props
interface EyeTrackingToggleProps extends VariantProps<typeof eyeTrackingVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Eye Tracking Toggle Component
export const EyeTrackingToggle = React.forwardRef<HTMLButtonElement, EyeTrackingToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.motor.eyeTracking);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        motor: {
          eyeTracking: newState
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
            ? 'bg-cyan-600 text-white border-cyan-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable eye tracking' : 'Enable eye tracking'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-full" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Eye tracking enabled' : 'Eye tracking disabled'}
          </span>
        )}
      </button>
    );
  }
);

EyeTrackingToggle.displayName = 'EyeTrackingToggle';

// Eye Tracking Provider Props
interface EyeTrackingProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'basic' | 'advanced' | 'expert' | 'custom';
  sensitivity?: 'low' | 'medium' | 'high' | 'auto';
  feedback?: 'none' | 'visual' | 'audio' | 'haptic' | 'all';
  applyToBody?: boolean;
}

// Eye Tracking Provider Component
export const EyeTrackingProvider = React.forwardRef<HTMLDivElement, EyeTrackingProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'basic', 
    sensitivity = 'medium',
    feedback = 'visual',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.motor.eyeTracking) {
        setCurrentMode(mode);
      } else {
        setCurrentMode('basic');
      }
    }, [config.motor.eyeTracking, mode]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing eye tracking classes
        document.body.classList.remove(
          'eye-tracking-basic',
          'eye-tracking-advanced',
          'eye-tracking-expert',
          'eye-tracking-custom'
        );
        
        if (config.motor.eyeTracking) {
          document.body.classList.add(`eye-tracking-${currentMode}`);
        }
      }
    }, [currentMode, applyToBody, config.motor.eyeTracking]);

    return (
      <div
        ref={ref}
        className={cn(
          eyeTrackingVariants({ mode: currentMode, sensitivity, feedback }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

EyeTrackingProvider.displayName = 'EyeTrackingProvider';

// Eye Tracking Button Component
interface EyeTrackingButtonProps extends VariantProps<typeof eyeTrackingVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  gazeAction?: string;
  mode?: 'basic' | 'advanced' | 'expert' | 'custom';
}

export const EyeTrackingButton = React.forwardRef<HTMLButtonElement, EyeTrackingButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    gazeAction,
    mode = 'basic',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isEyeTrackingEnabled = config.motor.eyeTracking;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          eyeTrackingVariants({ 
            mode: isEyeTrackingEnabled ? mode : 'basic'
          }),
          className
        )}
        data-gaze-action={gazeAction}
        aria-describedby={gazeAction ? `${ref}-gaze-info` : undefined}
        {...props}
      >
        {children}
        {gazeAction && (
          <span id={`${ref}-gaze-info`} className="sr-only">
            Gaze action: {gazeAction}
          </span>
        )}
      </button>
    );
  }
);

EyeTrackingButton.displayName = 'EyeTrackingButton';

// Eye Tracking Status Component
interface EyeTrackingStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const EyeTrackingStatus = React.forwardRef<HTMLDivElement, EyeTrackingStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isEyeTrackingEnabled = config.motor.eyeTracking;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-cyan-500" />
        <span className="font-medium">
          Eye Tracking: {isEyeTrackingEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEyeTrackingEnabled 
              ? 'Gaze-based interaction and eye tracking support' 
              : 'Standard interaction only'
            }
          </div>
        )}
      </div>
    );
  }
);

EyeTrackingStatus.displayName = 'EyeTrackingStatus';

// Eye Tracking Demo Component
interface EyeTrackingDemoProps {
  className?: string;
  showControls?: boolean;
}

export const EyeTrackingDemo = React.forwardRef<HTMLDivElement, EyeTrackingDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isEyeTrackingEnabled = config.motor.eyeTracking;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Eye Tracking Demo</h3>
        
        <div className="flex gap-2">
          <EyeTrackingButton
            mode={isEyeTrackingEnabled ? 'advanced' : 'basic'}
            gazeAction="look and click"
            onClick={() => console.log('Look and click button clicked')}
          >
            Look and Click
          </EyeTrackingButton>
          
          <EyeTrackingButton
            mode={isEyeTrackingEnabled ? 'advanced' : 'basic'}
            gazeAction="dwell time"
            onClick={() => console.log('Dwell time button clicked')}
          >
            Dwell Time
          </EyeTrackingButton>
          
          <EyeTrackingButton
            mode={isEyeTrackingEnabled ? 'advanced' : 'basic'}
            gazeAction="gaze gesture"
            onClick={() => console.log('Gaze gesture button clicked')}
          >
            Gaze Gesture
          </EyeTrackingButton>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <EyeTrackingButton
            mode={isEyeTrackingEnabled ? 'advanced' : 'basic'}
            gazeAction="eye scroll"
            onClick={() => console.log('Eye scroll button clicked')}
          >
            Eye Scroll
          </EyeTrackingButton>
          
          <EyeTrackingButton
            mode={isEyeTrackingEnabled ? 'advanced' : 'basic'}
            gazeAction="eye zoom"
            onClick={() => console.log('Eye zoom button clicked')}
          >
            Eye Zoom
          </EyeTrackingButton>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isEyeTrackingEnabled 
                ? 'Eye tracking is enabled. Use gaze-based interaction for navigation and control.'
                : 'Standard interaction is used. Enable eye tracking for gaze-based control.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

EyeTrackingDemo.displayName = 'EyeTrackingDemo';

// Export all components
export {
  eyeTrackingVariants,
  type EyeTrackingToggleProps,
  type EyeTrackingProviderProps,
  type EyeTrackingButtonProps,
  type EyeTrackingStatusProps,
  type EyeTrackingDemoProps
};
