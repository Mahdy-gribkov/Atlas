/**
 * Sound Alerts Component
 * 
 * Provides sound alerts support for hearing accessibility.
 * Implements WCAG 2.1 AA sound alerts requirements and hearing accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Sound Alerts Variants
const soundAlertsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'sound-alerts-standard',
        'enhanced': 'sound-alerts-enhanced',
        'comprehensive': 'sound-alerts-comprehensive',
        'custom': 'sound-alerts-custom'
      },
      type: {
        'notification': 'alert-type-notification',
        'warning': 'alert-type-warning',
        'error': 'alert-type-error',
        'success': 'alert-type-success',
        'info': 'alert-type-info'
      },
      style: {
        'subtle': 'alert-style-subtle',
        'moderate': 'alert-style-moderate',
        'prominent': 'alert-style-prominent',
        'custom': 'alert-style-custom'
      },
      frequency: {
        'low': 'alert-frequency-low',
        'medium': 'alert-frequency-medium',
        'high': 'alert-frequency-high',
        'custom': 'alert-frequency-custom'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'notification',
      style: 'moderate',
      frequency: 'medium'
    }
  }
);

// Sound Alerts Toggle Props
interface SoundAlertsToggleProps extends VariantProps<typeof soundAlertsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Sound Alerts Toggle Component
export const SoundAlertsToggle = React.forwardRef<HTMLButtonElement, SoundAlertsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.hearing.soundAlerts);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        hearing: {
          soundAlerts: newState
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
            ? 'bg-red-600 text-white border-red-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable sound alerts' : 'Enable sound alerts'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Sound alerts enabled' : 'Sound alerts disabled'}
          </span>
        )}
      </button>
    );
  }
);

SoundAlertsToggle.displayName = 'SoundAlertsToggle';

// Sound Alerts Provider Props
interface SoundAlertsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'notification' | 'warning' | 'error' | 'success' | 'info';
  style?: 'subtle' | 'moderate' | 'prominent' | 'custom';
  applyToBody?: boolean;
}

// Sound Alerts Provider Component
export const SoundAlertsProvider = React.forwardRef<HTMLDivElement, SoundAlertsProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'notification',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.hearing.soundAlerts) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.hearing.soundAlerts]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing sound alerts classes
        document.body.classList.remove(
          'sound-alerts-standard',
          'sound-alerts-enhanced',
          'sound-alerts-comprehensive',
          'sound-alerts-custom'
        );
        
        document.body.classList.add(`sound-alerts-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          soundAlertsVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SoundAlertsProvider.displayName = 'SoundAlertsProvider';

// Sound Alerts Notification Component
interface SoundAlertsNotificationProps extends VariantProps<typeof soundAlertsVariants> {
  className?: string;
  children: React.ReactNode;
  title?: string;
  type?: 'notification' | 'warning' | 'error' | 'success' | 'info';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'subtle' | 'moderate' | 'prominent' | 'custom';
  frequency?: 'low' | 'medium' | 'high' | 'custom';
  onDismiss?: () => void;
  autoDismiss?: boolean;
  duration?: number;
}

export const SoundAlertsNotification = React.forwardRef<HTMLDivElement, SoundAlertsNotificationProps>(
  ({ 
    className, 
    children,
    title,
    type = 'notification',
    mode = 'standard',
    style = 'moderate',
    frequency = 'medium',
    onDismiss,
    autoDismiss = false,
    duration = 5000,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isSoundAlertsEnabled = config.hearing.soundAlerts;
    const [isVisible, setIsVisible] = useState(true);

    const typeClasses = {
      notification: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
      warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      error: 'border-red-500 bg-red-50 dark:bg-red-900/20',
      success: 'border-green-500 bg-green-50 dark:bg-green-900/20',
      info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
    };

    const typeIcons = {
      notification: '🔔',
      warning: '⚠️',
      error: '❌',
      success: '✅',
      info: 'ℹ️'
    };

    const frequencyIcons = {
      low: '🔉',
      medium: '🔊',
      high: '📢'
    };

    useEffect(() => {
      if (isSoundAlertsEnabled) {
        // In a real implementation, this would play actual audio
        console.log(`Playing ${type} alert sound with ${frequency} frequency`);
      }
    }, [isSoundAlertsEnabled, type, frequency]);

    useEffect(() => {
      if (autoDismiss && isVisible) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onDismiss?.();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [autoDismiss, isVisible, duration, onDismiss]);

    const handleDismiss = useCallback(() => {
      setIsVisible(false);
      onDismiss?.();
    }, [onDismiss]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 transition-all duration-300',
          soundAlertsVariants({ 
            mode: isSoundAlertsEnabled ? 'enhanced' : mode,
            type,
            style,
            frequency
          }),
          typeClasses[type],
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg">{typeIcons[type]}</span>
          <div className="flex-1">
            {title && (
              <h4 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">
                {title}
              </h4>
            )}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {children}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSoundAlertsEnabled && (
              <span className="text-sm">{frequencyIcons[frequency]}</span>
            )}
            {onDismiss && (
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Dismiss alert"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SoundAlertsNotification.displayName = 'SoundAlertsNotification';

// Sound Alerts Status Component
interface SoundAlertsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const SoundAlertsStatus = React.forwardRef<HTMLDivElement, SoundAlertsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isSoundAlertsEnabled = config.hearing.soundAlerts;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <span className="font-medium">
          Sound Alerts: {isSoundAlertsEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isSoundAlertsEnabled 
              ? 'Enhanced sound alerts and notifications' 
              : 'Standard notifications'
            }
          </div>
        )}
      </div>
    );
  }
);

SoundAlertsStatus.displayName = 'SoundAlertsStatus';

// Sound Alerts Demo Component
interface SoundAlertsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const SoundAlertsDemo = React.forwardRef<HTMLDivElement, SoundAlertsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isSoundAlertsEnabled = config.hearing.soundAlerts;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Sound Alerts Demo</h3>
        
        <div className="space-y-4">
          <SoundAlertsNotification
            mode={isSoundAlertsEnabled ? 'enhanced' : 'standard'}
            type={isSoundAlertsEnabled ? 'success' : 'success'}
            style={isSoundAlertsEnabled ? 'prominent' : 'moderate'}
            frequency={isSoundAlertsEnabled ? 'high' : 'medium'}
            title="Booking Confirmed"
            onDismiss={() => console.log('Success alert dismissed')}
          >
            Your flight booking has been confirmed successfully.
          </SoundAlertsNotification>
          
          <SoundAlertsNotification
            mode={isSoundAlertsEnabled ? 'enhanced' : 'standard'}
            type={isSoundAlertsEnabled ? 'warning' : 'warning'}
            style={isSoundAlertsEnabled ? 'prominent' : 'moderate'}
            frequency={isSoundAlertsEnabled ? 'high' : 'medium'}
            title="Payment Required"
            onDismiss={() => console.log('Warning alert dismissed')}
          >
            Please complete your payment to confirm your booking.
          </SoundAlertsNotification>
          
          <SoundAlertsNotification
            mode={isSoundAlertsEnabled ? 'enhanced' : 'standard'}
            type={isSoundAlertsEnabled ? 'error' : 'error'}
            style={isSoundAlertsEnabled ? 'prominent' : 'moderate'}
            frequency={isSoundAlertsEnabled ? 'high' : 'medium'}
            title="Booking Failed"
            onDismiss={() => console.log('Error alert dismissed')}
          >
            There was an error processing your booking. Please try again.
          </SoundAlertsNotification>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSoundAlertsEnabled 
                ? 'Sound alerts are enabled. Audio notifications are provided for important events.'
                : 'Standard notifications are used. Enable sound alerts for audio notifications.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

SoundAlertsDemo.displayName = 'SoundAlertsDemo';

// Export all components
export {
  soundAlertsVariants,
  type SoundAlertsToggleProps,
  type SoundAlertsProviderProps,
  type SoundAlertsNotificationProps,
  type SoundAlertsStatusProps,
  type SoundAlertsDemoProps
};
